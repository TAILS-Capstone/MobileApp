import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Device } from 'react-native-ble-plx';

import { useBleContext } from '@/contexts/BleContext';

const formatDeviceName = (device: Device) =>
  device.name || device.localName || `Device ${device.id.slice(0, 4)}`;

const formatTimestamp = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString();

const BleConnectionPanel: React.FC = () => {
  const {
    devices,
    scanForPeripherals,
    stopScan,
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    isScanning,
    isConnecting,
    latestLocation,
    error,
    permissionsGranted,
  } = useBleContext();

  const isConnected = Boolean(connectedDevice);

  const headerStatus = useMemo(() => {
    if (isScanning) {
      return 'Scanning for devices...';
    }

    if (isConnecting) {
      return 'Connecting...';
    }

    if (isConnected) {
      return 'Connected';
    }

    return 'Idle';
  }, [isScanning, isConnecting, isConnected]);

  const renderDevice = ({ item }: { item: Device }) => {
    const disabled = isConnecting || (connectedDevice && connectedDevice.id !== item.id);

    return (
      <TouchableOpacity
        style={[styles.deviceButton, disabled && styles.disabledButton]}
        disabled={disabled}
        onPress={() => connectToDevice(item)}
      >
        <Text style={styles.deviceName}>{formatDeviceName(item)}</Text>
        <Text style={styles.deviceId}>{item.id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Bluetooth Device</Text>
        <View style={styles.statusRow}>
          {isScanning || isConnecting ? <ActivityIndicator size="small" color="#4ade80" /> : null}
          <Text style={styles.statusText}>{headerStatus}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={scanForPeripherals}
          disabled={isScanning || isConnecting}
        >
          <Text style={styles.actionButtonText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={isScanning ? stopScan : disconnectFromDevice}
          disabled={isScanning ? false : !isConnected}
        >
          <Text style={styles.actionButtonText}>{isScanning ? 'Stop' : 'Disconnect'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Permissions:</Text>
        <Text style={styles.infoValue}>
          {permissionsGranted === null ? 'Not requested' : permissionsGranted ? 'Granted' : 'Denied'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Connected device:</Text>
        <Text style={styles.infoValue}>
          {connectedDevice ? formatDeviceName(connectedDevice) : 'None'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Location:</Text>
        <Text style={styles.infoValue}>
          {latestLocation
            ? `${latestLocation.latitude.toFixed(5)}, ${latestLocation.longitude.toFixed(5)} (updated ${formatTimestamp(
                latestLocation.timestamp,
              )})`
            : 'No data yet'}
        </Text>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>Available devices</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={renderDevice}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isScanning ? 'Scanning...' : 'No nearby devices detected yet.'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
  },
  secondaryButton: {
    backgroundColor: '#475569',
  },
  actionButtonText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    color: '#cbd5f5',
    fontWeight: '600',
  },
  infoValue: {
    color: '#94a3b8',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  errorText: {
    color: '#f87171',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  deviceButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: 12,
    marginBottom: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  deviceName: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceId: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});

export default BleConnectionPanel;
