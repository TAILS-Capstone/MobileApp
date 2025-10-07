import React, { createContext, useContext, ReactNode } from 'react';

import { useBLE } from '@/hooks/useBLE';
import type { BleLocation } from '@/hooks/useBLE';
import type { Device } from 'react-native-ble-plx';

type BleContextValue = ReturnType<typeof useBLE>;

const BleContext = createContext<BleContextValue | undefined>(undefined);

interface BleProviderProps {
  children: ReactNode;
}

export const BleProvider: React.FC<BleProviderProps> = ({ children }) => {
  const bleState = useBLE();

  return <BleContext.Provider value={bleState}>{children}</BleContext.Provider>;
};

export const useBleContext = (): BleContextValue => {
  const context = useContext(BleContext);

  if (!context) {
    throw new Error('useBleContext must be used within a BleProvider');
  }

  return context;
};

export type { Device, BleLocation };
