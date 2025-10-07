import type { BleLocation } from '@/contexts/BleContext';

export interface MapProps {
  connectedDeviceName?: string | null;
  latestLocation?: BleLocation | null;
}