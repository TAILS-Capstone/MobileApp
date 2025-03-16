import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const SecurityScreen = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/loginPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Settings</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a3b',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: Math.max(width * 0.08, 24),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: height * 0.025, // Increased padding for a larger button
    paddingHorizontal: width * 0.35, // Wider button for better usability
    borderRadius: width * 0.04,
    alignItems: 'center',
    width: '100%', // Increased button width
    elevation: 4, // Slightly stronger Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: Math.max(width * 0.05, 18), // Increased font size for better readability
    fontWeight: 'bold',
  },
});

export default SecurityScreen;
