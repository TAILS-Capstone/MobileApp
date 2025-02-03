import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter(); // Nécessaire pour la navigation

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header du Dashboard */}
        <Text style={styles.title}>Bienvenue sur TAILS</Text>
        <Text style={styles.subtitle}>Votre tableau de bord personnalisé</Text>

        {/* Section Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="airplane" size={28} color="#007bff" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Vols réalisés</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="location" size={28} color="#007bff" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Points GPS collectés</Text>
          </View>
        </View>

        {/* Activité récente */}
        <Text style={styles.sectionTitle}>Activité récente</Text>
        <View style={styles.recentActivity}>
          <Text style={styles.activityItem}>📅 Dernier vol : 25 Janvier 2025</Text>
          <Text style={styles.activityItem}>🕒 Dernière connexion : 29 Janvier 2025</Text>
        </View>

        {/* Bouton pour rediriger vers une page avec onglets */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/explore')} // Redirige vers Explore ou autre page
        >
          <Text style={styles.actionButtonText}>📁 Accéder aux fonctionnalités</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding : 16 ,
    backgroundColor: '#1a1a3b',

  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d1d1',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    padding: 16,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#2a2a5b',
    borderRadius: 10,
    padding: 16,
    width: '48%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#d1d1d1',
    marginTop: 5,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  recentActivity: {
    backgroundColor: '#2a2a5b',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  activityItem: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
