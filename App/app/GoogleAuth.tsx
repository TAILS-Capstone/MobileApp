import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import TechBackground from '@/components/ui/TechBackground';
import CirclePattern from '@/components/ui/CirclePattern';

const GoogleAuthScreen = () => {
  const router = useRouter();
  const { loginWithGoogle, isLoading, error, isAuthenticated } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  // Check if user gets authenticated after Google Sign-In attempt
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

  const handleGoogleSignIn = async () => {
    try {
      setLocalLoading(true);
      await loginWithGoogle();
    } catch (error) {
      // The useAuth hook will handle error state
      console.error('Google Sign-In failed:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleOtherLogin = (route: string) => {
    // Use the type-safe version
    if (route === '/loginPage') {
      router.push('/loginPage');
    } else if (route === '/PhoneAuth') {
      router.push('/PhoneAuth');
    } else if (route === '/AnonymousAuth') {
      router.push('/AnonymousAuth');
    } else if (route === '/SignUp') {
      router.push('/SignUp');
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Background elements */}
      <TechBackground />
      <CirclePattern size={400} position={{ top: -200, right: -180 }} opacity={0.08} />
      <CirclePattern size={320} position={{ bottom: -160, left: -140 }} color="#1E90FF" opacity={0.06} />
      
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>TAILS</Text>
          <Text style={styles.tagline}>Sign in to continue</Text>
        </View>

        <View style={styles.authContainer}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading || localLoading}
          >
            {isLoading || localLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={styles.authButton}
            onPress={() => handleOtherLogin('/loginPage')}
          >
            <Ionicons name="mail-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sign in with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.authButton}
            onPress={() => handleOtherLogin('/PhoneAuth')}
          >
            <Ionicons name="call-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sign in with Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.authButton, styles.anonymousButton]}
            onPress={() => handleOtherLogin('/AnonymousAuth')}
          >
            <Ionicons name="person-outline" size={20} color="#1a1a3b" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.anonymousText]}>Continue Anonymously</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => handleOtherLogin('/SignUp')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1a1a3b',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: '15%',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  authContainer: {
    width: '100%',
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 14,
    width: '90%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    backdropFilter: 'blur(5px)',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#ccc',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingVertical: 14,
    width: '90%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    backdropFilter: 'blur(5px)',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  anonymousButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    borderColor: 'rgba(26, 26, 59, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
  },
  anonymousText: {
    color: '#1a1a3b',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '8%',
  },
  footerText: {
    color: '#ccc',
    fontSize: 15,
  },
  signupLink: {
    color: '#3a82ff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
});

export default GoogleAuthScreen; 