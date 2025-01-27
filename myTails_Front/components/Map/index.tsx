import { Platform } from 'react-native';
import { MapProps } from './types';

const Map = (Platform.select({
  native: () => require('./MapNative').default,
  web: () => require('./MapWeb').default,
}) ?? (() => undefined))() as React.ComponentType<MapProps>;

export default Map;
