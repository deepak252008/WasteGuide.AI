import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scan, MapPin, History, BarChart3, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, isDemoMode, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const links = [
    { to: '/', label: 'SCANNER', icon: Scan },
    { to: '/map', label: 'MAP', icon: MapPin },
    { to: '/history', label: 'HISTORY', icon: History },
    { to: '/dashboard', label: 'DASHBOARD', icon: BarChart3 }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-terminal-card border-b border-terminal-border/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-terminal-accent font-mono font-bold text-xl select-none">
              &gt; WASTEGUIDE <span className="text-terminal-muted font-normal">// AI</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded font-mono text-sm tracking-wider transition-colors focus:outline-none ${
                      isActive
                        ? 'text-terminal-accent border-b border-terminal-accent'
                        : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-border/20'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* User Status and Action */}
          <div className="hidden md:flex items-center gap-4">
            {isDemoMode && (
              <span className="flex items-center gap-1 bg-amber-950/20 border border-amber-800 text-amber-400 text-xs px-2.5 py-1 rounded font-mono tracking-tight animate-pulse">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>DEMO MODE</span>
              </span>
            )}
            {user && (
              <div className="flex items-center gap-3 border-l border-terminal-border pl-4">
                <span className="text-xs font-mono text-terminal-muted">
                  USR: {user.displayName}
                </span>
                <button
                  onClick={logout}
                  className="text-terminal-muted hover:text-terminal-danger transition-colors p-1"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <div className="flex md:hidden items-center gap-2">
            {isDemoMode && (
              <span className="flex items-center gap-1 bg-amber-950/20 border border-amber-800 text-amber-450 text-[10px] px-1.5 py-0.5 rounded font-mono">
                DEMO
              </span>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-terminal-muted hover:text-terminal-text p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-terminal-border bg-terminal-card/95 backdrop-blur-md px-2 pt-2 pb-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded font-mono text-sm tracking-wider ${
                    isActive
                      ? 'bg-terminal-border/30 text-terminal-accent'
                      : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-border/10'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {user && (
            <div className="border-t border-terminal-border mt-3 pt-3 flex items-center justify-between px-3">
              <span className="text-xs font-mono text-terminal-muted">
                USR: {user.displayName}
              </span>
              <button
                onClick={() => {
                  closeMobileMenu();
                  logout();
                }}
                className="flex items-center gap-1.5 text-xs font-mono text-terminal-danger px-2.5 py-1.5 border border-terminal-danger/30 rounded"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>LOGOUT</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
