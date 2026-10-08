import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import {
  unifiedNotesService,
  LANGUAGES_META,
  type LanguageId
} from '../../services/unifiedNotesService';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

interface NotesHomeViewProps {
  onSelectLanguage: (langId: LanguageId, topicId?: string) => void;
}

export const NotesHomeView: React.FC<NotesHomeViewProps> = ({ onSelectLanguage }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Calculate statistics for each language card
  const languageCardsData = useMemo(() => {
    return LANGUAGES_META.map((lang) => {
      const stats = unifiedNotesService.getProgressStats(userId, lang.id);
      const lastTopicId = unifiedNotesService.getLastOpenedTopic(userId, lang.id);
      const lastTopic = lastTopicId ? unifiedNotesService.getTopicById(lang.id, lastTopicId) : null;

      return {
        ...lang,
        stats,
        lastTopic
      };
    });
  }, [userId]);

  // Handle global search across all topics in all languages
  const searchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    return unifiedNotesService.globalSearch(globalSearchQuery, userId);
  }, [globalSearchQuery, userId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Global Search Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-root)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '260px' }}>
          <Search style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Global topic search across all languages (e.g. hash maps, recursion, pointers, async)..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.85rem' }}
          />
        </div>
        
        {globalSearchQuery && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setGlobalSearchQuery('')}
            style={{ fontSize: '0.78rem' }}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Global Search Results Overlay (If User is Searching) */}
      {globalSearchQuery.trim() !== '' && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'var(--border-focus)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ width: 16, height: 16, color: 'var(--accent-primary)' }} />
              <span>Search Results for "{globalSearchQuery}" ({searchResults.length})</span>
            </h3>
          </div>

          {searchResults.length === 0 ? (
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0, padding: '16px 0' }}>
              No matching topics found across Java, Python, C, C++, JavaScript, C#, Go, or DSA notes.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {searchResults.map(({ note, status }) => (
                <div
                  key={`${note.languageId}-${note.id}`}
                  className="card card-interactive"
                  onClick={() => {
                    setGlobalSearchQuery('');
                    onSelectLanguage(note.languageId, note.id);
                  }}
                  style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {note.languageName} → {note.category}
                    </span>
                    <Badge variant={note.level === 'Beginner' ? 'easy' : note.level === 'Intermediate' ? 'medium' : 'hard'}>
                      {note.level}
                    </Badge>
                  </div>
                  
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {note.title}
                  </h4>
                  
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                    {note.whatItIs.replace(/\*\*/g, '')}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      {status === 'completed' ? (
                        <CheckCircle2 style={{ width: 13, height: 13, color: '#10b981' }} />
                      ) : status === 'in_progress' ? (
                        <Clock style={{ width: 13, height: 13, color: '#f59e0b' }} />
                      ) : (
                        <Layers style={{ width: 13, height: 13, color: 'var(--text-muted)' }} />
                      )}
                      <span style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
                    </span>

                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Note <ArrowRight style={{ width: 12, height: 12 }} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid of 8 Language/Roadmap Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {languageCardsData.map((lang) => {
          const hasStarted = lang.stats.completedCount > 0 || lang.stats.inProgressCount > 0;

          return (
            <div
              key={lang.id}
              className="card card-interactive"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge variant={lang.badgeVariant}>{lang.badge}</Badge>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', backgroundColor: 'var(--bg-root)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    {lang.stats.totalCount} Topics
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: lang.iconColor, fontSize: '1.2rem', lineHeight: 1 }}>•</span>
                    <span>{lang.name}</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {lang.description}
                  </p>
                </div>
              </div>

              {/* Progress & Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {lang.stats.completedCount} / {lang.stats.totalCount} ({lang.stats.percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-root)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <div
                      style={{
                        width: `${lang.stats.percentage}%`,
                        height: '100%',
                        backgroundColor: 'var(--accent-primary)',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onSelectLanguage(lang.id, lang.lastTopic?.id)}
                  className={`btn btn-sm ${hasStarted ? 'btn-outline' : 'btn-primary'}`}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  {hasStarted ? (
                    <>
                      <span>Continue {lang.lastTopic ? `(${lang.lastTopic.title})` : ''}</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </>
                  ) : (
                    <>
                      <span>Start Learning</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
