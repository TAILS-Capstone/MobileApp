import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  
  const handleLogin = () => {
    if (email && password) {
      login();
      router.push('/(tabs)'); // Redirect to main tabs after login
    } else {
      alert('Veuillez entrer un email et un mot de passe.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={width * 0.07} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={width * 0.07} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={width * 0.07} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.7}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.signupText}>Don't Have an Account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a3b', // Dark blue background
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: Math.max(width * 0.08, 26),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.03,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: width * 0.04,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.04,
    width: '90%',
    height: height * 0.07,
  },
  icon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: Math.max(width * 0.045, 14),
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.3,
    marginVertical: height * 0.03,
    alignItems: 'center',
    width: '90%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: Math.max(width * 0.045, 16),
    fontWeight: 'bold',
  },
  signupText: {
    color: '#fff',
    fontSize: Math.max(width * 0.04, 14),
    textAlign: 'center',
    marginTop: height * 0.02,
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    color: '#ccc',
    textDecorationLine: 'underline',
    fontSize: Math.max(width * 0.04, 14),
    marginVertical: height * 0.015,
  },
});

export default LoginScreen;
