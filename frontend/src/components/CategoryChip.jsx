import React from 'react';

const CATEGORY_STYLES = {
  'Organic Waste': {
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-700/60',
    text: 'text-emerald-400',
    icon: '🍌'
  },
  'Plastic Waste': {
    bg: 'bg-sky-950/40',
    border: 'border-sky-700/60',
    text: 'text-sky-400',
    icon: '🥤'
  },
  'Paper Waste': {
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-700/60',
    text: 'text-yellow-400',
    icon: '📦'
  },
  'Glass Waste': {
    bg: 'bg-teal-950/40',
    border: 'border-teal-700/60',
    text: 'text-teal-400',
    icon: '🫙'
  },
  'Metal Waste': {
    bg: 'bg-zinc-800/40',
    border: 'border-zinc-600/60',
    text: 'text-zinc-300',
    icon: '🥫'
  },
  'E-waste': {
    bg: 'bg-purple-950/40',
    border: 'border-purple-700/60',
    text: 'text-purple-400',
    icon: '🔌'
  },
  'Hazardous Waste': {
    bg: 'bg-red-950/40',
    border: 'border-red-700/60',
    text: 'text-red-400',
    icon: '🔋'
  },
  'General Waste': {
    bg: 'bg-slate-900/60',
    border: 'border-slate-750/60',
    text: 'text-slate-300',
    icon: '🗑️'
  }
};

const CategoryChip = ({ category }) => {
  const style = CATEGORY_STYLES[category] || {
    bg: 'bg-slate-900/60',
    border: 'border-slate-700/60',
    text: 'text-slate-300',
    icon: '🗑️'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono tracking-tight font-medium ${style.bg} ${style.border} ${style.text}`}>
      <span>{style.icon}</span>
      <span>{category}</span>
    </span>
  );
};

export default CategoryChip;
