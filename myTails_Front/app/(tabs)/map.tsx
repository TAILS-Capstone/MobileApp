import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Map from '../../components/Map';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Carte</Text>
        <Map />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});