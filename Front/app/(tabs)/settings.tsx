import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();

  // Logout handling
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => router.push('/loginPage') },
      ]
    );
  };

  // Permissions handling
  const handlePermissions = () => {
    Alert.alert(
      'Permissions',
      'Please verify that all necessary permissions are enabled for proper functionality.',
      [{ text: 'OK' }]
    );
  };

  // About
  const handleAbout = () => {
    Alert.alert(
      'About',
      'TAILS v1.0\nDeveloped by Maureen & Mouad.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Option: Permissions */}
      <TouchableOpacity style={styles.optionButton} onPress={handlePermissions} activeOpacity={0.7}>
        <Text style={styles.optionText} numberOfLines={1}>Check permissions</Text>
      </TouchableOpacity>

      {/* Option: About */}
      <TouchableOpacity style={styles.optionButton} onPress={handleAbout} activeOpacity={0.7}>
        <Text style={styles.optionText} numberOfLines={1}>About the application</Text>
      </TouchableOpacity>

      {/* Option: Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText} numberOfLines={1}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a3b',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: Math.max(width * 0.07, 22),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  optionButton: {
    backgroundColor: '#2a2a5b',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.04,
    marginVertical: height * 0.015,
    width: '90%', // Increased width to prevent text wrapping
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  optionText: {
    fontSize: Math.max(width * 0.045, 16),
    color: '#fff',
    textAlign: 'center',
    flexWrap: 'nowrap', // Prevents text from breaking into a second line
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.04,
    marginTop: height * 0.03,
    width: '90%', // Increased width
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutText: {
    fontSize: Math.max(width * 0.045, 16),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
});