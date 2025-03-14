import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();

  // Gestion de la déconnexion
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: () => router.push('/loginPage') },
      ]
    );
  };

  // Gestion des permissions
  const handlePermissions = () => {
    Alert.alert(
      'Permissions',
      'Vérifiez que toutes les permissions nécessaires sont activées pour le bon fonctionnement.',
      [{ text: 'OK' }]
    );
  };

  // À propos
  const handleAbout = () => {
    Alert.alert(
      'À propos',
      'TAILS v1.0\nDéveloppé par Maureen & Mouad.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      {/* Option : Permissions */}
      <TouchableOpacity style={styles.optionButton} onPress={handlePermissions} activeOpacity={0.7}>
        <Text style={styles.optionText} numberOfLines={1}>Vérifier les permissions</Text>
      </TouchableOpacity>

      {/* Option : À propos */}
      <TouchableOpacity style={styles.optionButton} onPress={handleAbout} activeOpacity={0.7}>
        <Text style={styles.optionText} numberOfLines={1}>À propos de l'application</Text>
      </TouchableOpacity>

      {/* Option : Déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText} numberOfLines={1}>Se déconnecter</Text>
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

export default SettingsScreen;
