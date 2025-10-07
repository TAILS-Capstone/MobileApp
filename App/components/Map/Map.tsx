import React from 'react';
import { Platform } from 'react-native';

import type { MapProps } from './types';
import MapNative from './Map.native';
import MapWeb from './Map.web';

const Map: React.FC<MapProps> = props => {
  if (Platform.OS === 'web') {
    return <MapWeb {...props} />;
  }

  return <MapNative {...props} />;
};

export default Map;