import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import CirclePattern from '@/components/ui/CirclePattern';

// Use satellite image as background with direct path
const backgroundImage = require('../../assets/images/satellite_view.jpg');

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState({ temp: '23°C', condition: 'Clear', wind: '6 km/h' });
  const [flightStats, setFlightStats] = useState({ total: 12, recent: 3, upcoming: 2 });
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Flight Check Reminder', message: 'Pre-flight check for tomorrow', time: '2h ago' },
    { id: 2, title: 'Weather Alert', message: 'Strong winds expected', time: '6h ago' },
  ]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const formatDate = () => {
    const date = new Date();
    const options = { 
      weekday: 'long' as const, 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Morning';
    if (hours < 17) return 'Afternoon';
    return 'Evening';
  };

  return (
    <View style={styles.container}>
      {/* Static background */}
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.4)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </ImageBackground>
      
      {/* Circle patterns */}
      <CirclePattern size={400} position={{ top: -180, right: -180 }} opacity={0.08} />
      <CirclePattern size={320} position={{ bottom: -150, left: -130 }} color="#1E90FF" opacity={0.08} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        {/* Welcome Header */}
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTime}>Good {getTimeOfDay()}</Text>
            <Text style={styles.welcomeName}>{user?.displayName || 'Pilot'}</Text>
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Ionicons name="person-circle" size={50} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Weather Card */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Ionicons name="partly-sunny" size={30} color="#FFD700" />
            <Text style={styles.weatherTitle}>Flight Conditions</Text>
          </View>
          <View style={styles.weatherContent}>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherValue}>{weatherData.temp}</Text>
              <Text style={styles.weatherLabel}>Temperature</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherValue}>{weatherData.condition}</Text>
              <Text style={styles.weatherLabel}>Conditions</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherValue}>{weatherData.wind}</Text>
              <Text style={styles.weatherLabel}>Wind Speed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/map')}
            >
              <Ionicons name="map" size={24} color="#fff" />
              <Text style={styles.actionText}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Ionicons name="airplane" size={24} color="#fff" />
              <Text style={styles.actionText}>Start Flight</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/history')}
            >
              <Ionicons name="time" size={24} color="#fff" />
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <Ionicons name="settings" size={24} color="#fff" />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Flight Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Flight Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{flightStats.total}</Text>
              <Text style={styles.statLabel}>Total Flights</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{flightStats.recent}</Text>
              <Text style={styles.statLabel}>Last 30 Days</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{flightStats.upcoming}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.notificationsContainer}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {notifications.map(notification => (
            <View key={notification.id} style={styles.notificationItem}>
              <View style={styles.notificationIcon}>
                <Ionicons name="notifications" size={24} color="#ffffff" />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -2,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.1,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.02,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTime: {
    fontSize: width * 0.045,
    color: '#d1d1d1',
  },
  welcomeName: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dateText: {
    fontSize: width * 0.04,
    color: '#d1d1d1',
    marginTop: 4,
  },
  profileButton: {
    padding: 5,
  },
  weatherCard: {
    backgroundColor: 'rgba(42, 42, 91, 0.9)',
    borderRadius: width * 0.04,
    marginVertical: height * 0.02,
    padding: width * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  weatherTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: width * 0.02,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },
  weatherItem: {
    alignItems: 'center',
    flex: 1,
  },
  weatherValue: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherLabel: {
    fontSize: width * 0.035,
    color: '#d1d1d1',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.015,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  quickActionsContainer: {
    marginVertical: height * 0.02,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: 'rgba(30, 95, 163, 0.9)',
    borderRadius: width * 0.03,
    padding: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#3a84c9',
    height: height * 0.1,
  },
  actionText: {
    color: '#fff',
    fontSize: width * 0.035,
    marginTop: 8,
    fontWeight: '600',
  },
  statsContainer: {
    marginVertical: height * 0.02,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(42, 42, 91, 0.9)',
    borderRadius: width * 0.03,
    padding: width * 0.03,
    alignItems: 'center',
    width: '32%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: width * 0.03,
    color: '#d1d1d1',
    textAlign: 'center',
    marginTop: 5,
  },
  notificationsContainer: {
    marginVertical: height * 0.02,
  },
  notificationItem: {
    backgroundColor: 'rgba(42, 42, 91, 0.9)',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationIcon: {
    backgroundColor: 'rgba(30, 95, 163, 0.9)',
    borderRadius: 50,
    padding: 10,
    marginRight: width * 0.03,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationMessage: {
    fontSize: width * 0.035,
    color: '#d1d1d1',
  },
  notificationTime: {
    fontSize: width * 0.03,
    color: '#999',
    marginTop: 4,
  },
});