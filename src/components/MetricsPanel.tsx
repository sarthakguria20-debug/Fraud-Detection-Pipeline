import React from 'react';
import { SystemMetrics } from '../types';
import { Activity, Cpu, CheckCircle, AlertOctagon } from 'lucide-react';

interface Props {
  metrics: SystemMetrics;
}

export const MetricsPanel: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Throughput</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{metrics.tps}</span>
            <span className="text-sm font-medium text-gray-500">req/s</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Approved</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{metrics.totalApproved}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Flagged</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{metrics.totalFlagged}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-600 dark:text-slate-400">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Eval Latency</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
              {metrics.avgLatencyMs.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-gray-500">ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
