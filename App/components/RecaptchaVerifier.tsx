import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { auth } from '@/config/firebase';

interface RecaptchaVerifierProps {
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  style?: object;
}

const RecaptchaVerifier: React.FC<RecaptchaVerifierProps> = ({
  onVerify,
  onError,
  onLoad,
  style,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [loaded, setLoaded] = useState(false);

  // The HTML that contains the reCAPTCHA widget
  const recaptchaHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>reCAPTCHA</title>
        <script src="https://www.google.com/recaptcha/api.js"></script>
        <script>
          // Function to handle token received from reCAPTCHA widget
          function onRecaptchaVerify(token) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'verify', token }));
          }

          // Function to handle expiration of reCAPTCHA token
          function onRecaptchaExpired() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'expired' }));
          }

          // Function to handle errors with reCAPTCHA widget
          function onRecaptchaError() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'reCAPTCHA error' }));
          }

          // Function to notify that the page is loaded
          function onPageLoad() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'load' }));
          }
        </script>
      </head>
      <body onload="onPageLoad()">
        <div id="recaptcha-container" style="display: flex; justify-content: center; margin-top: 20px;">
          <div class="g-recaptcha" 
            data-sitekey="${auth.app.options.apiKey ? auth.app.options.apiKey.substring(0, 40) : 'YOUR_RECAPTCHA_SITE_KEY'}"
            data-callback="onRecaptchaVerify"
            data-expired-callback="onRecaptchaExpired"
            data-error-callback="onRecaptchaError">
          </div>
        </div>
      </body>
    </html>
  `;

  // Handle messages from the WebView
  const handleMessage = (event: any) => {
    try {
      const { data } = event.nativeEvent;
      const parsedData = JSON.parse(data);

      switch (parsedData.type) {
        case 'verify':
          onVerify(parsedData.token);
          break;
        case 'expired':
          // Reset the reCAPTCHA widget
          webViewRef.current?.reload();
          break;
        case 'error':
          onError && onError(new Error(parsedData.message));
          break;
        case 'load':
          setLoaded(true);
          onLoad && onLoad();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
      onError && onError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Render the WebView with the reCAPTCHA widget
  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: recaptchaHtml }}
        onMessage={handleMessage}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  webView: {
    flex: 1,
  },
});

export default RecaptchaVerifier; 