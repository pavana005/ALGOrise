export interface VerifiedResource {
  id: string;
  title: string;
  source: string;
  url: string;
  category: 'DSA & Algorithms' | 'Programming Languages' | 'Web & Frontend' | 'Systems & OS' | 'Databases' | 'Cloud & DevOps' | 'Cybersecurity' | 'AI & Machine Learning';
  description: string;
  badge: string;
  isOfficial: boolean;
}

export const verifiedResourcesData: VerifiedResource[] = [
  // DSA & ALGORITHMS
  {
    id: 'res-mit-ocw-6006',
    title: 'MIT 6.006: Introduction to Algorithms',
    source: 'Massachusetts Institute of Technology (MIT OCW)',
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
    category: 'DSA & Algorithms',
    description: 'Official university course covering algorithmic thinking, sorting, data structures, dynamic programming, and graph algorithms.',
    badge: 'University Course',
    isOfficial: true
  },
  {
    id: 'res-stanford-cs106b',
    title: 'Stanford CS106B: Programming Abstractions',
    source: 'Stanford University',
    url: 'https://web.stanford.edu/class/cs106b/',
    category: 'DSA & Algorithms',
    description: 'Official Stanford course on fundamental data structures, recursive problem solving, algorithm analysis, and abstraction.',
    badge: 'University Course',
    isOfficial: true
  },
  {
    id: 'res-gfg-dsa',
    title: 'GeeksforGeeks Data Structures & Algorithms Guide',
    source: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/data-structures/',
    category: 'DSA & Algorithms',
    description: 'Comprehensive technical tutorials and code implementations for linear and non-linear data structures.',
    badge: 'Tutorial Guide',
    isOfficial: false
  },
  {
    id: 'res-leetcode-explore',
    title: 'LeetCode Problem Explorer & Learning Cards',
    source: 'LeetCode',
    url: 'https://leetcode.com/problemset/all/',
    category: 'DSA & Algorithms',
    description: 'Platform featuring thousands of algorithmic coding challenges categorized by data structure topic.',
    badge: 'Practice Platform',
    isOfficial: true
  },

  // PROGRAMMING LANGUAGES
  {
    id: 'res-python-docs',
    title: 'Python 3 Official Documentation & Standard Library',
    source: 'Python Software Foundation',
    url: 'https://docs.python.org/3/',
    category: 'Programming Languages',
    description: 'Official language reference, library documentation, and beginner tutorials for Python 3.',
    badge: 'Official Docs',
    isOfficial: true
  },
  {
    id: 'res-java-oracle-docs',
    title: 'Oracle Java Platform Standard Edition Documentation',
    source: 'Oracle Corporation',
    url: 'https://docs.oracle.com/en/java/',
    category: 'Programming Languages',
    description: 'Official API documentation, language specification, and developer guides for the Java platform.',
    badge: 'Official Docs',
    isOfficial: true
  },
  {
    id: 'res-cpp-reference',
    title: 'C++ Reference (cppreference.com)',
    source: 'cppreference.com',
    url: 'https://en.cppreference.com/w/',
    category: 'Programming Languages',
    description: 'Complete C and C++ language specification, standard template library (STL) reference, and code examples.',
    badge: 'Language Reference',
    isOfficial: true
  },
  {
    id: 'res-go-docs',
    title: 'The Go Programming Language Documentation',
    source: 'Google / Go Project',
    url: 'https://go.dev/doc/',
    category: 'Programming Languages',
    description: 'Official Go installation guides, interactive tour, standard library packages, and memory model.',
    badge: 'Official Docs',
    isOfficial: true
  },
  {
    id: 'res-rust-book',
    title: 'The Rust Programming Language Book',
    source: 'Rust Foundation',
    url: 'https://doc.rust-lang.org/book/',
    category: 'Programming Languages',
    description: 'Official comprehensive textbook on Rust memory safety, ownership, borrowing, and concurrency.',
    badge: 'Official Book',
    isOfficial: true
  },

  // WEB & FRONTEND
  {
    id: 'res-mdn-web-docs',
    title: 'MDN Web Docs (JavaScript, HTML, CSS)',
    source: 'Mozilla Developer Network',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    category: 'Web & Frontend',
    description: 'The authoritative reference documentation for open web standards, JavaScript APIs, HTML5, and CSS3.',
    badge: 'Official Web Standard',
    isOfficial: true
  },
  {
    id: 'res-w3c-standards',
    title: 'W3C Technical Reports & Web Standards',
    source: 'World Wide Web Consortium (W3C)',
    url: 'https://www.w3.org/TR/',
    category: 'Web & Frontend',
    description: 'Official international web standards, accessibility guidelines (WCAG), and protocol specifications.',
    badge: 'Standards Body',
    isOfficial: true
  },

  // SYSTEMS & OS
  {
    id: 'res-linux-kernel-docs',
    title: 'Linux Kernel Official Documentation',
    source: 'Linux Kernel Organization',
    url: 'https://www.kernel.org/doc/html/latest/',
    category: 'Systems & OS',
    description: 'Official kernel documentation covering memory management, process scheduling, system calls, and device drivers.',
    badge: 'Official Kernel Docs',
    isOfficial: true
  },
  {
    id: 'res-git-scm-docs',
    title: 'Git SCM Official Documentation & Pro Git Book',
    source: 'Git SCM Project',
    url: 'https://git-scm.com/doc',
    category: 'Systems & OS',
    description: 'Official reference manuals and the complete Pro Git book covering distributed version control.',
    badge: 'Official Book & Docs',
    isOfficial: true
  },

  // DATABASES
  {
    id: 'res-postgresql-docs',
    title: 'PostgreSQL Official Documentation',
    source: 'PostgreSQL Global Development Group',
    url: 'https://www.postgresql.org/docs/',
    category: 'Databases',
    description: 'Authoritative documentation for PostgreSQL relational database management system, SQL dialect, and indexing.',
    badge: 'Official Database Docs',
    isOfficial: true
  },

  // CLOUD & DEVOPS
  {
    id: 'res-aws-docs',
    title: 'Amazon Web Services (AWS) Official Documentation',
    source: 'Amazon Web Services',
    url: 'https://docs.aws.amazon.com/',
    category: 'Cloud & DevOps',
    description: 'Official developer guides, API references, and architecture whitepapers for AWS cloud services.',
    badge: 'Official Cloud Docs',
    isOfficial: true
  },
  {
    id: 'res-docker-docs',
    title: 'Docker Documentation',
    source: 'Docker Inc.',
    url: 'https://docs.docker.com/',
    category: 'Cloud & DevOps',
    description: 'Official guides for containerization, Dockerfiles, Docker Compose, and image management.',
    badge: 'Official Container Docs',
    isOfficial: true
  },
  {
    id: 'res-kubernetes-docs',
    title: 'Kubernetes Official Documentation',
    source: 'Cloud Native Computing Foundation (CNCF)',
    url: 'https://kubernetes.io/docs/',
    category: 'Cloud & DevOps',
    description: 'Authoritative documentation for Kubernetes container orchestration, pod management, and cluster deployment.',
    badge: 'Official CNCF Docs',
    isOfficial: true
  },

  // CYBERSECURITY
  {
    id: 'res-owasp-top-ten',
    title: 'OWASP Top 10 Web Application Security Risks',
    source: 'OWASP Foundation',
    url: 'https://owasp.org/www-project-top-ten/',
    category: 'Cybersecurity',
    description: 'Standard security awareness document detailing top web application security vulnerabilities and remediation.',
    badge: 'Security Standard',
    isOfficial: true
  },

  // AI & MACHINE LEARNING
  {
    id: 'res-pytorch-docs',
    title: 'PyTorch Official Documentation & Tutorials',
    source: 'PyTorch / Linux Foundation',
    url: 'https://pytorch.org/docs/stable/index.html',
    category: 'AI & Machine Learning',
    description: 'Official API reference and tutorials for PyTorch deep learning framework, tensors, and neural networks.',
    badge: 'Official Framework Docs',
    isOfficial: true
  },
  {
    id: 'res-tensorflow-docs',
    title: 'TensorFlow Official Learning Guides',
    source: 'Google Brain / TensorFlow',
    url: 'https://www.tensorflow.org/learn',
    category: 'AI & Machine Learning',
    description: 'Official tutorials and guides for building machine learning models using Keras and TensorFlow.',
    badge: 'Official Framework Docs',
    isOfficial: true
  }
];
