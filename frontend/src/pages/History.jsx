import React, { useState, useEffect } from 'react';
import api from '../api';
import CategoryChip from '../components/CategoryChip';
import { Search, Calendar, ChevronDown, ChevronUp, AlertCircle, Trash, RefreshCw } from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/get-history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to download history logs from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleExpand = (idx) => {
    setExpandedId(expandedId === idx ? null : idx);
  };

  const filteredHistory = history.filter((entry) =>
    entry.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (tsString) => {
    if (!tsString) return '';
    try {
      const date = new Date(tsString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return tsString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex-grow w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-terminal-border pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-condensed font-bold tracking-wider uppercase text-terminal-accent">
            CLASSIFICATION LOG FILE
          </h1>
          <p className="text-xs font-mono text-terminal-muted mt-1">
            Historical logs of all scanned objects and generated protocols.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-terminal-border hover:border-terminal-accent text-terminal-muted hover:text-terminal-accent text-xs font-mono rounded transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>RELOAD DIRECTORY</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-terminal-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter history records by item name in real-time..."
          className="w-full bg-terminal-card border border-terminal-border rounded-md pl-10 pr-4 py-2.5 text-sm text-terminal-text focus:outline-none focus:border-terminal-accent font-sans font-medium"
        />
      </div>

      {loading ? (
        <div className="border border-terminal-border bg-terminal-card/40 p-12 rounded-md text-center">
          <span className="text-sm font-mono text-terminal-accent animate-pulse uppercase">
            RETRIEVING ENCRYPTED HISTORY FILES...
          </span>
        </div>
      ) : error ? (
        <div className="border border-terminal-danger bg-terminal-dangerBg/40 p-4 rounded-md flex gap-3 text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-terminal-danger mb-1">
              RETRIEVAL ERROR
            </h4>
            <p className="text-xs font-sans leading-relaxed">{error}</p>
          </div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="border border-terminal-border border-dashed bg-terminal-card/20 p-12 rounded-md text-center">
          <p className="text-sm font-mono text-terminal-muted">
            {searchTerm ? 'NO RECORDS MATCH SEARCH FILTER.' : 'LOG REPOSITORY IS CURRENTLY EMPTY.'}
          </p>
          {!searchTerm && (
            <p className="text-xs font-mono text-terminal-muted/65 mt-2">
              Scan items in the Scanner tab to populate this list.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((entry, idx) => {
            const isExpanded = expandedId === idx;
            const resData = entry.result || {};
            
            return (
              <div
                key={idx}
                className="border border-terminal-border bg-terminal-card rounded overflow-hidden"
              >
                {/* Header view */}
                <div
                  onClick={() => toggleExpand(idx)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-terminal-border/10 transition-colors"
                >
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-mono font-bold uppercase text-terminal-text leading-tight truncate">
                        {entry.item}
                      </h3>
                      <CategoryChip category={entry.category} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-terminal-muted font-mono">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex gap-1.5">
                      {entry.is_recyclable && (
                        <span className="text-[9px] font-mono border border-emerald-800 text-emerald-400 bg-emerald-955/20 px-1.5 py-0.5 rounded">
                          REC
                        </span>
                      )}
                      {entry.is_hazardous && (
                        <span className="text-[9px] font-mono border border-red-800 text-red-400 bg-red-955/20 px-1.5 py-0.5 rounded">
                          HAZ
                        </span>
                      )}
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="h-4.5 w-4.5 text-terminal-accent" />
                      ) : (
                        <ChevronDown className="h-4.5 w-4.5 text-terminal-muted" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible content details */}
                {isExpanded && (
                  <div className="p-4 bg-terminal-bg/40 border-t border-terminal-border/50 text-xs font-mono space-y-4">
                    <div>
                      <span className="text-terminal-accent block mb-1">DISPOSAL INSTRUCTIONS:</span>
                      <p className="font-sans text-terminal-text/90 leading-relaxed">
                        {resData.disposal_instructions || 'N/A'}
                      </p>
                    </div>

                    {resData.recycling_steps && resData.recycling_steps.length > 0 && (
                      <div>
                        <span className="text-terminal-accent block mb-1">RECYCLING PROCESS:</span>
                        <ul className="space-y-1.5 list-decimal pl-4 font-sans text-terminal-text/80">
                          {resData.recycling_steps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {resData.eco_suggestions && resData.eco_suggestions.length > 0 && (
                      <div>
                        <span className="text-terminal-accent block mb-1">ECO ALTERNATIVES:</span>
                        <ul className="space-y-1 list-disc pl-4 font-sans text-terminal-muted">
                          {resData.eco_suggestions.map((s, sIdx) => (
                            <li key={sIdx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
