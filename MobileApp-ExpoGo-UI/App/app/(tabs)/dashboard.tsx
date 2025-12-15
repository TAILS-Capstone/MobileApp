import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

const { width, height } = Dimensions.get('window');

// Use drone image as background
const backgroundImage = require('@/assets/images/drone.png');

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <AnimatedBackground 
      backgroundImage={backgroundImage}
      overlayColors={['rgba(18, 18, 40, 0.5)', 'rgba(22, 22, 55, 0.4)', 'rgba(28, 28, 70, 0.3)']}
      enableRotation={true}
      enableVerticalMovement={true}
      showCirclePatterns={true}
    >
      <View style={{ paddingTop: 30 }}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Dashboard Header */}
          <Text style={styles.title}>Welcome to TAILS</Text>
          <Text style={styles.subtitle}>Your personalized dashboard</Text>

          {/* Statistics Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="airplane" size={width * 0.08} color="#ffffff" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Flights completed</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="location" size={width * 0.08} color="#ffffff" />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>GPS points collected</Text>
            </View>
          </View>

          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.recentActivity}>
            <View style={styles.activityRow}>
              <Ionicons name="calendar" size={18} color="#fff" style={styles.activityIcon} />
              <Text style={styles.activityItem}>Last flight: January 25, 2025</Text>
            </View>
            <View style={styles.activityRow}>
              <Ionicons name="time" size={18} color="#fff" style={styles.activityIcon} />
              <Text style={styles.activityItem}>Last login: January 29, 2025</Text>
            </View>
          </View>

          {/* Button to navigate to tabbed page */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="folder" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>Access Features</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.04,
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
    backgroundColor: 'rgba(42, 42, 91, 0.7)',
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
    backgroundColor: 'rgba(42, 42, 91, 0.7)',
    padding: height * 0.025,
    borderRadius: width * 0.03,
    marginBottom: height * 0.03,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  activityIcon: {
    marginRight: width * 0.02,
  },
  activityItem: {
    fontSize: width * 0.045,
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginLeft: width * 0.02,
  },
});