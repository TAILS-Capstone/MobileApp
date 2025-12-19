# TAILS Mobile App

Mobile applications for the **TAILS** capstone project.

This repository contains **two separate mobile projects**:
- **`MobileApp-ExpoGo-UI/`** : Expo / React Native UI app
- **`MobileApp-AndroidStudio-BLE/`** : Native Android BLE app (plus ESP32 test server sample)

---

## Repository Structure

```text
MobileApp/
├── MobileApp-ExpoGo-UI/            # Expo (React Native) UI app
├── MobileApp-AndroidStudio-BLE/    # Android Studio BLE app
└── docs/
    └── images/                     # Screenshots used in this README
```

---

## Tech Stack

### `MobileApp-ExpoGo-UI` (Expo UI)
- Expo / React Native
- `expo-linear-gradient`

### `MobileApp-AndroidStudio-BLE` (Android BLE)
- Native Android
- Bluetooth Low Energy (BLE)
- Google Maps SDK

---

## Screenshots

<table>
  <tr>
    <td width="50%" align="center">
      <strong>Login</strong><br/>
      <img src="docs/images/login.png" alt="Login screen" width="320"/>
    </td>
    <td width="50%" align="center">
      <strong>Create Account</strong><br/>
      <img src="docs/images/create-account.png" alt="Create account screen" width="320"/>
    </td>
  </tr>

  <tr>
    <td width="50%" align="center">
      <strong>Home (iOS)</strong><br/>
      <img src="docs/images/home-ios.png" alt="Home screen on iOS" width="320"/>
    </td>
    <td width="50%" align="center">
      <strong>Home (Android)</strong><br/>
      <img
        src="docs/images/home-android-device.jpg"
        alt="Home screen on Android device"
        width="320"
        style="max-height: 640px; object-fit: contain;"
      />
    </td>
  </tr>

  <tr>
    <td width="50%" align="center">
      <strong>History</strong><br/>
      <img src="docs/images/history.png" alt="History screen" width="320"/>
    </td>
    <td width="50%" align="center">
      <strong>Settings</strong><br/>
      <img src="docs/images/settings.png" alt="Settings screen" width="320"/>
    </td>
  </tr>
</table>

<br/>

<div align="center">
  <strong>Map / POI</strong><br/>
  <img src="docs/images/Map_POI.jpg" alt="Map / POI screen" width="700"/>
</div>

---

## Getting Started

### Expo UI App (`MobileApp-ExpoGo-UI/`)

```bash
cd MobileApp-ExpoGo-UI
npm install
npx expo start
```

### Android BLE App (`MobileApp-AndroidStudio-BLE/`)

1. Open `MobileApp-AndroidStudio-BLE/` in Android Studio
2. Sync Gradle
3. Build & run on an Android device

---

## License

MIT License. See `LICENSE`.
