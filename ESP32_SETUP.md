# ESP32 Setup Instructions

## Arduino IDE Setup

### 1. Install ESP32 Board Support
1. Open Arduino IDE
2. Go to **File → Preferences**
3. In "Additional Board Manager URLs", add:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Click **OK**
5. Go to **Tools → Board → Boards Manager**
6. Search for "ESP32"
7. Install "esp32 by Espressif Systems"
8. Wait for installation to complete

### 2. Select Your ESP32 Board
1. Go to **Tools → Board → ESP32 Arduino**
2. Select your board model (common ones):
   - **ESP32 Dev Module** (most common)
   - **ESP32-WROOM-DA Module**
   - **NodeMCU-32S**
   - Or your specific board model

### 3. Configure Board Settings
- **Upload Speed**: 115200 (or 921600 for faster)
- **CPU Frequency**: 240MHz (WiFi/BT)
- **Flash Frequency**: 80MHz
- **Flash Mode**: QIO
- **Flash Size**: 4MB (or match your board)
- **Partition Scheme**: Default 4MB with spiffs
- **Core Debug Level**: None
- **PSRAM**: Disabled (unless your board has PSRAM)

### 4. Install Required Library
The ESP32 BLE library is built-in, no installation needed!

### 5. Upload the Code
1. Open `esp32_ble_server.ino` in Arduino IDE
2. Connect ESP32 to your computer via USB
3. Select the COM port: **Tools → Port → (your ESP32 port)**
   - Windows: Usually COM3, COM4, etc.
   - Mac/Linux: Usually /dev/cu.usbserial-* or /dev/ttyUSB*
4. Click the **Upload** button (→) or press `Ctrl+U`
5. Wait for "Done uploading" message

### 6. Verify It's Working
1. Open **Serial Monitor**: Tools → Serial Monitor
2. Set baud rate to **115200** (bottom right)
3. Press the **RESET** button on your ESP32
4. You should see:
   ```
   Starting ESP32 BLE Server...
   Waiting for a client connection to notify...
   Device name: ESP32_Drone
   Service UUID: 4fafc201-1fb5-459e-8fcc-c5c9c331914b
   ```

## Testing Connection

### From Android App:
1. Make sure ESP32 is powered and Serial Monitor shows it's advertising
2. Open the Drone BLE app on your phone
3. Tap **CONNECT**
4. App will scan and find "ESP32_Drone"
5. Connection will be established
6. ESP32 Serial Monitor will show: **"Device connected!"**

### Troubleshooting ESP32

**Upload fails:**
- Hold **BOOT** button while clicking Upload, release after upload starts
- Try different USB cable (data cable, not charge-only)
- Check COM port is correct
- Lower upload speed to 115200

**No Serial output:**
- Check baud rate is 115200
- Press RESET button on ESP32
- Try different USB port
- Check drivers are installed (CH340 or CP2102)

**ESP32 not found by phone:**
- Make sure ESP32 is powered (LED should be on)
- Check Serial Monitor shows "Waiting for client..."
- Restart ESP32 (unplug/replug or press RESET)
- Make sure phone and ESP32 are close (< 10 meters)
- Try restarting phone Bluetooth

## Customization

### Change Device Name
In `esp32_ble_server.ino`, change:
```cpp
#define DEVICE_NAME "ESP32_Drone"
```
to your desired name.

### Change UUIDs
You can generate new UUIDs at: https://www.uuidgenerator.net/

Update in the code:
```cpp
#define SERVICE_UUID        "your-service-uuid-here"
#define CHARACTERISTIC_UUID "your-characteristic-uuid-here"
```

