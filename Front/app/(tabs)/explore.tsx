import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import "expo-router/entry";

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Titre principal */}
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Découvrez les fonctionnalités de TAILS</Text>

        {/* Bouton "Voir la Carte" */}
        <TouchableOpacity
          onPress={() => router.push('/map')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>📍 Voir la Carte</Text>
        </TouchableOpacity>

        {/* Bouton "Historique des vols" */}
        <TouchableOpacity
          onPress={() => router.push('/history')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>📊 Historique des vols</Text>
        </TouchableOpacity>

        {/* Bouton "Paramètres" */}
        <TouchableOpacity
          onPress={() => router.push('/settings')}
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
    flex: 1,
    backgroundColor: '#1a1a3b',
    paddingHorizontal: width * 0.05,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.03,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#d1d1d1',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.018,
    borderRadius: width * 0.03,
    marginVertical: height * 0.015,
    width: '85%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});

export default ExploreScreen;
