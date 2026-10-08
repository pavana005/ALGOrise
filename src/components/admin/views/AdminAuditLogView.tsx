import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, RefreshCw, Search } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { adminContentService } from '../../../services/adminContentService';
import { adminCmsService } from '../../../services/adminCmsService';

export const AdminAuditLogView: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<any[]>(() => adminCmsService.getAuditLogs());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const serverLogs = await adminContentService.getAuditLogsAsync(token);
      if (Array.isArray(serverLogs) && serverLogs.length > 0) {
        setLogs(serverLogs);
      } else {
        setLogs(adminCmsService.getAuditLogs());
      }
    } catch {
      setLogs(adminCmsService.getAuditLogs());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return '#10b981';
      case 'UPDATE': return 'var(--accent-primary)';
      case 'DELETE': return '#f87171';
      case 'RESET': return '#f59e0b';
      case 'ENABLE': return '#10b981';
      case 'DISABLE': return '#f59e0b';
      default: return 'var(--text-primary)';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (log.adminUsername && log.adminUsername.toLowerCase().includes(q)) ||
      (log.targetSection && log.targetSection.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q));

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck style={{ width: 22, height: 22, color: 'var(--accent-primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Administrative Action Audit Log
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Immutable server-side audit trail recording who made changes, what was changed, and timestamp.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {logs.length} Recorded Events
          </span>
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="btn btn-outline btn-sm"
            title="Refresh Audit Logs"
          >
            <RefreshCw
              style={{
                width: 13,
                height: 13,
                animation: isLoading ? 'spin 1s linear infinite' : 'none'
              }}
            />
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 14,
              height: 14,
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search by admin, section, or action details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ width: '100%', paddingLeft: '32px', fontSize: '0.82rem' }}
          />
        </div>

        <select
          className="select-field"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{ fontSize: '0.82rem', padding: '6px 12px' }}
        >
          <option value="all">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="RESET">RESET</option>
          <option value="ENABLE">ENABLE</option>
          <option value="DISABLE">DISABLE</option>
        </select>
      </div>

      {/* Logs List */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredLogs.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No administrative audit actions matching your filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontSize: '0.84rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-root)',
                      color: getActionColor(log.action),
                      border: `1px solid ${getActionColor(log.action)}`
                    }}
                  >
                    {log.action}
                  </span>

                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      @{log.adminUsername || 'admin'}
                    </strong>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>
                      mutated <strong>{log.targetSection}</strong>: {log.details}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Clock style={{ width: 12, height: 12 }} />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
