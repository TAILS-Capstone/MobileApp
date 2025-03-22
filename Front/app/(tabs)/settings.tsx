import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

// Use drone image as background
const backgroundImage = require('@/assets/images/drone.png');

const { width, height } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Logout handling
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => {
            if (logout) {
              logout();
            }
            router.push('/loginPage');
          } 
        },
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
      'T.A.I.L.S v1.0\nTactical Aerial Insight and Localization Suite\nDeveloped by Mouad and Maureen.',
      [{ text: 'OK' }]
    );
  };

  // Settings sections
  const settingsSections = [
    {
      title: 'Account',
      icon: 'person-circle' as any,
      color: '#4a90e2',
      items: [
        { label: 'Profile', icon: 'person' as any, onPress: () => Alert.alert('Profile', 'Profile settings will be available soon.') },
        { label: 'Notifications', icon: 'notifications' as any, onPress: () => Alert.alert('Notifications', 'Notification settings will be available soon.') },
        { label: 'Privacy', icon: 'lock-closed' as any, onPress: () => Alert.alert('Privacy', 'Privacy settings will be available soon.') },
      ]
    },
    {
      title: 'Application',
      icon: 'settings' as any,
      color: '#50c356',
      items: [
        { label: 'Appearance', icon: 'color-palette' as any, onPress: () => Alert.alert('Appearance', 'Appearance settings will be available soon.') },
        { label: 'Flight Parameters', icon: 'airplane' as any, onPress: () => Alert.alert('Flight Parameters', 'Flight parameter settings will be available soon.') },
        { label: 'Map Settings', icon: 'map' as any, onPress: () => Alert.alert('Map Settings', 'Map settings will be available soon.') },
        { label: 'Check Permissions', icon: 'shield-checkmark' as any, onPress: handlePermissions },
      ]
    },
    {
      title: 'Support',
      icon: 'help-circle' as any,
      color: '#e6a919',
      items: [
        { label: 'Help Center', icon: 'help' as any, onPress: () => Alert.alert('Help', 'Help center will be available soon.') },
        { label: 'About T.A.I.L.S', icon: 'information-circle' as any, onPress: handleAbout },
        { label: 'Log Out', icon: 'log-out' as any, onPress: handleLogout, isDestructive: true },
      ]
    },
  ];

  return (
    <AnimatedBackground 
      backgroundImage={backgroundImage}
      overlayColors={['rgba(13, 13, 33, 0.4)', 'rgba(15, 15, 45, 0.3)', 'rgba(17, 17, 55, 0.3)']}
      enableRotation={true}
      enableVerticalMovement={true}
      showCirclePatterns={true}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Configure your application</Text>
        </View>
        
        <View style={styles.profileCard}>
          <Ionicons name="person-circle" size={60} color="#fff" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName || 'Pilot'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@tails.com'}</Text>
          </View>
        </View>

        {settingsSections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon as any} size={24} color={section.color} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex} 
                style={[
                  styles.settingItem,
                  item.isDestructive && styles.destructiveItem
                ]}
                onPress={item.onPress}
              >
                <View style={styles.settingItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: item.isDestructive ? 'rgba(255, 77, 77, 0.2)' : `${section.color}20` }]}>
                    <Ionicons 
                      name={item.icon as any} 
                      size={20} 
                      color={item.isDestructive ? '#ff4d4d' : section.color} 
                    />
                  </View>
                  <Text style={[styles.settingItemText, item.isDestructive && styles.destructiveText]}>
                    {item.label}
                  </Text>
                </View>
                <Ionicons name={"chevron-forward" as any} size={20} color={item.isDestructive ? '#ff4d4d' : '#8a8a97'} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a3b',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -2,
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
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.1,
  },
  headerContainer: {
    marginTop: height * 0.07,
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#d1d1d1',
    marginTop: 5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 42, 91, 0.8)',
    borderRadius: width * 0.04,
    padding: width * 0.04,
    marginVertical: height * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  profileInfo: {
    marginLeft: width * 0.04,
    flex: 1,
  },
  profileName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileEmail: {
    fontSize: width * 0.035,
    color: '#d1d1d1',
    marginTop: 4,
  },
  sectionContainer: {
    marginVertical: height * 0.015,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  sectionTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: width * 0.02,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(42, 42, 91, 0.7)',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    marginBottom: height * 0.01,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  destructiveItem: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    borderColor: 'rgba(255, 77, 77, 0.2)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  settingItemText: {
    fontSize: width * 0.04,
    color: '#fff',
  },
  destructiveText: {
    color: '#ff4d4d',
  },
  versionText: {
    fontSize: width * 0.035,
    color: '#8a8a97',
    textAlign: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  }
});