# Quick Start Guide

## Testing on Samsung Phone (5 minutes)

### 1. Enable USB Debugging
- Settings → About phone → Tap "Build number" 7 times
- Settings → Developer options → Enable "USB debugging"
- Connect phone to laptop via USB

### 2. Open in Android Studio
1. Open Android Studio
2. File → Open → Select the `BLE_test` folder
3. Wait for Gradle sync to complete

### 3. Run the App
1. Click the green **Run** button (▶️) or press `Shift+F10`
2. Select your Samsung device from the list
3. Click **OK**
4. App will install and launch automatically!

### 4. Test Bluetooth Scanning
- Tap **CONNECT** button
- App will scan for BLE devices
- You should see nearby Bluetooth devices being detected
- Status will show "CONNECTED" when a device is found

## Testing with ESP32

### Step 1: Upload ESP32 Code
1. Open Arduino IDE
2. Install ESP32 board support:
   - File → Preferences → Additional Board Manager URLs
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Boards Manager → Search "ESP32" → Install
3. Open `esp32_ble_server.ino`
4. Select your ESP32 board: Tools → Board → ESP32 Arduino → Your board model
5. Select COM port: Tools → Port → (your ESP32 port)
6. Click **Upload** button

### Step 2: Verify ESP32 is Advertising
1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud rate to 115200
3. You should see:
   ```
   Starting ESP32 BLE Server...
   Waiting for a client connection to notify...
   Device name: ESP32_Drone
   ```

### Step 3: Connect from Android App
1. Make sure ESP32 is powered on
2. Open the Drone BLE app on your Samsung phone
3. Tap **CONNECT**
4. App will scan and auto-connect to "ESP32_Drone"
5. Status indicator will show "CONNECTED"
6. ESP32 Serial Monitor will show: "Device connected!"

## Troubleshooting

**Phone not detected:**
- Run `adb devices` in terminal
- If empty, check USB cable and enable USB debugging again
- Try different USB port

**App crashes:**
- Check Android Studio Logcat for errors
- Make sure all permissions are granted
- Ensure phone Bluetooth is enabled

**ESP32 not found:**
- Check ESP32 Serial Monitor - is it advertising?
- Restart ESP32 (unplug/replug)
- Make sure ESP32 and phone are close together (< 10 meters)
- Try restarting phone Bluetooth

**Connection fails:**
- ESP32 might need a reset
- Check Serial Monitor for connection logs
- Try disconnecting and reconnecting

