import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useRouter } from 'expo-router';
import "expo-router/entry";
export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Titre principal */}
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Découvrez les fonctionnalités de TAILS</Text>

        {/* Bouton "Voir la Carte" */}
        <TouchableOpacity
          onPress={() => router.push('/map')} // Navigue vers la page "Carte"
          style={styles.button}
        >
          <Text style={styles.buttonText}>📍 Voir la Carte</Text>
        </TouchableOpacity>

        {/* Bouton "Historique des vols" */}
        <TouchableOpacity
          onPress={() => router.push('/history')} // Navigue vers une page historique (à créer)
          style={styles.button}
        >
          <Text style={styles.buttonText}>📊 Historique des vols</Text>
        </TouchableOpacity>

        {/* Bouton "Paramètres" */}
        <TouchableOpacity
          onPress={() => router.push('/settings')} // Navigue vers une page paramètres (à créer)
          style={styles.button}
        >
          <Text style={styles.buttonText}>⚙️ Paramètres</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Styles pour l'écran Explore
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a3b', // Couleur principale de fond
    paddingHorizontal: 20,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d1d1',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff', // Bleu vif
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    width: '85%',
    alignItems: 'center',
    elevation: 3, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
