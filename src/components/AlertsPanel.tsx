import React from 'react';
import { FraudAlert } from '../types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface Props {
  alerts: FraudAlert[];
}

export const AlertsPanel: React.FC<Props> = ({ alerts }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-red-50 dark:bg-red-900/10 p-4 border-b border-red-100 dark:border-red-900/20 flex justify-between items-center">
        <h2 className="font-semibold text-red-700 dark:text-red-400 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2" />
          Fraud Alerts
        </h2>
        <span className="text-xs font-mono font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-md">
          {alerts.length} Detected
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950/30">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
            <ShieldCheck className="w-12 h-12 mb-3 text-green-400 opacity-50" />
            <p>System secure. No anomalies detected.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="p-3 rounded-lg bg-white dark:bg-gray-800 border-l-4 border-l-red-500 border-y border-r border-y-gray-200 border-r-gray-200 dark:border-y-gray-700 dark:border-r-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 uppercase tracking-wider text-[10px]">
                  {alert.ruleId.replace('rule_', '').replace('_', ' ')}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">
                {alert.message}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="font-mono">USER: {alert.userId}</span>
                <span className="font-mono text-red-600 dark:text-red-400 font-medium">${alert.amount.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
