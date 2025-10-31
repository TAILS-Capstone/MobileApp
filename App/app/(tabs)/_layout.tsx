import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const isMounted = useRef(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Check authentication status and update redirect state
  useEffect(() => {
    if (isMounted.current && !isLoading && !isAuthenticated) {
      // Only set redirect after component is mounted and auth is checked
      setShouldRedirect(true);
    }
  }, [isAuthenticated, isLoading]);

  // Render redirect if needed
  if (shouldRedirect) {
    return <Redirect href="/loginPage" />;
  }

  // Show tabs for authenticated users or while still checking auth
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            backgroundColor: 'rgba(26, 26, 59, 0.9)',
            height: 85,
            paddingBottom: 10
          },
          default: {
            backgroundColor: '#1a1a3b',
            borderTopWidth: 0,
            elevation: 8,
            height: 65,
            paddingBottom: 5
          },
        }),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 5 : 0,
        }
      }}>
      {/* Onglet Accueil */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <Ionicons name="home" size={28} color={focused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />,
        }}
      />
      
      {/* Onglet Explore */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => <Ionicons name="paper-plane" size={28} color={focused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />,
        }}
      />

      {/* Onglet Map */}
      <Tabs.Screen
        name="map"
        options={{
          title: 'Carte',
          tabBarIcon: ({ focused }) => <Ionicons name="map" size={28} color={focused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />,
        }}
      />

      {/* Onglet Bluetooth */}
       <Tabs.Screen
        name="BluetoothScreen"
        options={{
          title: 'Bluetooth',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="bluetooth"
              size={28}
              color={focused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'}
            />
          ),
        }}
      />

      {/* Onglet Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <Ionicons name="stats-chart" size={28} color={focused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />,
        }}
      />
      
      {/* Onglet History */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <Ionicons name="time" size={28} color={focused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />,
        }}
      />
      
      {/* Onglet Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <Ionicons name="settings" size={28} color={focused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} />,
        }}
      />
    </Tabs>
  );
}