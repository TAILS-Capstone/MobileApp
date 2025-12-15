import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import TechBackground from '@/components/ui/TechBackground';
import CirclePattern from '@/components/ui/CirclePattern';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const validateEmail = (email: string) => {
    // Trim the email to remove leading/trailing whitespace
    const trimmedEmail = email.trim();
    
    // Check if email is empty
    if (!trimmedEmail) {
      return { isValid: false, reason: 'Email cannot be empty' };
    }
    
    // Basic RFC 5322 compliant regex that catches most invalid emails
    // This checks for proper format with username, @ symbol, domain, and TLD
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return { isValid: false, reason: 'Invalid email format' };
    }
    
    // Additional specific validations
    
    // Check email length (most mail servers won't accept emails > 254 chars)
    if (trimmedEmail.length > 254) {
      return { isValid: false, reason: 'Email is too long' };
    }
    
    // Check local part length (before the @)
    const localPart = trimmedEmail.split('@')[0];
    if (localPart.length > 64) {
      return { isValid: false, reason: 'Username part of email is too long' };
    }
    
    // Check for consecutive dots which are invalid
    if (/\.{2,}/.test(trimmedEmail)) {
      return { isValid: false, reason: 'Email cannot contain consecutive dots' };
    }
    
    // Valid email
    return { isValid: true, reason: '' };
  };
  
  const handleSubmit = async () => {
    // Reset error message
    setEmailError('');
    
    let isValid = true;
    
    // Use the validateEmail function correctly
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.reason || 'Please enter a valid email address');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      try {
        // Call the actual Firebase resetPassword function
        await resetPassword(email.trim());
        setSubmitted(true);
        Alert.alert(
          'Reset Email Sent',
          'Check your email for instructions to reset your password',
          [{ text: 'OK', onPress: () => router.push('/loginPage') }]
        );
      } catch (error: any) {
        Alert.alert(
          'Error',
          error.message || 'Failed to send reset email. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLoginRedirect = () => {
    router.push('/loginPage');
  };

  return (
    <View style={styles.mainContainer}>
      {/* Tech-themed background elements */}
      <TechBackground intensity={0.8} />
      <CirclePattern size={350} position={{ top: -150, right: -150 }} opacity={0.07} />
      <CirclePattern size={280} position={{ bottom: -120, left: -100 }} color="#1E90FF" opacity={0.05} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={width * 0.07} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading && !submitted}
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TouchableOpacity 
            style={[styles.submitButton, (isLoading || submitted) && styles.disabledButton]} 
            onPress={handleSubmit} 
            activeOpacity={0.7}
            disabled={isLoading || submitted}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {submitted ? 'Email Sent' : 'Send Reset Link'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLoginRedirect} disabled={isLoading}>
            <Text style={styles.loginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1a1a3b',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  title: {
    fontSize: Math.max(width * 0.08, 28),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.015,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: Math.max(width * 0.04, 15),
    color: '#ddd',
    textAlign: 'center',
    marginBottom: height * 0.04,
    paddingHorizontal: width * 0.05,
    lineHeight: Math.max(width * 0.055, 22),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: width * 0.04,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.04,
    width: '90%',
    height: height * 0.07,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    backdropFilter: 'blur(5px)',
  },
  icon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: Math.max(width * 0.045, 16),
    paddingVertical: 10,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: Math.max(width * 0.035, 12),
    alignSelf: 'flex-start',
    marginLeft: width * 0.08,
    marginBottom: height * 0.015,
    marginTop: -5,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: 'rgba(30, 144, 255, 0.5)',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: Math.max(width * 0.045, 16),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginText: {
    color: '#fff',
    fontSize: Math.max(width * 0.04, 14),
    textDecorationLine: 'underline',
    fontWeight: '500',
    marginTop: height * 0.01,
  },
});

export default ForgotPasswordScreen;