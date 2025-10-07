# BLE Integration Strategy for T.A.I.L.S

This document evaluates two approaches for integrating Bluetooth Low Energy (BLE) telemetry into the T.A.I.L.S mobile application and makes a recommendation based on the current Expo-managed workflow and available hardware (Samsung Galaxy J3).

## Option 1 – Follow Expo Development Build Guide

Daniel Friyia's Expo BLE tutorial demonstrates how to add BLE using the `react-native-ble-plx` library inside an Expo-managed workflow.

### Requirements
- Install `react-native-ble-plx` via `npx expo install react-native-ble-plx`.
- Add the plugin block to `app.json` so the native modules are configured during `expo prebuild`.
- Transition from Expo Go to a **custom development build** (created with `expo prebuild` + `eas build --profile development` or `npx expo run:[android|ios]`).
- Use a physical device for testing. BLE cannot be validated in web, simulators, or Expo Go.

### Pros
- Keeps the existing Expo Router/TypeScript project structure intact.
- Allows sharing codebases between iOS and Android without ejecting to bare React Native.
- The `react-native-ble-plx` API is mature, well-documented, and compatible with Expo dev builds.

### Cons / Risks
- Requires managing native dependencies after `expo prebuild`. Once prebuilt, future library additions must be compatible with config plugins.
- Demands developer comfort with running `eas build` or `npx expo run` for installing builds on devices.
- Samsung Galaxy J3 (2016/2017) runs Android 5.1–7.0; BLE support and permissions vary. `react-native-ble-plx` requires Android 5.0+, but background modes and Android 12 permission APIs will not apply on such older hardware.

## Option 2 – Convert Project to Native Android Studio Project

Moving to a fully native Android Studio (bare React Native or native Kotlin) project would involve ejecting the Expo app or rewriting screens.

### Pros
- Full control over Gradle configuration and native Bluetooth APIs without Expo constraints.
- Potentially easier access to very low-level Bluetooth features if needed beyond BLE.

### Cons / Risks
- Significant migration cost: lose Expo Router tooling, config plugins, OTA updates, and the cross-platform build pipeline.
- Requires rebuilding iOS support separately if needed.
- Managing native dependencies and build flavors manually.

## Recommendation
Stay within the Expo ecosystem and follow the BLE guide using a custom development build. This minimizes rewrite cost, keeps cross-platform parity, and leverages existing Expo configuration. The Samsung Galaxy J3 is adequate for initial testing so long as it runs at least Android 5.0 and BLE hardware is functioning; however, verify the device's Bluetooth Low Energy support and consider testing on a newer device to validate Android 12+ permission handling.

## Next Steps
1. Audit the project for `app.json`/`app.config.ts` to add the `react-native-ble-plx` plugin configuration.
2. Implement a BLE hook (e.g., `useBLE.ts`) similar to the tutorial, adapting filters and service UUIDs to the target hardware.
3. Create an Expo development build (`npx expo run:android`) and sideload it onto the Samsung J3 for manual testing.
4. Plan for CI/CD updates (EAS Build) once BLE functionality is stable.
