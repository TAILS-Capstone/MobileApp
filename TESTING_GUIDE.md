# Testing Guide - Drone BLE App

## Testing on Samsung Phone (USB Debugging)

### Step 1: Enable Developer Options on Samsung Phone
1. Go to **Settings** → **About phone**
2. Tap **Software information**
3. Tap **Build number** 7 times until you see "You are now a developer"

### Step 2: Enable USB Debugging
1. Go to **Settings** → **Developer options**
2. Enable **USB debugging**
3. Enable **Install via USB** (if available)
4. Connect your phone to laptop via USB cable
5. When prompted on phone, tap **Allow USB debugging** and check "Always allow from this computer"

### Step 3: Verify Connection
1. Open Android Studio
2. Open Terminal in Android Studio (or use command prompt)
3. Run: `adb devices`
4. You should see your device listed (e.g., "ABC123XYZ    device")

### Step 4: Build and Run
1. Open the project in Android Studio
2. Click **File** → **Sync Project with Gradle Files**
3. Wait for sync to complete
4. Click the green **Run** button (or press Shift+F10)
5. Select your Samsung device from the device list
6. Click **OK**

The app will install and launch on your phone!

## Testing with ESP32

### Current Status
The app currently auto-connects to the first BLE device found. To test with ESP32:

1. **Upload ESP32 BLE code** (see `esp32_ble_server.ino`)
2. **Power on ESP32** - it will start advertising as "ESP32_Drone"
3. **Open the app** on your Samsung phone
4. **Tap CONNECT** - it will scan and auto-connect to ESP32
5. **Status will show "CONNECTED"** when successful

### Troubleshooting

**App doesn't find ESP32:**
- Make sure ESP32 is powered on and code is uploaded
- Check ESP32 Serial Monitor to confirm it's advertising
- Try restarting Bluetooth on phone
- Make sure phone Bluetooth is enabled

**Permission errors:**
- Grant all requested permissions when app launches
- Go to Settings → Apps → Drone BLE → Permissions and enable all

**Connection fails:**
- ESP32 might need to be reset
- Try disconnecting and reconnecting
- Check ESP32 Serial Monitor for connection logs

