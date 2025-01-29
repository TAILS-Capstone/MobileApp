import React from 'react';
import {View, Text , StyleSheet } from 'react-native';

export default function HistoryScreen() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Historique</Text>
        <Text style={styles.subtitle}>Voici l'historique des vols</Text>
      </View>
    );  
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#333',
    },
});