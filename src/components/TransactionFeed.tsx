import React from 'react';
import { Transaction } from '../types';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

export const TransactionFeed: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-500" />
          Live Event Stream
        </h2>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-md">
          Latest 100
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {transactions.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm italic">
            Waiting for transactions...
          </div>
        ) : (
          transactions.map((txn) => (
            <div 
              key={txn.id} 
              className={`p-3 rounded-lg border flex flex-col space-y-2 animate-in fade-in slide-in-from-top-2
                ${txn.status === 'flagged' 
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' 
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {txn.status === 'flagged' ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                    {txn.userId}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                  ${txn.amount.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate max-w-[120px]">{txn.merchant}</span>
                <span className="flex items-center">
                  {txn.location.city}, {txn.location.country}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
