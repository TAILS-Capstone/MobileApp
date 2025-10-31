import React from "react";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useBLE } from "../hooks/useBLE";
import { Device } from "react-native-ble-plx";

export default function BluetoothScreen() {
  const {
    devices,
    isScanning,
    scanForPeripherals,
    stopScan,
    connectToDevice,
    connectedDevice,
    latestLocation,
    error,
  } = useBLE();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth / TAILS</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isScanning ? (
        <Button title="⛔ Stop scan" onPress={stopScan} />
      ) : (
        <Button title="🔍 Scanner les appareils" onPress={scanForPeripherals} />
      )}

      {connectedDevice ? (
        <Text style={styles.connected}>
          ✅ Connecté à : {connectedDevice.name || connectedDevice.id}
        </Text>
      ) : (
        <Text style={styles.subtitle}>Aucun appareil connecté</Text>
      )}

      {latestLocation ? (
        <View style={styles.locationBox}>
          <Text style={styles.locationTitle}>📍 Dernière position reçue</Text>
          <Text>Lat: {latestLocation.latitude}</Text>
          <Text>Lng: {latestLocation.longitude}</Text>
        </View>
      ) : null}

      <FlatList
        data={devices}
        keyExtractor={(item: Device) => item.id}
        renderItem={({ item }: { item: Device }) => (
          <TouchableOpacity
            style={styles.device}
            onPress={() => connectToDevice(item)}
          >
            <Text style={styles.name}>{item.name || "Appareil sans nom"}</Text>
            <Text style={styles.id}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: "#666", marginBottom: 10 },
  error: { color: "red", marginBottom: 10 },
  connected: { color: "green", marginVertical: 10 },
  device: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: { fontWeight: "600" },
  id: { fontSize: 12, color: "#999" },
  locationBox: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  locationTitle: { fontWeight: "bold", marginBottom: 4 },
});