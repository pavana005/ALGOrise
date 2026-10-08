import { authService } from './authService';
import type { InterviewQuestion } from '../data/interviewData';

export interface CriterionScore {
  name: string;
  score: number | 'N/A';
  maxScore: number | 'N/A';
  rationale: string;
}

export interface TechnicalCorrection {
  userClaim: string;
  correction: string;
  explanation: string;
}

export interface StructuredEvaluationResult {
  id: string;
  userId: string;
  questionId: string;
  attemptNumber: number;
  overallScore: number;
  partiallyEvaluable?: boolean;
  partiallyEvaluableReason?: string;

  criterionScores: CriterionScore[];
  coveredConcepts: string[];
  missingConcepts: string[];
  incorrectConcepts: TechnicalCorrection[];

  strengths: string[];
  weaknesses: string[];
  suggestedImprovement: string;

  whatImprovedBetweenAttempts?: string[];
  scoreDifference?: number;

  createdAt: number;
}

const STORAGE_INTERVIEW_EVALUATIONS_KEY = 'algorise_interview_evaluations_v1';

class InterviewEvaluationService {
  private getStorageKey(userId: string): string {
    return `${STORAGE_INTERVIEW_EVALUATIONS_KEY}_${userId}`;
  }

  private getUserEvaluationsDB(userId: string): Record<string, StructuredEvaluationResult[]> {
    try {
      const raw = localStorage.getItem(this.getStorageKey(userId));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveUserEvaluationsDB(userId: string, data: Record<string, StructuredEvaluationResult[]>): void {
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist interview evaluation:', e);
    }
  }

  public getQuestionEvaluations(token: string | null, questionId: string): StructuredEvaluationResult[] {
    const user = authService.validateSessionToken(token);
    if (!user) return [];
    const db = this.getUserEvaluationsDB(user.id);
    return db[questionId] || [];
  }

  public evaluateAnswer(
    token: string | null,
    question: InterviewQuestion,
    userAnswerText: string,
    attemptNumber: number = 1,
    previousEvaluation?: StructuredEvaluationResult
  ): StructuredEvaluationResult {
    const currentUser = authService.validateSessionToken(token);
    if (!currentUser) {
      throw new Error('Unauthorized: Valid session token required for answer evaluation.');
    }

    const trimmedAnswer = userAnswerText.trim();
    const lowerAnswer = trimmedAnswer.toLowerCase();
    const now = Date.now();

    // Check if answer is too brief to evaluate meaningfully
    if (trimmedAnswer.length < 15) {
      const emptyResult: StructuredEvaluationResult = {
        id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: currentUser.id,
        questionId: question.id,
        attemptNumber,
        overallScore: 15,
        partiallyEvaluable: true,
        partiallyEvaluableReason: 'Answer is too brief (fewer than 15 characters) to assess technical accuracy or concept completeness.',
        criterionScores: [
          { name: 'Relevance & Context', score: 4, maxScore: 20, rationale: 'Provided response is extremely brief.' },
          { name: 'Technical Accuracy / Depth', score: 3, maxScore: 20, rationale: 'Insufficient text to evaluate conceptual correctness.' },
          { name: 'Structure & Framework', score: 3, maxScore: 20, rationale: 'No structural framework present.' },
          { name: 'Clarity & Terminology', score: 3, maxScore: 20, rationale: 'Lacks technical terms and depth.' },
          { name: 'Completeness & Trade-offs', score: 2, maxScore: 20, rationale: 'No details or examples provided.' }
        ],
        coveredConcepts: [],
        missingConcepts: question.whatInterviewerEvaluates || ['Core definition', 'Key concepts', 'Examples'],
        incorrectConcepts: [],
        strengths: ['Submitted a response for evaluation.'],
        weaknesses: [
          'The response is too short to evaluate properly.',
          'Missing key technical definitions and examples.'
        ],
        suggestedImprovement: `Write a complete answer explaining ${question.question}. Include key definitions, practical examples, and time/space complexity or trade-offs.`,
        createdAt: now
      };

      this.saveEvaluationRecord(currentUser.id, question.id, emptyResult);
      return emptyResult;
    }

    // Determine round category evaluation logic
    const evalResult = this.computeStructuredEvaluation(
      currentUser.id,
      question,
      trimmedAnswer,
      lowerAnswer,
      attemptNumber,
      previousEvaluation
    );

    this.saveEvaluationRecord(currentUser.id, question.id, evalResult);
    return evalResult;
  }

  private computeStructuredEvaluation(
    userId: string,
    question: InterviewQuestion,
    answerText: string,
    lowerText: string,
    attemptNumber: number,
    previousEval?: StructuredEvaluationResult
  ): StructuredEvaluationResult {
    const round = question.round;
    const coveredConcepts: string[] = [];
    const missingConcepts: string[] = [];
    const incorrectConcepts: TechnicalCorrection[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Extract reference information from question object
    const officialAnswer = (question.answer || '').toLowerCase();
    const evaluatesList = question.whatInterviewerEvaluates || [];

    // =========================================================================
    // 1. DETECT COMMON TECHNICAL MISCONCEPTIONS (EXPLICIT MISTAKE DETECTION)
    // =========================================================================
    if (lowerText.includes('hashmap') && (lowerText.includes('sorted') || lowerText.includes('keeps order') || lowerText.includes('in order'))) {
      incorrectConcepts.push({
        userClaim: 'HashMap keeps elements in sorted or insertion order.',
        correction: 'HashMaps store key-value pairs using hash functions and do NOT maintain key order.',
        explanation: 'In Java/C++/Python, standard HashMaps are unordered. Use TreeMap (or LinkedHashMap for insertion order) if ordering is required.'
      });
      weaknesses.push('Stated that HashMap stores elements in sorted order (Incorrect).');
    }

    if (lowerText.includes('binary search') && (lowerText.includes('checks every') || lowerText.includes('check every') || lowerText.includes('scans all'))) {
      incorrectConcepts.push({
        userClaim: 'Binary search checks every element sequentially.',
        correction: 'Checking every element is Linear Search O(N). Binary Search operates on sorted arrays in O(log N) time.',
        explanation: 'Binary Search repeatedly compares the middle element and divides the search space in half.'
      });
      weaknesses.push('Confused Binary Search with Linear Search (Incorrect).');
    }

    if (lowerText.includes('array') && lowerText.includes('starts from 1') || lowerText.includes('indexed from 1')) {
      incorrectConcepts.push({
        userClaim: 'Arrays start indexing from 1.',
        correction: 'In mainstream languages (Python, Java, C++, JS), arrays are 0-indexed.',
        explanation: 'The first element is located at index 0 (array[0]).'
      });
      weaknesses.push('Stated that arrays are 1-indexed (Incorrect).');
    }

    // =========================================================================
    // 2. CHECK COVERED VS MISSING CONCEPTS BASED ON QUESTION & OFFICIAL ANSWER
    // =========================================================================
    evaluatesList.forEach(evalItem => {
      const words = evalItem.toLowerCase().split(' ').filter(w => w.length > 3);
      const match = words.some(w => lowerText.includes(w));
      if (match) {
        coveredConcepts.push(evalItem);
      } else {
        missingConcepts.push(evalItem);
      }
    });

    // Check specific technical terms in official answer
    if (officialAnswer.includes('hash') || question.question.toLowerCase().includes('hashmap')) {
      if (lowerText.includes('key') && lowerText.includes('value')) coveredConcepts.push('Key-Value mapping concept');
      else missingConcepts.push('Key-Value mapping pair mechanism');

      if (lowerText.includes('o(1)') || lowerText.includes('constant time') || lowerText.includes('lookup')) coveredConcepts.push('O(1) average lookup time complexity');
      else missingConcepts.push('Lookup complexity (O(1) average)');

      if (lowerText.includes('collision')) coveredConcepts.push('Hash collision resolution handling');
      else missingConcepts.push('Collision handling (chaining or open addressing)');
    }

    if (officialAnswer.includes('solid') || question.question.toLowerCase().includes('solid')) {
      if (lowerText.includes('single responsibility') || lowerText.includes('srp')) coveredConcepts.push('Single Responsibility Principle (SRP)');
      else missingConcepts.push('Single Responsibility Principle (SRP)');

      if (lowerText.includes('open') || lowerText.includes('closed') || lowerText.includes('ocp')) coveredConcepts.push('Open/Closed Principle (OCP)');
      else missingConcepts.push('Open/Closed Principle (OCP)');

      if (lowerText.includes('liskov') || lowerText.includes('lsp')) coveredConcepts.push('Liskov Substitution Principle (LSP)');
      else missingConcepts.push('Liskov Substitution Principle (LSP)');
    }

    if (officialAnswer.includes('binary search') || question.question.toLowerCase().includes('binary search')) {
      if (lowerText.includes('sorted')) coveredConcepts.push('Sorted input array requirement');
      else missingConcepts.push('Sorted array requirement precondition');

      if (lowerText.includes('middle') || lowerText.includes('mid')) coveredConcepts.push('Middle element comparison');
      else missingConcepts.push('Middle element pivot comparison');

      if (lowerText.includes('half') || lowerText.includes('divide') || lowerText.includes('log')) coveredConcepts.push('Dividing search space in half (O(log N))');
      else missingConcepts.push('Logarithmic search space elimination O(log N)');
    }

    // Deduplicate lists
    const uniqueCovered = Array.from(new Set(coveredConcepts));
    const uniqueMissing = Array.from(new Set(missingConcepts));

    // Evaluate Strengths
    if (uniqueCovered.length > 0) {
      uniqueCovered.forEach(c => strengths.push(`Correctly identified and explained: ${c}`));
    } else {
      strengths.push('Provided a structured initial attempt addressing the prompt.');
    }

    // Evaluate Weaknesses
    if (uniqueMissing.length > 0) {
      uniqueMissing.forEach(m => weaknesses.push(`Omitted expected concept: ${m}`));
    }

    // =========================================================================
    // 3. ROUND-SPECIFIC CRITERIA SCORING
    // =========================================================================
    const criterionScores: CriterionScore[] = [];
    let totalScore = 0;

    if (round === 'Salary') {
      // SALARY & OFFER ROUND RUBRIC
      const valPropScore = lowerText.includes('market') || lowerText.includes('benchmark') || lowerText.includes('value') ? 22 : 16;
      const toneScore = !lowerText.includes('demand') && !lowerText.includes('give me') ? 23 : 15;
      const counterScore = lowerText.includes('range') || lowerText.includes('compensation') || lowerText.includes('equity') ? 22 : 14;
      const clarityScore = answerText.length > 60 ? 21 : 14;

      criterionScores.push(
        { name: 'Value Proposition & Research', score: valPropScore, maxScore: 25, rationale: valPropScore > 18 ? 'Strong reference to market research and personal engineering value.' : 'Add explicit market benchmark numbers or role-specific value.' },
        { name: 'Professional & Collaborative Tone', score: toneScore, maxScore: 25, rationale: toneScore > 18 ? 'Maintained an appreciative, professional negotiation stance.' : 'Ensure negotiation language remains polite, collaborative, and enthusiastic.' },
        { name: 'Counter Strategy & Flexibility', score: counterScore, maxScore: 25, rationale: counterScore > 18 ? 'Clearly articulated total target compensation or flexible options.' : 'Specify total compensation components (base, equity, bonus).' },
        { name: 'Clarity & Next Steps', score: clarityScore, maxScore: 25, rationale: clarityScore > 18 ? 'Set clear expectations for follow-up.' : 'Conclude with a clear request for written details or timeline.' },
        { name: 'Technical Correctness', score: 'N/A', maxScore: 'N/A', rationale: 'Not applicable for Salary & Offer negotiation questions.' }
      );

      totalScore = valPropScore + toneScore + counterScore + clarityScore;

    } else if (round === 'HR' || round === 'Behavioral' || round === 'Managerial') {
      // BEHAVIORAL & HR RUBRIC
      const isHonestNoExperience = lowerText.includes('never had') || lowerText.includes('haven\'t faced') || lowerText.includes('not experienced');

      const relevanceScore = lowerText.length > 40 ? 18 : 12;
      
      // STAR Framework check
      const hasSituation = lowerText.includes('when') || lowerText.includes('at my') || lowerText.includes('project') || lowerText.includes('team');
      const hasAction = lowerText.includes('i did') || lowerText.includes('i decided') || lowerText.includes('i created') || lowerText.includes('i communicated') || lowerText.includes('i organized');
      const hasResult = lowerText.includes('result') || lowerText.includes('led to') || lowerText.includes('achieved') || lowerText.includes('improved') || lowerText.includes('learned');

      let starScore = 12;
      if (hasSituation && hasAction && hasResult) starScore = 19;
      else if (hasAction || hasSituation) starScore = 15;
      if (isHonestNoExperience) starScore = 16; // Do not penalize honest answers

      const actionScore = hasAction ? 18 : (isHonestNoExperience ? 15 : 11);
      const resultScore = hasResult ? 18 : (isHonestNoExperience ? 14 : 10);
      const growthScore = lowerText.includes('learn') || lowerText.includes('reflect') || lowerText.includes('future') ? 18 : 12;

      criterionScores.push(
        { name: 'Relevance to Question', score: relevanceScore, maxScore: 20, rationale: 'Response addresses the scenario posed by the interviewer.' },
        { name: 'STAR Framework Structure', score: starScore, maxScore: 20, rationale: starScore >= 18 ? 'Clear Situation, Task, Action, and Result flow.' : (isHonestNoExperience ? 'Honest acknowledgement of lack of direct experience. Frame with a hypothetical or academic project.' : 'Structure answer using Situation -> Task -> Action -> Result.') },
        { name: 'Personal Action Ownership', score: actionScore, maxScore: 20, rationale: actionScore >= 16 ? 'Emphasized personal role ("I did") rather than vague team actions.' : 'Focus explicitly on your individual actions and contributions.' },
        { name: 'Measurable Result & Impact', score: resultScore, maxScore: 20, rationale: resultScore >= 16 ? 'Included a tangible outcome or resolution.' : 'Conclude with the final result or metric of success.' },
        { name: 'Reflection & Growth Mindset', score: growthScore, maxScore: 20, rationale: growthScore >= 16 ? 'Showed professional reflection and lessons learned.' : 'Add 1 sentence on what you learned or would do differently.' }
      );

      totalScore = relevanceScore + starScore + actionScore + resultScore + growthScore;

    } else if (round === 'System Design') {
      // SYSTEM DESIGN RUBRIC
      const reqScore = lowerText.includes('requirement') || lowerText.includes('scale') || lowerText.includes('users') ? 18 : 12;
      const archScore = lowerText.includes('api') || lowerText.includes('database') || lowerText.includes('service') || lowerText.includes('server') ? 18 : 12;
      const dataModelScore = lowerText.includes('sql') || lowerText.includes('nosql') || lowerText.includes('table') || lowerText.includes('schema') ? 17 : 11;
      const scaleScore = lowerText.includes('cache') || lowerText.includes('load balancer') || lowerText.includes('queue') || lowerText.includes('cdn') ? 18 : 12;
      const tradeScore = lowerText.includes('trade-off') || lowerText.includes('tradeoff') || lowerText.includes('bottleneck') || lowerText.includes('latency') ? 17 : 10;

      criterionScores.push(
        { name: 'Requirements & Scale Assumptions', score: reqScore, maxScore: 20, rationale: reqScore >= 16 ? 'Framed functional requirements and scale estimates.' : 'Start by asking/stating target throughput (RPS) and latency goals.' },
        { name: 'Architecture & Component Design', score: archScore, maxScore: 20, rationale: archScore >= 16 ? 'Covered core microservices/components and API flow.' : 'Define main web servers, API gateway, and background workers.' },
        { name: 'Data Model & Storage Strategy', score: dataModelScore, maxScore: 20, rationale: dataModelScore >= 16 ? 'Specified relational vs NoSQL storage choices.' : 'Detail entity relationships and database read/write access patterns.' },
        { name: 'Scalability, Caching & Queues', score: scaleScore, maxScore: 20, rationale: scaleScore >= 16 ? 'Included caching layer (Redis) or message queues (Kafka).' : 'Add caching or async queue processing for high-volume endpoints.' },
        { name: 'Trade-offs & Fault Tolerance', score: tradeScore, maxScore: 20, rationale: tradeScore >= 16 ? 'Discussed CAP theorem, latency trade-offs, or single points of failure.' : 'Explicitly mention trade-offs (e.g. eventual consistency vs strong consistency).' }
      );

      totalScore = reqScore + archScore + dataModelScore + scaleScore + tradeScore;

    } else {
      // TECHNICAL / CODING / RESUME / SKILLS RUBRIC
      const relevanceScore = lowerText.length > 50 ? 18 : 11;
      const accuracyScore = incorrectConcepts.length === 0 ? (uniqueCovered.length > 1 ? 19 : 14) : 9;
      const conceptsScore = Math.min(20, Math.max(10, uniqueCovered.length * 6 + 6));
      const clarityScore = answerText.includes('\n') || answerText.includes(':') || answerText.length > 120 ? 17 : 12;
      const complexityScore = lowerText.includes('complexity') || lowerText.includes('o(') || lowerText.includes('edge case') || lowerText.includes('time') ? 18 : 11;

      criterionScores.push(
        { name: 'Conceptual Relevance', score: relevanceScore, maxScore: 20, rationale: 'Answer directly addresses the core technical problem.' },
        { name: 'Technical Accuracy & Correctness', score: accuracyScore, maxScore: 20, rationale: accuracyScore >= 16 ? 'No major technical flaws detected.' : (incorrectConcepts.length > 0 ? 'Contains technical misconceptions (see corrections below).' : 'Expand technical accuracy with precise definitions.') },
        { name: 'Required CS Concepts', score: conceptsScore, maxScore: 20, rationale: `Covered ${uniqueCovered.length} expected concepts for this question.` },
        { name: 'Clarity & Structure', score: clarityScore, maxScore: 20, rationale: clarityScore >= 16 ? 'Well-structured with clear technical language.' : 'Use bullet points or sub-headings for technical readability.' },
        { name: 'Complexity & Edge Cases', score: complexityScore, maxScore: 20, rationale: complexityScore >= 16 ? 'Mentioned Big-O complexity or edge cases.' : 'Always specify Time Complexity O(...) and Space Complexity O(...).' }
      );

      totalScore = relevanceScore + accuracyScore + conceptsScore + clarityScore + complexityScore;
    }

    // Apply penalty for explicit technical mistakes
    if (incorrectConcepts.length > 0) {
      totalScore = Math.max(25, totalScore - incorrectConcepts.length * 15);
    }

    const finalOverallScore = Math.min(100, Math.max(20, totalScore));

    // Construct Actionable Suggested Improvement
    let suggestedImprovement = '';
    if (incorrectConcepts.length > 0) {
      suggestedImprovement = `First, correct technical mistakes: ${incorrectConcepts.map(c => c.correction).join(' ')} `;
    }

    if (uniqueMissing.length > 0) {
      suggestedImprovement += `To achieve a 90+ score, include these missing points: ${uniqueMissing.slice(0, 3).join(', ')}. `;
    } else {
      suggestedImprovement += 'Your answer covers the essential concepts well! To make it outstanding, add a real-world production example.';
    }

    // =========================================================================
    // 4. ATTEMPT VERSIONING & COMPARISON (ATTEMPT 1 VS ATTEMPT 2)
    // =========================================================================
    let whatImprovedBetweenAttempts: string[] | undefined;
    let scoreDifference: number | undefined;

    if (attemptNumber > 1 && previousEval) {
      scoreDifference = finalOverallScore - previousEval.overallScore;
      whatImprovedBetweenAttempts = [];

      if (scoreDifference > 0) {
        whatImprovedBetweenAttempts.push(`Overall evaluation score increased by +${scoreDifference} points (from ${previousEval.overallScore} to ${finalOverallScore}).`);
      } else if (scoreDifference === 0) {
        whatImprovedBetweenAttempts.push(`Score remained unchanged at ${finalOverallScore} points.`);
      } else {
        whatImprovedBetweenAttempts.push(`Score changed by ${scoreDifference} points (from ${previousEval.overallScore} to ${finalOverallScore}).`);
      }

      // Check new concepts covered
      const newlyCovered = uniqueCovered.filter(c => !previousEval.coveredConcepts.includes(c));
      if (newlyCovered.length > 0) {
        newlyCovered.forEach(c => whatImprovedBetweenAttempts?.push(`Added expected concept: ${c}`));
      }

      // Check fixed misconceptions
      if (previousEval.incorrectConcepts.length > 0 && incorrectConcepts.length < previousEval.incorrectConcepts.length) {
        whatImprovedBetweenAttempts.push('Resolved previous technical misconceptions.');
      }
    }

    return {
      id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      questionId: question.id,
      attemptNumber,
      overallScore: finalOverallScore,
      partiallyEvaluable: false,

      criterionScores,
      coveredConcepts: uniqueCovered,
      missingConcepts: uniqueMissing,
      incorrectConcepts,

      strengths,
      weaknesses,
      suggestedImprovement,

      whatImprovedBetweenAttempts,
      scoreDifference,

      createdAt: Date.now()
    };
  }

  private saveEvaluationRecord(userId: string, questionId: string, result: StructuredEvaluationResult): void {
    const db = this.getUserEvaluationsDB(userId);
    if (!db[questionId]) {
      db[questionId] = [];
    }

    // Keep history of attempts for versioning
    db[questionId].unshift(result);
    // Retain up to 10 previous attempts per question
    if (db[questionId].length > 10) {
      db[questionId] = db[questionId].slice(0, 10);
    }

    this.saveUserEvaluationsDB(userId, db);
  }
}

export const interviewEvaluationService = new InterviewEvaluationService();
