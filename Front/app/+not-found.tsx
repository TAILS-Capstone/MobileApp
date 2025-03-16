import { Link, Stack } from 'expo-router';
import { StyleSheet, Dimensions } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width, height } = Dimensions.get('window');

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          This screen doesn't exist.
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link" style={styles.linkText}>
            Go to home screen!
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05, // Responsive padding
  },
  title: {
    fontSize: width * 0.06, // Adjust title size based on screen width
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  link: {
    marginTop: height * 0.03,
    paddingVertical: height * 0.02,
  },
  linkText: {
    fontSize: width * 0.05, // Responsive font size
  },
});
