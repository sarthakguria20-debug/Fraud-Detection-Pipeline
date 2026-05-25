import { Transaction, Location } from '../types';

const INITIAL_USER_COUNT = 100;
const MERCHANTS = ['Amazon', 'Wal-Mart', 'Uber', 'Netflix', 'Starbucks', 'Apple', 'Google Play', 'Spotify', 'Local Grocery', 'Gas Station'];
const CITIES = [
  { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
];

export const generateId = () => Math.random().toString(36).substr(2, 9);
export const getRandomUser = () => `user_${Math.floor(Math.random() * INITIAL_USER_COUNT)}`;
export const getRandomMerchant = () => MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
export const getRandomLocation = (): Location => CITIES[Math.floor(Math.random() * CITIES.length)];
export const getRandomAmount = (min = 1, max = 200) => Number((Math.random() * (max - min) + min).toFixed(2));

export const generateNormalTransaction = (timestamp = Date.now()): Transaction => {
  return {
    id: `txn_${generateId()}`,
    userId: getRandomUser(),
    amount: getRandomAmount(5, 150),
    merchant: getRandomMerchant(),
    location: getRandomLocation(),
    timestamp,
    status: 'pending',
  };
};

export const generateHighAmountFraud = (timestamp = Date.now()): Transaction => {
  return {
    ...generateNormalTransaction(timestamp),
    amount: getRandomAmount(2000, 5000), // > 1000
    merchant: 'Luxury Store Inc.',
  };
};

export const generateHighFrequencyFraud = (timestamp = Date.now()): Transaction[] => {
  const userId = getRandomUser();
  const txns: Transaction[] = [];
  const baseTime = timestamp - 2000; // start 2 seconds ago
  // Generate 5 txns in the last 2 seconds
  for (let i = 0; i < 5; i++) {
    txns.push({
      ...generateNormalTransaction(baseTime + i * 500),
      userId,
      amount: getRandomAmount(10, 50),
    });
  }
  return txns;
};

export const generateGeoVelocityFraud = (timestamp = Date.now()): Transaction[] => {
  const userId = getRandomUser();
  // Two transactions from different continents within 1 second
  return [
    {
      ...generateNormalTransaction(timestamp - 1000),
      userId,
      location: CITIES[0], // NY
    },
    {
      ...generateNormalTransaction(timestamp),
      userId,
      location: CITIES[2], // Tokyo
    }
  ];
};
