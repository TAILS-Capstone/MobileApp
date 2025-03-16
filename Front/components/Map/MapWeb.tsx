import React from 'react';
import { StyleSheet } from 'react-native';
import { MapProps } from './types';

export default function MapWeb({}: MapProps) {
  return (
    <div style={styles.container}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d179638.90219851927!2d-75.84864771337487!3d45.34992840169192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce05b25f5113af%3A0x8a6a51e131dd15ed!2sOttawa%2C%20ON!5e0!3m2!1sen!2sca!4v1706303693317!5m2!1sen!2sca"
        style={styles.map}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '90vw',
    height: '50vh',
    border: 'none',
    borderRadius: '10px',
  }
};