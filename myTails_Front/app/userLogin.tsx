import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function UserModeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez votre mode utilisateur</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/map')} // Go to map for Normal Mode
      >
        <Text style={styles.buttonText}>Mode Normal</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/adminLogin')} // Go to admin login page
      >
        <Text style={styles.buttonText}>Mode Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
