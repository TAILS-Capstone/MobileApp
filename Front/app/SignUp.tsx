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
import { useAuth } from '@/contexts/AuthContext';

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

  const { signup } = useAuth();
  
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
    // This is a common pattern that allows letters, numbers, underscores, hyphens, and periods
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
    return { isValid: true };
  };
  
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
  
  const handleSignup = () => {
    // Reset error messages
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    let isValid = true;
    
    // Username validation with the enhanced function
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
    
    // Email validation with the enhanced function
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.reason || 'Invalid email');
      isValid = false;
    }
    
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
    
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (isValid) {
      // Call signup function from AuthContext with the required parameters
      signup({ username, email: email.trim(), password })
        .then(() => {
          Alert.alert('Success', 'Account created successfully!', [
            { text: 'OK', onPress: () => router.push('/loginPage') }
          ]);
        })
        .catch((error) => {
          Alert.alert('Error', error.message || 'Failed to create account');
        });
    }
  };

  const handleLoginRedirect = () => {
    router.push('/loginPage');
  };

  return (
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

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} activeOpacity={0.7}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLoginRedirect}>
        <Text style={styles.loginText}>Already Have an Account? Log In</Text>
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
    marginBottom: height * 0.03,
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
  signupButton: {
    backgroundColor: '#1E90FF',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.3,
    marginVertical: height * 0.03,
    alignItems: 'center',
    width: '90%',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: Math.max(width * 0.045, 16),
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
    fontSize: Math.max(width * 0.04, 14),
    textAlign: 'center',
    marginTop: height * 0.02,
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;