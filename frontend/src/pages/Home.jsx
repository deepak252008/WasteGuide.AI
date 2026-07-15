import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ResultCard from '../components/ResultCard';
import { Search, Loader2, HelpCircle, ShieldAlert } from 'lucide-react';

const QUICK_CHIPS = [
  "Plastic Bottle", "Battery", "Newspaper", "Banana Peel", 
  "Old Charger", "Glass Jar", "Medicine Bottle", "Aluminium Can", 
  "Cardboard Box", "Mobile Phone", "Paint Can", "Food Wrapper"
];

const LOADING_STATUSES = [
  "Scanning waste database",
  "Consulting Llama 3.3 70B",
  "Analyzing disposal options",
  "Generating recycling guide",
  "Formatting structured JSON response"
];

const Home = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanSource, setScanSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [error, setError] = useState('');
  const statusTimer = useRef(null);

  useEffect(() => {
    const savedScan = sessionStorage.getItem('last_scan_result');
    const savedItem = sessionStorage.getItem('last_scan_item');
    const savedSource = sessionStorage.getItem('last_scan_source');
    if (savedScan) {
      try {
        setScanResult(JSON.parse(savedScan));
        if (savedItem) setItem(savedItem);
        if (savedSource) setScanSource(savedSource);
      } catch (e) {
        console.error("Failed to load saved scan", e);
      }
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setStatusIdx(0);
      statusTimer.current = setInterval(() => {
        setStatusIdx((prev) => (prev + 1) % LOADING_STATUSES.length);
      }, 1200);
    } else {
      if (statusTimer.current) {
        clearInterval(statusTimer.current);
      }
    }
    return () => {
      if (statusTimer.current) clearInterval(statusTimer.current);
    };
  }, [loading]);

  const triggerScan = async (itemName) => {
    const trimmed = itemName.trim();
    if (!trimmed) {
      setError("Please enter a waste item name.");
      return;
    }

    setLoading(true);
    setError('');
    setScanResult(null);
    setScanSource('');

    try {
      const res = await api.post('/api/analyze-waste', { item: trimmed });
      const data = res.data;
      
      if (data && data.result) {
        setScanResult(data.result);
        setScanSource(data.source);

        sessionStorage.setItem('last_scan_result', JSON.stringify(data.result));
        sessionStorage.setItem('last_scan_item', trimmed);
        sessionStorage.setItem('last_scan_source', data.source);

        // Auto-save history in background
        try {
          await api.post('/api/save-history', { result: data.result });
        } catch (saveErr) {
          console.error("Auto-save to history failed:", saveErr);
        }
      } else {
        throw new Error("Invalid response format received from backend.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        "Failed to analyze waste item. Please check that the Flask backend server is running on http://localhost:5000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    triggerScan(item);
  };

  const handleQuickChipClick = (chipName) => {
    setItem(chipName);
    triggerScan(chipName);
  };

  const handleFindCenters = (category) => {
    sessionStorage.setItem('map_filter_category', category);
    navigate('/map');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
      {/* Search Input Box */}
      <div className="mb-8">
        <h1 className="text-3xl font-condensed font-bold tracking-wider text-center uppercase mb-2 text-terminal-accent">
          WASTE CLASSIFICATION SCANNER
        </h1>
        <p className="text-center text-xs font-mono text-terminal-muted mb-6">
          Input an item name below to generate custom eco-disposal instructions.
        </p>

        <form onSubmit={handleFormSubmit} className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-terminal-muted" />
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Type waste item (e.g., Plastic Bottle, Led Bulb, Old Newspaper)..."
              className="w-full bg-terminal-card border border-terminal-border rounded-md pl-11 pr-4 py-3 text-sm text-terminal-text focus:outline-none focus:border-terminal-accent font-sans font-medium"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 border border-terminal-accent bg-terminal-accent/10 hover:bg-terminal-accent/25 text-terminal-accent font-mono text-sm tracking-wider font-semibold rounded-md transition-colors disabled:border-terminal-border disabled:bg-transparent disabled:text-terminal-muted shrink-0"
          >
            {loading ? 'SCANNING...' : 'SCAN'}
          </button>
        </form>
      </div>

      {/* Quick Select Chips */}
      <div className="mb-10 max-w-2xl mx-auto">
        <span className="text-[10px] font-mono text-terminal-muted uppercase tracking-wider block mb-2 text-center">
          QUICK CHIP SCANNING SELECTORS
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleQuickChipClick(chip)}
              disabled={loading}
              className={`px-3 py-1.5 border border-terminal-border bg-terminal-bg rounded hover:border-terminal-accent hover:text-terminal-accent text-xs font-mono transition-colors focus:outline-none ${
                item.toLowerCase() === chip.toLowerCase()
                  ? 'border-terminal-accent text-terminal-accent bg-terminal-accent/5'
                  : 'text-terminal-muted'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message display */}
      {error && (
        <div className="max-w-2xl mx-auto w-full border border-terminal-danger bg-terminal-dangerBg/40 p-4 rounded-md flex gap-3 text-red-300 mb-8">
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-terminal-danger" />
          <div>
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-terminal-danger mb-1">
              SYSTEM API CONNECTION ERROR
            </h4>
            <p className="text-xs font-sans leading-relaxed">{error}</p>
            <p className="text-[10px] font-mono text-terminal-muted mt-2">
              TROUBLESHOOTING TIP: Ensure the Python server is running (`python app.py`) and listening on localhost:5000.
            </p>
          </div>
        </div>
      )}

      {/* Loading state rendering */}
      {loading && (
        <div className="max-w-2xl mx-auto w-full border border-terminal-border bg-terminal-card/50 p-12 rounded-md flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-10 w-10 text-terminal-accent animate-spin mb-4" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-mono text-terminal-accent tracking-wide uppercase">
              {LOADING_STATUSES[statusIdx]}
            </span>
            <span className="text-terminal-accent font-bold animate-pulse">...</span>
          </div>
        </div>
      )}

      {/* Result presentation card */}
      {!loading && scanResult && (
        <div className="max-w-3xl mx-auto w-full mb-12">
          <ResultCard
            result={scanResult}
            source={scanSource}
            onFindCenters={handleFindCenters}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
