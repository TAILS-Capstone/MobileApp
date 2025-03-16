import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
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
    return { isValid: true };
  };
  
  const handleSubmit = () => {
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
      // In a real app, this would call an API to send a reset link
      setSubmitted(true);
      // Simulating API call
      setTimeout(() => {
        Alert.alert(
          'Reset Email Sent',
          'Check your email for instructions to reset your password',
          [{ text: 'OK', onPress: () => router.push('/login') }]
        );
      }, 1500);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/loginPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your password
      </Text>

      {!submitted ? (
        <>
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
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleSubmit} 
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.submittedContainer}>
          <Ionicons name="checkmark-circle" size={width * 0.15} color="#4BB543" />
          <Text style={styles.submittedText}>Email sent!</Text>
          <Text style={styles.submittedSubtext}>
            If an account exists with this email, you'll receive instructions to reset your password.
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={handleLoginRedirect} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a3b', // Dark blue background
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: Math.max(width * 0.08, 26),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: Math.max(width * 0.04, 14),
    color: '#ccc',
    textAlign: 'center',
    marginBottom: height * 0.04,
    paddingHorizontal: width * 0.05,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: width * 0.04,
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.04,
    width: '90%',
    height: height * 0.07,
  },
  icon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: Math.max(width * 0.045, 14),
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: Math.max(width * 0.035, 12),
    alignSelf: 'flex-start',
    marginLeft: width * 0.08,
    marginBottom: height * 0.01,
    marginTop: -5,
  },
  resetButton: {
    backgroundColor: '#1E90FF',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    marginVertical: height * 0.03,
    alignItems: 'center',
    width: '90%',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: Math.max(width * 0.045, 16),
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: height * 0.02,
  },
  backButtonText: {
    color: '#fff',
    fontSize: Math.max(width * 0.04, 14),
    textDecorationLine: 'underline',
  },
  submittedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.04,
  },
  submittedText: {
    color: '#fff',
    fontSize: Math.max(width * 0.06, 20),
    fontWeight: 'bold',
    marginTop: height * 0.02,
  },
  submittedSubtext: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
    fontSize: Math.max(width * 0.04, 14),
  },
});

export default ForgotPasswordScreen;