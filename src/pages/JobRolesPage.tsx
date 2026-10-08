import React, { useState, useMemo } from 'react';
import { 
  Code, 
  Layout, 
  Server, 
  Layers, 
  BarChart, 
  Brain, 
  Cpu, 
  Shield, 
  Cloud, 
  Wrench, 
  Smartphone, 
  Gamepad, 
  Database, 
  Palette, 
  CheckCircle, 
  Search, 
  ArrowRight, 
  ChevronLeft, 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  Award,
  Smile,
  Zap,
  Check,
  Globe,
  Wifi,
  Bot,
  Link as LinkIcon,
  MessageSquare,
  ShieldAlert,
  Activity,
  Compass,
  Heart,
  HelpCircle,
  Target,
  Eye
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { jobRolesData, jobRolesCategories } from '../data/jobRolesData';
import type { TabType } from '../components/layout/Sidebar';

interface JobRolesPageProps {
  onNavigateTab: (tab: TabType, extraId?: string) => void;
}

export const JobRolesPage: React.FC<JobRolesPageProps> = ({ onNavigateTab }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const renderRoleIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'Code': return <Code style={{ width: size, height: size }} />;
      case 'Layout': return <Layout style={{ width: size, height: size }} />;
      case 'Server': return <Server style={{ width: size, height: size }} />;
      case 'Layers': return <Layers style={{ width: size, height: size }} />;
      case 'BarChart': return <BarChart style={{ width: size, height: size }} />;
      case 'Brain': return <Brain style={{ width: size, height: size }} />;
      case 'Cpu': return <Cpu style={{ width: size, height: size }} />;
      case 'Shield': return <Shield style={{ width: size, height: size }} />;
      case 'Cloud': return <Cloud style={{ width: size, height: size }} />;
      case 'Wrench': return <Wrench style={{ width: size, height: size }} />;
      case 'Smartphone': return <Smartphone style={{ width: size, height: size }} />;
      case 'Gamepad': return <Gamepad style={{ width: size, height: size }} />;
      case 'Globe': return <Globe style={{ width: size, height: size }} />;
      case 'Database': return <Database style={{ width: size, height: size }} />;
      case 'MessageSquare': return <MessageSquare style={{ width: size, height: size }} />;
      case 'Eye': return <Eye style={{ width: size, height: size }} />;
      case 'Sparkles': return <Sparkles style={{ width: size, height: size }} />;
      case 'ShieldAlert': return <ShieldAlert style={{ width: size, height: size }} />;
      case 'Activity': return <Activity style={{ width: size, height: size }} />;
      case 'Compass': return <Compass style={{ width: size, height: size }} />;
      case 'Wifi': return <Wifi style={{ width: size, height: size }} />;
      case 'Bot': return <Bot style={{ width: size, height: size }} />;
      case 'Link': return <LinkIcon style={{ width: size, height: size }} />;
      case 'Palette': return <Palette style={{ width: size, height: size }} />;
      case 'Target': return <Target style={{ width: size, height: size }} />;
      case 'CheckCircle': return <CheckCircle style={{ width: size, height: size }} />;
      case 'HelpCircle': return <HelpCircle style={{ width: size, height: size }} />;
      case 'Heart': return <Heart style={{ width: size, height: size }} />;
      default: return <Briefcase style={{ width: size, height: size }} />;
    }
  };

  const filteredRoles = useMemo(() => {
    return jobRolesData.filter(role => {
      const matchesCat = selectedCategory === 'All' || role.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        role.title.toLowerCase().includes(q) || 
        role.shortTagline.toLowerCase().includes(q) || 
        role.whatIsThisJob.toLowerCase().includes(q) ||
        role.technologiesUsed.some(t => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeRole = useMemo(() => {
    if (!selectedRoleId) return null;
    return jobRolesData.find(r => r.id === selectedRoleId) || null;
  }, [selectedRoleId]);

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Software & Web': return 'blue';
      case 'Data & AI': return 'purple';
      case 'Cybersecurity': return 'hard';
      case 'Cloud & Infrastructure': return 'amber';
      case 'Hardware & Robotics': return 'medium';
      case 'Blockchain & Emerging': return 'pink';
      case 'Product, Design & Support': return 'easy';
      default: return 'neutral';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* GLOBAL HEADER & HERO BANNER */}
      <div 
        className="card"
        style={{
          padding: '16px 20px',
          background: 'var(--bg-surface)',
          borderColor: 'var(--color-purple-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Badge variant="purple">{jobRolesData.length} Technology Careers</Badge>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explained for Beginners & 5-Year-Olds</span>
            </div>
            <h1 className="page-title" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase style={{ width: 22, height: 22, color: 'var(--primary)' }} />
              <span>Technology Job Roles & Careers Guide</span>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '0.825rem', marginTop: '2px', color: 'var(--text-secondary)' }}>
              Explore over 50 technology careers explained using simple words, fun real-life stories, daily task lists, tech stacks, and step-by-step learning paths!
            </p>
          </div>

          {activeRole && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSelectedRoleId(null)}
              style={{ padding: '6px 12px', fontSize: '0.775rem' }}
            >
              <ChevronLeft style={{ width: 14, height: 14 }} />
              <span>View All {jobRolesData.length} Roles</span>
            </button>
          )}
        </div>
      </div>

      {/* SCREEN 1: JOB ROLE CHOOSER GRID (When no role selected) */}
      {!activeRole && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* SEARCH & CATEGORY FILTERS */}
          <div 
            className="card"
            style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              borderColor: 'var(--border-subtle)'
            }}
          >
            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {jobRolesCategories.map(cat => (
                <button
                  key={cat}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '3px 10px',
                    fontSize: '0.725rem',
                    borderColor: selectedCategory === cat ? 'var(--primary)' : undefined,
                    backgroundColor: selectedCategory === cat ? 'var(--primary)' : undefined
                  }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                placeholder={`Search ${filteredRoles.length} roles, tech, skills...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '4px 10px 4px 30px', fontSize: '0.775rem', width: '100%' }}
              />
            </div>
          </div>

          {/* RESULTS SUMMARY BAR */}
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Showing <strong>{filteredRoles.length}</strong> of <strong>{jobRolesData.length}</strong> Technology Job Roles</span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                style={{ background: 'none', border: 'none', color: 'var(--color-pink)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
              >
                Clear Search
              </button>
            )}
          </div>

          {/* JOB ROLES CARDS GRID */}
          <div className="grid-3" style={{ gap: '14px' }}>
            {filteredRoles.map(role => (
              <div
                key={role.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-medium)',
                  gap: '12px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedRoleId(role.id)}
              >
                <div>
                  {/* Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: 'rgba(59, 130, 246, 0.12)', 
                      border: '1px solid var(--color-purple-border)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'var(--primary)' 
                    }}>
                      {renderRoleIcon(role.iconName, 20)}
                    </div>
                    <Badge variant={getCategoryBadgeVariant(role.category) as any}>{role.category}</Badge>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                    {role.title}
                  </h3>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--color-cyan)', marginBottom: '8px' }}>
                    ✨ {role.shortTagline}
                  </div>

                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {role.whatIsThisJob}
                  </p>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {role.technologiesUsed.slice(0, 3).join(' • ')}
                  </span>
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ padding: '3px 8px', fontSize: '0.725rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoleId(role.id);
                    }}
                  >
                    <span>Explore Role</span>
                    <ArrowRight style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SCREEN 2: SELECTED JOB ROLE COMPLETE EXPLANATION */}
      {activeRole && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Top Role Header */}
          <div 
            className="card"
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--color-purple-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: 'var(--radius-md)', 
                  backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                  border: '1px solid var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--primary)' 
                }}>
                  {renderRoleIcon(activeRole.iconName, 26)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {activeRole.title}
                    </h2>
                    <Badge variant={getCategoryBadgeVariant(activeRole.category) as any}>{activeRole.category}</Badge>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-cyan)', marginTop: '2px' }}>
                    ✨ {activeRole.shortTagline}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedRoleId(null)}
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} />
                <span>Back to All Roles</span>
              </button>
            </div>
          </div>

          {/* 1. WHAT IS THIS JOB (SIMPLE 5-YEAR-OLD EXPLANATION) */}
          <div 
            className="card"
            style={{
              padding: '14px 16px',
              backgroundColor: 'rgba(59, 130, 246, 0.06)',
              borderColor: 'rgba(59, 130, 246, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-blue)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smile style={{ width: 15, height: 15 }} />
              <span>What is this job? (Explained Simply)</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: 0, fontWeight: 500 }}>
              {activeRole.whatIsThisJob}
            </p>
          </div>

          {/* 2. WHAT THEY DO EVERY DAY & SIMPLE REAL-WORLD EXAMPLE */}
          <div className="grid-2" style={{ gap: '14px' }}>
            {/* What They Do Every Day */}
            <div 
              className="card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'var(--bg-card)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-purple)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap style={{ width: 15, height: 15 }} />
                <span>What they do every day:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeRole.everydayActivities.map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Check style={{ width: 13, height: 13, color: 'var(--easy-color)', flexShrink: 0, marginTop: '3px' }} />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Real-World Example */}
            <div 
              className="card"
              style={{
                padding: '14px 16px',
                backgroundColor: 'rgba(236, 72, 153, 0.05)',
                borderColor: 'rgba(236, 72, 153, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-pink)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles style={{ width: 15, height: 15 }} />
                <span>Simple Everyday Example:</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: 0 }}>
                {activeRole.realWorldExample}
              </p>
            </div>
          </div>

          {/* 3. SKILLS NEEDED & TECHNOLOGIES USED */}
          <div className="grid-2" style={{ gap: '14px' }}>
            {/* Skills Needed */}
            <div 
              className="card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'var(--bg-card)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award style={{ width: 14, height: 14, color: 'var(--easy-color)' }} />
                <span>Skills Needed:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeRole.skillsNeeded.map((skill, sIdx) => (
                  <span 
                    key={sIdx}
                    style={{
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--easy-color)'
                    }}
                  >
                    • {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies Used */}
            <div 
              className="card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'var(--bg-card)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu style={{ width: 14, height: 14, color: 'var(--color-cyan)' }} />
                <span>Technologies They Use:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeRole.technologiesUsed.map((tech, tIdx) => (
                  <span 
                    key={tIdx}
                    style={{
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-cyan)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4. WHAT TO LEARN (BEGINNER ROADMAP) */}
          <div 
            className="card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen style={{ width: 15, height: 15 }} />
              <span>What You Need to Learn (Beginner Step-by-Step Path)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeRole.whatToLearn.map((step, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    fontWeight: 500
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* 5. CAREER GROWTH & RELATED ALGORISE TOPICS */}
          <div className="grid-2" style={{ gap: '14px' }}>
            {/* Career Growth */}
            <div 
              className="card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'var(--bg-card)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award style={{ width: 14, height: 14, color: 'var(--color-purple)' }} />
                <span>Career Growth Steps:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeRole.careerGrowth.map((level, lIdx) => (
                  <div key={lIdx} style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-purple)', fontWeight: 800 }}>Step {lIdx + 1}:</span>
                    <span>{level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related ALGOrise Topics to Learn */}
            <div 
              className="card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'var(--bg-card)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen style={{ width: 14, height: 14, color: 'var(--primary)' }} />
                <span>Related ALGOrise Topics to Practice:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeRole.relatedAlgoriseTopics.map((top, idx) => (
                  <button
                    key={idx}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--color-purple-border)' }}
                    onClick={() => onNavigateTab(top.tab as TabType, top.extraId)}
                  >
                    <BookOpen style={{ width: 12, height: 12, color: 'var(--primary)' }} />
                    <span>{top.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default JobRolesPage;
