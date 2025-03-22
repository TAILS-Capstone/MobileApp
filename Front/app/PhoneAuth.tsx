import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import RecaptchaVerifier from '@/components/RecaptchaVerifier';
import TechBackground from '@/components/ui/TechBackground';
import CirclePattern from '@/components/ui/CirclePattern';

const PhoneAuthScreen = () => {
  const router = useRouter();
  const { loginWithPhone, confirmPhoneCode } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  // Handle phone number format validation
  const validatePhoneNumber = (phone: string) => {
    // Basic phone number validation (international format with + symbol)
    // This is a simple validation, adjust according to your requirements
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  // Handle send verification code
  const handleSendCode = async () => {
    setPhoneError('');
    
    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }
    
    if (!recaptchaToken) {
      Alert.alert('Verification Required', 'Please complete the reCAPTCHA verification');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a custom RecaptchaVerifier using our token
      const appVerifier = {
        type: 'recaptcha',
        verify: () => Promise.resolve(recaptchaToken),
      };
      
      // Send the verification code
      const result = await loginWithPhone(phoneNumber, appVerifier);
      
      // Store the verification ID
      setVerificationId(result.verificationId);
      setIsCodeSent(true);
      Alert.alert('Success', 'Verification code sent successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send verification code';
      setPhoneError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async () => {
    setCodeError('');
    
    if (!verificationCode) {
      setCodeError('Verification code is required');
      return;
    }
    
    if (!/^\d{6}$/.test(verificationCode)) {
      setCodeError('Please enter a valid 6-digit code');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Confirm the verification code
      await confirmPhoneCode(verificationId, verificationCode);
      
      // Navigate to the main app on successful authentication
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to verify code';
      setCodeError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background elements */}
      <TechBackground />
      <CirclePattern size={350} position={{ top: -150, right: -150 }} />
      <CirclePattern size={280} position={{ bottom: -100, left: -120 }} color="#1E90FF" opacity={0.07} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formContainer}
        >
          <Text style={styles.title}>Phone Authentication</Text>
          <Text style={styles.subtitle}>
            {isCodeSent
              ? 'Enter the verification code sent to your phone'
              : 'Verify your phone number to continue'}
          </Text>
          
          {!isCodeSent ? (
            // Phone Number Input Section
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={24} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number (e.g., +1234567890)"
                  placeholderTextColor="#ccc"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setPhoneError('');
                  }}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              
              <Text style={styles.recaptchaLabel}>Complete reCAPTCHA verification:</Text>
              <RecaptchaVerifier
                onVerify={(token) => setRecaptchaToken(token)}
                onError={(error) => {
                  console.error('reCAPTCHA Error:', error);
                  Alert.alert('Error', 'Failed to load reCAPTCHA. Please try again.');
                }}
                style={styles.recaptcha}
              />
              
              <TouchableOpacity 
                style={styles.button}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send Verification Code</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            // Verification Code Input Section
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="keypad-outline" size={24} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="6-digit verification code"
                  placeholderTextColor="#ccc"
                  value={verificationCode}
                  onChangeText={(text) => {
                    setVerificationCode(text);
                    setCodeError('');
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  editable={!isLoading}
                />
              </View>
              {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}
              
              <TouchableOpacity 
                style={styles.button}
                onPress={handleVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify Code</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  setIsCodeSent(false);
                  setVerificationCode('');
                  setVerificationId('');
                  setRecaptchaToken('');
                }}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonText}>Back to Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => router.push('/loginPage')}
            disabled={isLoading}
          >
            <Text style={styles.navigationButtonText}>Login with Email & Password</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a3b',  // Base color stays the same
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 16,
    width: '90%',
    height: 56,
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
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 15,
    fontWeight: '500',
  },
  recaptchaLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  recaptcha: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    paddingVertical: 16,
    width: '90%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(30, 144, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderRadius: 12,
    paddingVertical: 14,
    width: '90%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: '500',
  },
  navigationButton: {
    marginTop: 24,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default PhoneAuthScreen; 