import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import TechBackground from '@/components/ui/TechBackground';
import CirclePattern from '@/components/ui/CirclePattern';

/**
 * PrivateRoute component protects routes that require authentication
 * It automatically redirects unauthenticated users to the login page
 * 
 * Usage:
 * Wrap your protected component with PrivateRoute:
 * 
 * const ProtectedScreen = () => {
 *   return (
 *     <PrivateRoute>
 *       <YourComponent />
 *     </PrivateRoute>
 *   );
 * };
 */
export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const isMounted = useRef(false);

  useEffect(() => {
    // Mark component as mounted after the first render
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Skip protection check if still loading authentication state
    if (isLoading) return;

    // Check if we're on a protected route - only segments[0] === '(tabs)' is valid
    const inProtectedGroup = segments[0] === '(tabs)';

    // Only navigate if component is mounted and we need to redirect
    if (isMounted.current && !isAuthenticated && inProtectedGroup) {
      // Use a slight delay to ensure navigation happens after mount
      setTimeout(() => {
        if (isMounted.current) {
          router.replace('/loginPage');
        }
      }, 0);
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <TechBackground intensity={0.6} />
        <CirclePattern size={350} position={{ top: -150, right: -150 }} opacity={0.08} />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // If not in a protected route or authenticated, show children
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a3b',
  },
  loadingContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 