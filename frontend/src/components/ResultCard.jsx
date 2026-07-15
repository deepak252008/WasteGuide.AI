import React from 'react';
import CategoryChip from './CategoryChip';
import { ShieldAlert, Leaf, MapPin, Recycle, ExternalLink } from 'lucide-react';

const ResultCard = ({ result, source, onFindCenters }) => {
  if (!result) return null;

  const {
    item,
    category,
    is_recyclable,
    is_hazardous,
    is_reusable,
    disposal_instructions,
    recycling_steps = [],
    hazard_warning,
    eco_suggestions = [],
    accepted_at = []
  } = result;

  return (
    <div className="border border-terminal-border bg-terminal-card p-6 rounded-md shadow-2xl relative overflow-hidden">
      {/* Terminal Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scan-line opacity-5"></div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-terminal-border pb-4 mb-6">
        <div>
          <span className="text-xs font-mono text-terminal-muted block tracking-wider uppercase">SCANNED ITEM</span>
          <h2 className="text-2xl font-condensed font-bold tracking-wide text-terminal-text uppercase">
            {item}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip category={category} />
          {source && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
              source === 'groq'
                ? 'border-terminal-accent/40 bg-terminal-accentDim/10 text-terminal-accent'
                : 'border-terminal-muted/40 bg-terminal-muted/10 text-terminal-muted'
            }`}>
              SOURCE: {source}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Instructions and Warnings */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-mono text-terminal-accent tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Recycle className="h-4.5 w-4.5" /> DISPOSAL PROTOCOL
            </h3>
            <p className="text-sm text-terminal-text/90 font-sans leading-relaxed">
              {disposal_instructions}
            </p>
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {is_recyclable && (
              <span className="text-[11px] font-mono font-semibold tracking-wider bg-emerald-950/20 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded">
                RECYCLABLE
              </span>
            )}
            {is_reusable && (
              <span className="text-[11px] font-mono font-semibold tracking-wider bg-sky-950/20 border border-sky-800 text-sky-400 px-2 py-0.5 rounded">
                REUSABLE
              </span>
            )}
            {is_hazardous && (
              <span className="text-[11px] font-mono font-semibold tracking-wider bg-red-950/20 border border-red-850 text-red-400 px-2 py-0.5 rounded">
                HAZARDOUS
              </span>
            )}
          </div>

          {/* Hazard Warning Block */}
          {hazard_warning && (
            <div className="border border-red-950 bg-terminal-dangerBg/40 p-4 rounded-md flex gap-3 text-red-300">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-terminal-danger" />
              <div>
                <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-terminal-danger mb-1">
                  HAZARD WARNING
                </h4>
                <p className="text-xs font-sans leading-relaxed">
                  {hazard_warning}
                </p>
              </div>
            </div>
          )}

          {/* Accepted Facilities */}
          {accepted_at && accepted_at.length > 0 && (
            <div className="border border-terminal-border bg-terminal-bg/30 p-4 rounded-md">
              <h4 className="text-xs font-mono text-terminal-muted tracking-wider uppercase mb-2">
                ACCEPTED FACILITY TYPES
              </h4>
              <div className="flex flex-wrap gap-2">
                {accepted_at.map((facility, i) => (
                  <span key={i} className="text-xs font-mono bg-terminal-bg border border-terminal-border/60 text-terminal-text/80 px-2.5 py-1 rounded">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Steps & Alternatives */}
        <div className="space-y-6">
          {/* Recycling Steps */}
          {recycling_steps && recycling_steps.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-terminal-accent tracking-wider uppercase mb-3 border-b border-terminal-border pb-1">
                DISPOSAL PROCESS STEPS
              </h3>
              <ol className="space-y-3 font-sans">
                {recycling_steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="flex items-center justify-center h-5 w-5 shrink-0 rounded-full border border-terminal-accent text-terminal-accent text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-terminal-text/90 leading-normal">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Eco Alternatives / Suggestions */}
          {eco_suggestions && eco_suggestions.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-terminal-accent tracking-wider uppercase mb-3 border-b border-terminal-border pb-1 flex items-center gap-1.5">
                <Leaf className="h-4 w-4" /> ECO-FRIENDLY ALTERNATIVES
              </h3>
              <ul className="space-y-2.5 font-sans">
                {eco_suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-terminal-muted items-start">
                    <span className="text-terminal-accent mt-0.5">•</span>
                    <span className="leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Button to navigate to Map */}
      <div className="mt-8 pt-4 border-t border-terminal-border flex justify-end">
        <button
          onClick={() => onFindCenters(category)}
          className="flex items-center gap-2 px-4 py-2 border border-terminal-accent bg-terminal-accent/10 hover:bg-terminal-accent/25 text-terminal-accent rounded text-xs font-mono transition-colors focus:outline-none focus:ring-1 focus:ring-terminal-accent focus:ring-offset-1 focus:ring-offset-terminal-bg"
        >
          <MapPin className="h-4 w-4" />
          <span>FIND HYDERABAD COLLECTION CENTERS</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
