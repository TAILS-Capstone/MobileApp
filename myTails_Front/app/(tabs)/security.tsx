import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const SecurityScreen = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/loginPage');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Security Settings</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{ 
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white' }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SecurityScreen;