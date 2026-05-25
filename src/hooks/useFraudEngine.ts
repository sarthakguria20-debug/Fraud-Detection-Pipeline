import { useState, useEffect, useRef, useCallback } from 'react';
import { Transaction, FraudAlert, SystemMetrics, RuleDefinition } from '../types';
import { calculateDistance } from '../lib/geo';
import { generateId } from '../lib/simulator';

// Rules configuration
export const defaultRules: RuleDefinition[] = [
  { id: 'rule_high_amount', name: 'High Transaction Amount', description: 'Transaction amount exceeds $1,000.', active: true },
  { id: 'rule_high_freq', name: 'High Frequency', description: '> 3 transactions from same user within 60s.', active: true },
  { id: 'rule_geo_vel', name: 'Geo-Velocity', description: 'Unrealistic travel time (> 1000km within 60 mins).', active: true },
];

export function useFraudEngine() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    tps: 0,
    totalProcessed: 0,
    totalFlagged: 0,
    totalApproved: 0,
    avgLatencyMs: 0,
  });
  const [rules, setRules] = useState<RuleDefinition[]>(defaultRules);

  const isRunning = useRef(false);
  const transactionBuffer = useRef<Transaction[]>([]); // For React UI rendering batching
  const slidingWindowRef = useRef<Transaction[]>([]); // internal fast memory for last 60 seconds
  const metricsInternal = useRef<SystemMetrics>({ tps: 0, totalProcessed: 0, totalFlagged: 0, totalApproved: 0, avgLatencyMs: 0 });
  const localAlertsBuffer = useRef<FraudAlert[]>([]);
  const lastSecondTxCount = useRef(0);

  const processTransaction = useCallback((txn: Transaction) => {
    const startTime = performance.now();
    let isFlagged = false;
    const currentRules = rules;

    const window = slidingWindowRef.current;
    
    // Evaluate rules
    for (const rule of currentRules) {
      if (!rule.active) continue;

      if (rule.id === 'rule_high_amount' && txn.amount > 1000) {
        isFlagged = true;
        localAlertsBuffer.current.push({
          id: `alert_${generateId()}`,
          transactionId: txn.id,
          userId: txn.userId,
          ruleId: rule.id,
          message: `Unusually large transaction: $${txn.amount.toFixed(2)}`,
          timestamp: txn.timestamp,
          amount: txn.amount
        });
      }

      if (rule.id === 'rule_high_freq' && !isFlagged) {
        // Last 60 seconds for this user
        const timeLimit = txn.timestamp - 60000;
        let count = 0;
        for (let i = window.length - 1; i >= 0; i--) {
          if (window[i].timestamp < timeLimit) break;
          if (window[i].userId === txn.userId) count++;
        }
        if (count >= 3) { // 3 previous + current = 4
          isFlagged = true;
          localAlertsBuffer.current.push({
            id: `alert_${generateId()}`,
            transactionId: txn.id,
            userId: txn.userId,
            ruleId: rule.id,
            message: `High frequency: ${count + 1} transactions in < 1m`,
            timestamp: txn.timestamp,
            amount: txn.amount
          });
        }
      }

      if (rule.id === 'rule_geo_vel' && !isFlagged) {
        // Find last transaction for user
        let lastUserTxn = null;
        for (let i = window.length - 1; i >= 0; i--) {
          if (window[i].userId === txn.userId) {
            lastUserTxn = window[i];
            break;
          }
        }
        
        if (lastUserTxn) {
          const timeDiffMs = txn.timestamp - lastUserTxn.timestamp;
          if (timeDiffMs < 3600000) { // < 1 hour
            const dist = calculateDistance(lastUserTxn.location, txn.location);
            if (dist > 1000) { // > 1000 km
              isFlagged = true;
              localAlertsBuffer.current.push({
                id: `alert_${generateId()}`,
                transactionId: txn.id,
                userId: txn.userId,
                ruleId: rule.id,
                message: `Geo-velocity: ${dist.toFixed(0)}km in ${(timeDiffMs / 1000).toFixed(1)}s`,
                timestamp: txn.timestamp,
                amount: txn.amount
              });
            }
          }
        }
      }
    }

    const endTime = performance.now();
    const latency = endTime - startTime;

    txn.status = isFlagged ? 'flagged' : 'approved';
    slidingWindowRef.current.push(txn);
    transactionBuffer.current.push(txn);

    metricsInternal.current.totalProcessed++;
    if (isFlagged) metricsInternal.current.totalFlagged++;
    else metricsInternal.current.totalApproved++;
    
    metricsInternal.current.avgLatencyMs = (metricsInternal.current.avgLatencyMs * 0.99) + (latency * 0.01);
    lastSecondTxCount.current++;
  }, [rules]);

  // Clean up sliding window periodically (keep last 60 seconds)
  useEffect(() => {
    const cleanerId = setInterval(() => {
      const now = Date.now();
      const cutoff = now - 60000;
      slidingWindowRef.current = slidingWindowRef.current.filter(t => t.timestamp >= cutoff);
    }, 5000); // clean every 5s

    const metricsSyncer = setInterval(() => {
      metricsInternal.current.tps = lastSecondTxCount.current;
      lastSecondTxCount.current = 0;
      setMetrics({ ...metricsInternal.current });
      
      // Update UI buffers
      if (transactionBuffer.current.length > 0) {
        setTransactions(prev => {
          const updated = [...transactionBuffer.current, ...prev].slice(0, 100);
          transactionBuffer.current = [];
          return updated;
        });
      }
      if (localAlertsBuffer.current.length > 0) {
        setAlerts(prev => {
          const updated = [...localAlertsBuffer.current, ...prev].slice(0, 50);
          localAlertsBuffer.current = [];
          return updated;
        });
      }
    }, 1000); // UI sync every 1s

    return () => {
      clearInterval(cleanerId);
      clearInterval(metricsSyncer);
    };
  }, []);

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, active: !r.active } : r));
  };

  return {
    transactions,
    alerts,
    metrics,
    processTransaction,
    rules,
    toggleRule
  };
}
