import React, { useState, useEffect } from 'react';
import api from '../api';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Activity, Recycle, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/dashboard-data');
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analytical data from server database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <span className="text-sm font-mono text-terminal-accent animate-pulse uppercase">
          COMPUTING METRIC AGGREGATIONS...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="border border-terminal-danger bg-terminal-dangerBg/40 p-4 rounded-md text-red-300">
          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-terminal-danger mb-1">
            COMPUTATION FAILURE
          </h4>
          <p className="text-xs font-sans">{error}</p>
        </div>
      </div>
    );
  }

  const { stats = {}, categories = {}, trend = {} } = data || {};
  const totalScans = stats.totalScans || 0;

  if (totalScans === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex-grow flex flex-col justify-center items-center">
        <div className="border border-terminal-border border-dashed p-12 text-center rounded-md bg-terminal-card/20 w-full max-w-lg">
          <h2 className="text-lg font-mono text-terminal-muted uppercase mb-3">
            ANALYTICS ENGINE OFFLINE
          </h2>
          <p className="text-xs font-mono text-terminal-muted leading-relaxed mb-6">
            No waste scans detected for current resident user ID. Complete your first scan in the Scanner tab to activate the metric logs and generate telemetry charts.
          </p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 border border-terminal-accent bg-terminal-accent/10 hover:bg-terminal-accent/25 text-terminal-accent text-xs font-mono rounded transition-colors"
          >
            REFRESH ENGINE
          </button>
        </div>
      </div>
    );
  }

  // 1. Doughnut Chart Configuration
  const recyclableCount = stats.recyclableCount || 0;
  const hazardousCount = stats.hazardousCount || 0;
  const nonRecyclableCount = Math.max(0, totalScans - recyclableCount - hazardousCount);

  const doughnutData = {
    labels: ['RECYCLABLE', 'HAZARDOUS', 'NON-RECYCLABLE'],
    datasets: [
      {
        data: [recyclableCount, hazardousCount, nonRecyclableCount],
        backgroundColor: [
          'rgba(16, 185, 129, 0.75)', // emerald
          'rgba(239, 68, 68, 0.75)',  // red
          'rgba(75, 85, 99, 0.75)'    // gray
        ],
        borderColor: ['#10b981', '#ef4444', '#4b5563'],
        borderWidth: 1.5,
      }
    ]
  };

  // 2. Line Chart Configuration (7-day trend)
  const lineData = {
    labels: trend.labels || [],
    datasets: [
      {
        fill: true,
        label: 'SCANS',
        data: trend.data || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        tension: 0.25,
        borderWidth: 2,
        pointBackgroundColor: '#10b981'
      }
    ]
  };

  // 3. Bar Chart Configuration (categories counts)
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const barLabels = sortedCategories.map(c => c[0].replace(" Waste", "").toUpperCase());
  const barValues = sortedCategories.map(c => c[1]);

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'ITEMS SCANNED',
        data: barValues,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: '#10b981',
        borderWidth: 1.5
      }
    ]
  };

  // Chart Global Styling Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#7f9c8b',
          font: { family: 'Space Mono', size: 9 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(28, 50, 36, 0.25)' },
        ticks: { color: '#7f9c8b', font: { family: 'Space Mono', size: 8 } }
      },
      y: {
        grid: { color: 'rgba(28, 50, 36, 0.25)' },
        ticks: { color: '#7f9c8b', font: { family: 'Space Mono', size: 8 }, stepSize: 1 }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#7f9c8b',
          font: { family: 'Space Mono', size: 9 }
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-terminal-border pb-4">
        <div>
          <h1 className="text-3xl font-condensed font-bold tracking-wider uppercase text-terminal-accent">
            METRICS TELEMETRY DASHBOARD
          </h1>
          <p className="text-xs font-mono text-terminal-muted mt-1">
            Real-time analytics and statistics computed from user scan histories.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-terminal-border hover:border-terminal-accent text-terminal-muted hover:text-terminal-accent text-xs font-mono rounded transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>RECOMPUTE METRICS</span>
        </button>
      </div>

      {/* Summary Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="border border-terminal-border bg-terminal-card p-4 rounded flex items-center gap-4">
          <div className="p-3 bg-terminal-accent/5 rounded border border-terminal-accent/20">
            <Activity className="h-5 w-5 text-terminal-accent" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-terminal-muted block tracking-wider uppercase">
              TOTAL SCANS
            </span>
            <span className="text-2xl font-mono font-bold text-terminal-text">
              {stats.totalScans}
            </span>
          </div>
        </div>

        {/* Recyclables */}
        <div className="border border-terminal-border bg-terminal-card p-4 rounded flex items-center gap-4">
          <div className="p-3 bg-emerald-950/20 rounded border border-emerald-800/40">
            <Recycle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-terminal-muted block tracking-wider uppercase">
              RECYCLABLE
            </span>
            <span className="text-2xl font-mono font-bold text-emerald-400">
              {stats.recyclableCount}
            </span>
          </div>
        </div>

        {/* Recycle Rate */}
        <div className="border border-terminal-border bg-terminal-card p-4 rounded flex items-center gap-4">
          <div className="p-3 bg-sky-950/20 rounded border border-sky-800/40">
            <TrendingUp className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-terminal-muted block tracking-wider uppercase">
              RECYCLE RATE
            </span>
            <span className="text-2xl font-mono font-bold text-sky-400">
              {stats.recycleRate}%
            </span>
          </div>
        </div>

        {/* Hazardous */}
        <div className="border border-terminal-border bg-terminal-card p-4 rounded flex items-center gap-4">
          <div className="p-3 bg-red-950/20 rounded border border-red-800/40">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-terminal-muted block tracking-wider uppercase">
              HAZARDOUS
            </span>
            <span className="text-2xl font-mono font-bold text-red-400">
              {stats.hazardousCount}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut Chart */}
        <div className="border border-terminal-border bg-terminal-card p-5 rounded-md flex flex-col h-80">
          <h3 className="text-xs font-mono text-terminal-accent tracking-wider uppercase mb-4 border-b border-terminal-border pb-1">
            RECYCLABILITY RATIO
          </h3>
          <div className="flex-grow relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="border border-terminal-border bg-terminal-card p-5 rounded-md flex flex-col h-80 lg:col-span-2">
          <h3 className="text-xs font-mono text-terminal-accent tracking-wider uppercase mb-4 border-b border-terminal-border pb-1">
            SCAN telemetry (LAST 7 DAYS)
          </h3>
          <div className="flex-grow relative">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="border border-terminal-border bg-terminal-card p-5 rounded-md flex flex-col h-96 lg:col-span-3">
          <h3 className="text-xs font-mono text-terminal-accent tracking-wider uppercase mb-4 border-b border-terminal-border pb-1">
            VOLUME BY WASTE CATEGORY
          </h3>
          <div className="flex-grow relative">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
