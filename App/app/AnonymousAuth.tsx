import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const AnonymousAuthScreen = () => {
  const router = useRouter();
  const { loginAnonymously, error, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user gets authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  // Display error if login fails
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleAnonymousSignIn = async () => {
    try {
      setIsLoading(true);
      await loginAnonymously();
      // The useEffect hook will handle navigation when isAuthenticated changes
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to login anonymously');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    if (path === '/SignUp') {
      router.push('/SignUp');
    } else if (path === '/loginPage') {
      router.push('/loginPage');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="person-circle-outline" size={100} color="#1E90FF" style={styles.icon} />

        <Text style={styles.title}>Anonymous Access</Text>

        <Text style={styles.description}>
          Continue without creating an account. You'll have limited access to features, but you can always create an account later.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAnonymousSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Continue Anonymously</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.warningText}>
          Note: Your data won't be saved to your profile until you create an account.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Want to access all features?</Text>

        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigateTo('/SignUp')}
          >
            <Text style={styles.footerButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigateTo('/loginPage')}
          >
            <Text style={styles.footerButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#1a1a3b',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    paddingVertical: 16,
    width: '90%',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    width: '90%',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 8,
  },
  footerButtonText: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnonymousAuthScreen; 