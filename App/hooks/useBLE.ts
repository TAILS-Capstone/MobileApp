import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device, BleError, Characteristic, Subscription } from 'react-native-ble-plx';
import * as ExpoDevice from 'expo-device';
import base64 from 'base-64';

import { DATA_SERVICE_UUID, DEVICE_NAME_FILTERS, LOCATION_CHARACTERISTIC_UUID } from '@/constants/ble';

export interface BleLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface UseBleState {
  devices: Device[];
  connectedDevice: Device | null;
  isScanning: boolean;
  isConnecting: boolean;
  permissionsGranted: boolean | null;
  latestLocation: BleLocation | null;
  error: string | null;
  scanForPeripherals: () => Promise<void>;
  stopScan: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectFromDevice: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

const useStableBleManager = () => {
  //const managerRef = useRef<BleManager>();
  const managerRef = useRef<BleManager | null>(null);

  if (!managerRef.current) {
    managerRef.current = new BleManager();
  }

  return managerRef;
};

const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
  devices.some(device => device.id === nextDevice.id);

const deviceMatchesFilters = (device: Device) => {
  if (DEVICE_NAME_FILTERS.length === 0) {
    return true;
  }

  const deviceName = device.name ?? device.localName ?? '';

  return DEVICE_NAME_FILTERS.some(filter =>
    deviceName.toLowerCase().includes(filter.toLowerCase()),
  );
};

const decodeLocation = (characteristic: Characteristic): BleLocation | null => {
  if (!characteristic.value) {
    return null;
  }

  const decoded = base64.decode(characteristic.value).trim();

  if (!decoded) {
    return null;
  }

  const [latitudeString, longitudeString] = decoded.split(/[,|;]/).map(value => value.trim());

  const latitude = Number.parseFloat(latitudeString ?? '');
  const longitude = Number.parseFloat(longitudeString ?? '');

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
    timestamp: Date.now(),
  };
};

export const useBLE = (): UseBleState => {
  const bleManagerRef = useStableBleManager();
  const characteristicSubscriptionRef = useRef<Subscription | null>(null);

  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);
  const [latestLocation, setLatestLocation] = useState<BleLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetStream = useCallback(() => {
    characteristicSubscriptionRef.current?.remove();
    characteristicSubscriptionRef.current = null;
  }, []);

  const stopScan = useCallback(() => {
    bleManagerRef.current?.stopDeviceScan();
    setIsScanning(false);
  }, [bleManagerRef]);

  const handleDataUpdate = useCallback(
    (bleError: BleError | null, characteristic: Characteristic | null) => {
      if (bleError) {
        setError(bleError.message);
        return;
      }

      if (!characteristic) {
        return;
      }

      const nextLocation = decodeLocation(characteristic);

      if (nextLocation) {
        setLatestLocation(nextLocation);
        setError(null);
      }
    },
    [],
  );

  const startStreamingData = useCallback(
    async (device: Device) => {
      resetStream();

      characteristicSubscriptionRef.current = device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        LOCATION_CHARACTERISTIC_UUID,
        handleDataUpdate,
      );
    },
    [handleDataUpdate, resetStream],
  );

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const fineLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK',
          },
        );

        const granted = fineLocation === PermissionsAndroid.RESULTS.GRANTED;
        setPermissionsGranted(granted);
        return granted;
      }

      const bluetoothScan = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location',
          buttonPositive: 'OK',
        },
      );

      const bluetoothConnect = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location',
          buttonPositive: 'OK',
        },
      );

      const fineLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location',
          buttonPositive: 'OK',
        },
      );

      const granted =
        bluetoothScan === PermissionsAndroid.RESULTS.GRANTED &&
        bluetoothConnect === PermissionsAndroid.RESULTS.GRANTED &&
        fineLocation === PermissionsAndroid.RESULTS.GRANTED;

      setPermissionsGranted(granted);
      return granted;
    }

    setPermissionsGranted(true);
    return true;
  }, []);

  const scanForPeripherals = useCallback(async () => {
    setError(null);
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      setError('Bluetooth permissions are required to scan for devices.');
      return;
    }

    setDevices([]);
    setIsScanning(true);

    bleManagerRef.current?.startDeviceScan(null, null, (bleError, device) => {
      if (bleError) {
        setError(bleError.message);
        stopScan();
        return;
      }

      if (device && deviceMatchesFilters(device)) {
        setDevices(prevDevices => {
          if (isDuplicateDevice(prevDevices, device)) {
            return prevDevices;
          }

          return [...prevDevices, device];
        });
      }
    });
  }, [bleManagerRef, requestPermissions, stopScan]);

  const connectToDevice = useCallback(
    async (device: Device) => {
      setIsConnecting(true);
      setError(null);

      try {
        const connected = await bleManagerRef.current?.connectToDevice(device.id, {
          requestMTU: 256,
        });

        if (!connected) {
          throw new Error('Failed to establish a Bluetooth connection.');
        }

        setConnectedDevice(connected);
        await connected.discoverAllServicesAndCharacteristics();
        stopScan();
        await startStreamingData(connected);
      } catch (connectionError) {
        const message =
          connectionError instanceof Error
            ? connectionError.message
            : 'Failed to connect to device.';
        setError(message);
        setConnectedDevice(null);
      } finally {
        setIsConnecting(false);
      }
    },
    [bleManagerRef, startStreamingData, stopScan],
  );

  const disconnectFromDevice = useCallback(async () => {
    if (!connectedDevice) {
      return;
    }

    try {
      resetStream();
      setLatestLocation(null);
      await bleManagerRef.current?.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    } catch (disconnectError) {
      const message =
        disconnectError instanceof Error
          ? disconnectError.message
          : 'Failed to disconnect from device.';
      setError(message);
    }
  }, [bleManagerRef, connectedDevice, resetStream]);

  useEffect(() => {
    return () => {
      stopScan();
      resetStream();
      bleManagerRef.current?.destroy();
    };
  }, [bleManagerRef, resetStream, stopScan]);

  useEffect(() => {
    if (!connectedDevice && latestLocation) {
      setLatestLocation(null);
    }
  }, [connectedDevice, latestLocation]);

  const state = useMemo<UseBleState>(
    () => ({
      devices,
      connectedDevice,
      isScanning,
      isConnecting,
      permissionsGranted,
      latestLocation,
      error,
      scanForPeripherals,
      stopScan,
      connectToDevice,
      disconnectFromDevice,
      requestPermissions,
    }),
    [
      devices,
      connectedDevice,
      isScanning,
      isConnecting,
      permissionsGranted,
      latestLocation,
      error,
      scanForPeripherals,
      stopScan,
      connectToDevice,
      disconnectFromDevice,
      requestPermissions,
    ],
  );

  return state;
};

export type { Device } from 'react-native-ble-plx';
