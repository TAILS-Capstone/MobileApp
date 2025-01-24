import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminLoginScreen() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (code === '1234') {
      router.push('/(tabs)/map'); // Redirect to map if the code is correct
    } else {
      alert('Code incorrect');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez le code d'accès</Text>
      <TextInput
        style={styles.input}
        placeholder="Code d'accès"
        secureTextEntry
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
