import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Dashboard Header */}
        <Text style={styles.title}>Welcome to TAILS</Text>
        <Text style={styles.subtitle}>Your personalized dashboard</Text>

        {/* Statistics Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="airplane" size={width * 0.08} color="#007bff" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Flights completed</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="location" size={width * 0.08} color="#007bff" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>GPS points collected</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.recentActivity}>
          <Text style={styles.activityItem}>📅 Last flight: January 25, 2025</Text>
          <Text style={styles.activityItem}>🕒 Last login: January 29, 2025</Text>
        </View>

        {/* Button to navigate to tabbed page */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <Text style={styles.actionButtonText}>📁 Access Features</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#1a1a3b',
  },
  content: {
    paddingVertical: height * 0.03,
  },
  title: {
    fontSize: width * 0.07, // Responsive text size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#d1d1d1',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.04,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#2a2a5b',
    borderRadius: width * 0.03,
    padding: height * 0.025,
    width: '48%',
  },
  statNumber: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: height * 0.01,
  },
  statLabel: {
    fontSize: width * 0.04,
    color: '#d1d1d1',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.02,
  },
  recentActivity: {
    backgroundColor: '#2a2a5b',
    padding: height * 0.025,
    borderRadius: width * 0.03,
    marginBottom: height * 0.03,
  },
  activityItem: {
    fontSize: width * 0.045,
    color: '#fff',
    marginBottom: height * 0.015,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});