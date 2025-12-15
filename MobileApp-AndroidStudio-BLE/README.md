# Drone BLE - Minimal Bluetooth App

A minimal Android Bluetooth Low Energy (BLE) app with a drone-inspired, techy black and white UI.

## Features

- **Minimal Design**: Clean black and white interface
- **Drone-Inspired UI**: Techy aesthetic with grid patterns and corner brackets
- **Connect/Disconnect**: Simple button controls
- **Loading Animation**: Minimal progress indicator during scanning
- **Status Indicator**: Visual feedback for connection state

## Setup

1. Open the project in Android Studio
2. Sync Gradle files
3. Build and run on an Android device (API 26+)

## Permissions

The app requires Bluetooth permissions which will be requested at runtime:
- BLUETOOTH_SCAN (Android 12+)
- BLUETOOTH_CONNECT (Android 12+)
- ACCESS_FINE_LOCATION (Android 11 and below)

## Usage

1. Tap **CONNECT** to start scanning for BLE devices
2. The app will automatically connect to the first device found
3. Tap **DISCONNECT** to disconnect from the device

## Customization

To modify the connection logic, edit the `connectToDevice()` method in `MainActivity.java`.

