import React from 'react';
import { Platform } from 'react-native';
import MapWeb from './MapWeb';

const Map = (props) => {
  if (Platform.OS === 'web') {
    return <MapWeb {...props} />;
  }
  
  
};

export default Map;