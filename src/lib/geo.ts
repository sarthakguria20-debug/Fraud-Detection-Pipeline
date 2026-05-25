import { Location } from '../types';

function toRad(value: number) {
  return value * Math.PI / 180;
}

export function calculateDistance(loc1: Location, loc2: Location): number {
  if (loc1.lat === loc2.lat && loc1.lng === loc2.lng) {
    return 0;
  }
  const R = 6371; // km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const lat1 = toRad(loc1.lat);
  const lat2 = toRad(loc2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
