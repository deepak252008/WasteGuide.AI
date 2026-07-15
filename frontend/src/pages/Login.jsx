import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldAlert, Key, Terminal } from 'lucide-react';

const Login = () => {
  const { loginWithEmail, registerWithEmail, launchDemoMode, firebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text flex items-center justify-center p-4">
      {/* Background terminal matrix scan lines */}
      <div className="absolute inset-0 pointer-events-none scan-line opacity-5"></div>

      <div className="w-full max-w-md border border-terminal-border bg-terminal-card p-8 rounded shadow-2xl relative">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-terminal-border flex justify-between px-4">
          <span className="h-1 w-4 bg-terminal-accent"></span>
          <span className="h-1 w-4 bg-terminal-accent"></span>
        </div>

        <div className="text-center mb-8">
          <Terminal className="h-10 w-10 text-terminal-accent mx-auto mb-2" />
          <h1 className="text-2xl font-mono font-bold tracking-wider text-terminal-text">
            &gt; WASTEGUIDE_AI
          </h1>
          <p className="text-xs font-mono text-terminal-muted mt-1">
            SECURE ACCESS PORTAL v1.0.4
          </p>
        </div>

        {error && (
          <div className="border border-red-900 bg-terminal-dangerBg/50 text-red-400 p-3 rounded text-xs font-mono mb-6 flex gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
          <div>
            <label className="block text-xs text-terminal-muted mb-1 uppercase tracking-wider">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-text focus:outline-none focus:border-terminal-accent font-sans"
              placeholder="resident@hyd.gov.in"
              disabled={loading || !firebaseConfigured}
            />
          </div>

          <div>
            <label className="block text-xs text-terminal-muted mb-1 uppercase tracking-wider">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-text focus:outline-none focus:border-terminal-accent font-sans"
              placeholder="••••••••"
              disabled={loading || !firebaseConfigured}
            />
          </div>

          {firebaseConfigured ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-terminal-accent text-terminal-bg font-bold rounded hover:bg-terminal-accentLight transition-colors mt-2"
            >
              {loading ? 'PROCESSING...' : isRegister ? 'CREATE ACCOUNT' : 'ESTABLISH CONNECTION'}
            </button>
          ) : (
            <div className="border border-terminal-border bg-terminal-bg/50 p-4 rounded text-xs text-terminal-muted leading-relaxed space-y-2">
              <span className="text-amber-500 font-bold uppercase block flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                Firebase Auth Offline
              </span>
              <span>
                No Firebase configuration found in environment variables. Access via database accounts is disabled.
              </span>
            </div>
          )}
        </form>

        {firebaseConfigured && (
          <div className="text-center mt-4">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-mono text-terminal-accent hover:underline focus:outline-none"
            >
              {isRegister ? 'Already registered? Login' : 'Create new credential? Register'}
            </button>
          </div>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-terminal-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-terminal-card px-3 text-terminal-muted font-mono">OR</span>
          </div>
        </div>

        <button
          onClick={launchDemoMode}
          className="w-full py-3 border border-amber-800 bg-amber-950/20 hover:bg-amber-950/45 text-amber-400 font-mono font-bold text-xs tracking-wider rounded transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck className="h-4.5 w-4.5" />
          <span>LAUNCH DEMO MODE (BYPASS AUTH)</span>
        </button>

        <p className="text-[10px] text-center font-mono text-terminal-muted mt-6">
          DEMO MODE SAVES SCAN DATA AND HISTORIES LOCALLY IN BACKEND MEMORY FOR THE RUNNING SESSION ONLY.
        </p>
      </div>
    </div>
  );
};

export default Login;
