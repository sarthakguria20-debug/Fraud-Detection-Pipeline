import React from 'react';
import { RuleDefinition } from '../types';
import { Settings2 } from 'lucide-react';

interface Props {
  rules: RuleDefinition[];
  onToggleRule: (id: string) => void;
}

export const RuleConfig: React.FC<Props> = ({ rules, onToggleRule }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Settings2 className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Live Rule Configuration</h3>
      </div>
      
      <div className="space-y-4">
        {rules.map(rule => (
          <div key={rule.id} className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <label 
                htmlFor={rule.id} 
                className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer block mb-1"
              >
                {rule.name}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {rule.description}
              </p>
            </div>
            <div className="pt-1">
              <button
                id={rule.id}
                onClick={() => onToggleRule(rule.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                  rule.active ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={rule.active}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    rule.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
