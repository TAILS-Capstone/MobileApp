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

const SignupScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { registerWithEmail } = useAuth();
  
  const validateUsername = (username: string) => {
    // Trim the username to remove leading/trailing whitespace
    const trimmedUsername = username.trim();
    
    // Check if username is empty
    if (!trimmedUsername) {
      return { isValid: false, reason: 'Username cannot be empty' };
    }
    
    // Check minimum length (commonly 3-4 characters)
    if (trimmedUsername.length < 3) {
      return { isValid: false, reason: 'Username must be at least 3 characters' };
    }
    
    // Check maximum length (commonly 20-30 characters)
    if (trimmedUsername.length > 30) {
      return { isValid: false, reason: 'Username cannot exceed 30 characters' };
    }
    
    // Check for valid characters (alphanumeric, underscores, hyphens)
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return { isValid: false, reason: 'Username can only contain letters, numbers, underscores, hyphens, and periods' };
    }
    
    // Check that username doesn't start with a number, underscore, or special character
    if (/^[^a-zA-Z]/.test(trimmedUsername)) {
      return { isValid: false, reason: 'Username must start with a letter' };
    }
    
    // Check for consecutive special characters
    if (/[._-]{2,}/.test(trimmedUsername)) {
      return { isValid: false, reason: 'Username cannot contain consecutive special characters' };
    }
    
    // Valid username
    return { isValid: true, reason: '' };
  };
  
  const validateEmail = (email: string) => {
    // Trim the email to remove leading/trailing whitespace
    const trimmedEmail = email.trim();
    
    // Check if email is empty
    if (!trimmedEmail) {
      return { isValid: false, reason: 'Email cannot be empty' };
    }
    
    // Basic RFC 5322 compliant regex that catches most invalid emails
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
  
  const validatePassword = (password: string) => {
    // Check for minimum length (NIST recommends at least 8 characters)
    const hasMinLength = password.length >= 8;
    
    // Check for at least one uppercase letter
    const hasUpperCase = /[A-Z]/.test(password);
    
    // Check for at least one lowercase letter
    const hasLowerCase = /[a-z]/.test(password);
    
    // Check for at least one digit
    const hasDigit = /[0-9]/.test(password);
    
    // Check for at least one special character
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Ensure password doesn't contain common patterns
    const hasNoCommonPatterns = !/(123456|password|qwerty|admin)/i.test(password);
    
    // Return detailed validation results or a simple boolean
    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && hasNoCommonPatterns,
      requirements: {
        hasMinLength,
        hasUpperCase,
        hasLowerCase,
        hasDigit,
        hasSpecialChar,
        hasNoCommonPatterns
      }
    };
  };
  
  const getPasswordErrorMessage = (validationResult: ReturnType<typeof validatePassword>): string => {
    const { requirements } = validationResult;
    
    if (!requirements.hasMinLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!requirements.hasUpperCase) {
      return 'Password must include at least one uppercase letter';
    }
    if (!requirements.hasLowerCase) {
      return 'Password must include at least one lowercase letter';
    }
    if (!requirements.hasDigit) {
      return 'Password must include at least one number';
    }
    if (!requirements.hasSpecialChar) {
      return 'Password must include at least one special character';
    }
    if (!requirements.hasNoCommonPatterns) {
      return 'Password contains common patterns that are easily guessed';
    }
    
    return 'Password does not meet security requirements';
  };
  
  const handleSignup = async () => {
    // Reset error messages
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    let isValid = true;
    
    // Username validation
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        setUsernameError(usernameValidation.reason);
        isValid = false;
      }
    }
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.reason);
        isValid = false;
      }
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordError(getPasswordErrorMessage(passwordValidation));
        isValid = false;
      }
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      try {
        // Call registerWithEmail function from AuthContext
        await registerWithEmail(email.trim(), password, username);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.push('/loginPage') }
        ]);
      } catch (error: any) {
        setIsLoading(false);
        
        // Handle specific Firebase errors
        const errorMessage = error.message || 'Failed to create account';
        
        if (errorMessage.includes('email-already-in-use')) {
          setEmailError('This email is already registered. Please use a different email or try logging in.');
        } else if (errorMessage.includes('invalid-email')) {
          setEmailError('Invalid email format. Please check your email and try again.');
        } else if (errorMessage.includes('weak-password')) {
          setPasswordError('Password is too weak. Please choose a stronger password.');
        } else {
          // For any other error, show an alert but stay on the signup page
          Alert.alert('Registration Error', errorMessage);
        }
      }
    }
  };

  const handleLoginRedirect = () => {
    router.push('/loginPage');
  };

  return (
    <View style={styles.mainContainer}>
      {/* Tech-themed background elements */}
      <TechBackground />
      <CirclePattern size={400} position={{ top: -180, right: -180 }} opacity={0.07} />
      <CirclePattern size={320} position={{ bottom: -150, left: -130 }} color="#1E90FF" opacity={0.05} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={width * 0.07} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setUsernameError('');
              }}
              autoCapitalize="none"
            />
          </View>
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

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

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={width * 0.07} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
            />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={width * 0.07} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
              }}
            />
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} activeOpacity={0.7} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLoginRedirect}>
            <Text style={styles.loginText}>Already Have an Account? Log In</Text>
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
    marginBottom: height * 0.04,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  signupButton: {
    backgroundColor: '#1E90FF',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.3,
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
  signupButtonText: {
    color: '#fff',
    fontSize: Math.max(width * 0.045, 16),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginText: {
    color: '#fff',
    fontSize: Math.max(width * 0.04, 14),
    textAlign: 'center',
    marginTop: height * 0.02,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default SignupScreen;