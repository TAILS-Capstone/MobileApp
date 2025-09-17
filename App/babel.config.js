module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated v4 moved the Babel plugin to react-native-worklets
      'react-native-worklets/plugin',
    ],
  };
};