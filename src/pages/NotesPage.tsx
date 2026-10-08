import React, { useState } from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { NotesHomeView } from '../components/notes/NotesHomeView';
import { UnifiedNotesExplorer } from '../components/notes/UnifiedNotesExplorer';
import { LANGUAGES_META, type LanguageId } from '../services/unifiedNotesService';

export const NotesPage: React.FC = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useState<LanguageId | null>(null);
  const [initialTopicId, setInitialTopicId] = useState<string | undefined>(undefined);

  const handleSelectLanguage = (langId: LanguageId, topicId?: string) => {
    setSelectedLanguageId(langId);
    setInitialTopicId(topicId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedLanguageId(null);
    setInitialTopicId(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Top Header & Language Selector Bar */}
      <div 
        className="card" 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          backgroundColor: 'var(--bg-surface-elevated)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen style={{ width: 22, height: 22, color: 'var(--accent-primary)' }} />
              <span>Notes</span>
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Learn programming languages and DSA through structured, step-by-step topic guides.
            </p>
          </div>

          {selectedLanguageId !== null && (
            <button
              onClick={handleBackToHome}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>All Languages</span>
            </button>
          )}
        </div>

        {/* Clean Language Navigation Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleBackToHome}
            className={`btn btn-sm ${selectedLanguageId === null ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            All Notes
          </button>

          {LANGUAGES_META.map((lang) => {
            const isActive = selectedLanguageId === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleSelectLanguage(lang.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{ 
                  fontSize: '0.78rem', 
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ color: lang.iconColor, fontSize: '0.9rem', lineHeight: 1 }}>•</span>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Switcher */}
      {selectedLanguageId === null ? (
        <NotesHomeView onSelectLanguage={handleSelectLanguage} />
      ) : (
        <UnifiedNotesExplorer
          languageId={selectedLanguageId}
          initialTopicId={initialTopicId}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
};
