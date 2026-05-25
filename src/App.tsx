import React, { useEffect, useRef, useState } from 'react';
import { useFraudEngine } from './hooks/useFraudEngine';
import { TransactionFeed } from './components/TransactionFeed';
import { AlertsPanel } from './components/AlertsPanel';
import { MetricsPanel } from './components/MetricsPanel';
import { RuleConfig } from './components/RuleConfig';
import { 
  generateNormalTransaction, 
  generateHighAmountFraud, 
  generateHighFrequencyFraud, 
  generateGeoVelocityFraud 
} from './lib/simulator';
import { Play, Square, Zap, HardDrive, Shield } from 'lucide-react';

export default function App() {
  const { transactions, alerts, metrics, rules, toggleRule, processTransaction } = useFraudEngine();
  const [isStreaming, setIsStreaming] = useState(false);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startStream = () => {
    setIsStreaming(true);
    streamIntervalRef.current = setInterval(() => {
      // Generate 1-5 normal txns per tick (roughly 20-100 TPS)
      const batchSize = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < batchSize; i++) {
        processTransaction(generateNormalTransaction());
      }
    }, 50); // fast interval for high throughput simulation
  };

  const stopStream = () => {
    setIsStreaming(false);
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  const injectFraud = (type: 'amount' | 'freq' | 'geo') => {
    const timestamp = Date.now();
    if (type === 'amount') {
      processTransaction(generateHighAmountFraud(timestamp));
    } else if (type === 'freq') {
      const txns = generateHighFrequencyFraud(timestamp);
      txns.forEach(processTransaction);
    } else if (type === 'geo') {
      const txns = generateGeoVelocityFraud(timestamp);
      txns.forEach(processTransaction);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold flex items-center tracking-tight">
              <Shield className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Stream Sentinel
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time transaction fraud detection engine.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={isStreaming ? stopStream : startStream}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isStreaming 
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              }`}
            >
              {isStreaming ? (
                <><Square className="w-4 h-4 mr-2" /> Stop Stream</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Start Stream</>
              )}
            </button>
          </div>
        </header>

        <MetricsPanel metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
          
          {/* Left Column: Feed */}
          <div className="lg:col-span-5 h-full">
            <TransactionFeed transactions={transactions} />
          </div>

          {/* Middle Column: Alerts */}
          <div className="lg:col-span-4 h-full">
            <AlertsPanel alerts={alerts} />
          </div>

          {/* Right Column: Controls & Config */}
          <div className="lg:col-span-3 space-y-6">
            <RuleConfig rules={rules} onToggleRule={toggleRule} />
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-amber-500" />
                Inject Anomalies
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => injectFraud('amount')}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group"
                >
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-amber-400">Large Transaction</p>
                  <p className="text-xs text-gray-500 mt-1">Single txn &gt; $1000</p>
                </button>

                <button 
                  onClick={() => injectFraud('freq')}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group"
                >
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-amber-400">Rapid Velocity</p>
                  <p className="text-xs text-gray-500 mt-1">5 txns in 2 seconds</p>
                </button>

                <button 
                  onClick={() => injectFraud('geo')}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group"
                >
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-amber-400">Impossible Travel</p>
                  <p className="text-xs text-gray-500 mt-1">NY &amp; Tokyo within 1s</p>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl text-xs text-gray-500 dark:text-gray-400 flex items-start space-x-3">
              <HardDrive className="w-5 h-5 opacity-50 shrink-0" />
              <p>Engine retains a localized sliding window of 60 seconds memory size for optimal O(n) localized stream aggregation processing without external DB dependency.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
