import React from 'react';
import { MapProps } from './types';
import PlatformMap from './Map'; // React Native will automatically choose the right platform-specific file

const Map: React.FC<MapProps> = (props) => {
  return <PlatformMap {...props} />;
};

export default Map;