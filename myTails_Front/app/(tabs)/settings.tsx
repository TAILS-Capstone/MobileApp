import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

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
      'TAILS v1.0\nDéveloppé par Maureen&Mouad.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Option : Permissions */}
      <TouchableOpacity style={styles.optionButton} onPress={handlePermissions}>
        <Text style={styles.optionText}>Vérifier les permissions</Text>
      </TouchableOpacity>

      {/* Option : À propos */}
      <TouchableOpacity style={styles.optionButton} onPress={handleAbout}>
        <Text style={styles.optionText}>À propos de l'application</Text>
      </TouchableOpacity>

      {/* Option : Déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a3b', // Couleur principale de fond
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',  
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#2a2a5b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
