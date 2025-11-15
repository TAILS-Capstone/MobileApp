package com.drone.ble;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import android.app.AlertDialog;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothGattDescriptor;

public class MainActivity extends AppCompatActivity {

    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final long SCAN_PERIOD = 10000; // 10 seconds

    // Location and Navigation standard service and characteristic UUIDs
    // Service: 0x1819, Characteristic (Location and Speed): 0x2A68, CCCD: 0x2902
    private static final UUID LOCATION_NAV_SERVICE_UUID =
            UUID.fromString("00001819-0000-1000-8000-00805f9b34fb");
    private static final UUID LOCATION_AND_SPEED_CHAR_UUID =
            UUID.fromString("00002a68-0000-1000-8000-00805f9b34fb");
    private static final UUID CLIENT_CHAR_CONFIG_UUID =
            UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private boolean scanning = false;
    private Handler handler = new Handler(Looper.getMainLooper());

    private Button connectButton;
    private TextView statusText;
    private ProgressBar loadingRing;
    private View statusIndicator;
    private boolean isConnected = false;

    private BluetoothGatt bluetoothGatt;

    private List<BluetoothDevice> foundDevices = new ArrayList<>();

    private ScanCallback scanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            super.onScanResult(callbackType, result);
            BluetoothDevice device = result.getDevice();
            if (device != null && !foundDevices.contains(device)) {
                foundDevices.add(device);
            }
        }

        @Override
        public void onScanFailed(int errorCode) {
            super.onScanFailed(errorCode);
            // Mark not scanning and best-effort stop any ongoing scan
            scanning = false;
            if (bluetoothLeScanner != null) {
                try {
                    bluetoothLeScanner.stopScan(scanCallback);
                } catch (Exception ignored) {
                }
            }
            updateUI(false, false);
            Toast.makeText(MainActivity.this, "Scan failed: " + errorCode, Toast.LENGTH_SHORT).show();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toast.makeText(this, "onCreate called!", Toast.LENGTH_LONG).show();
        initializeViews();
        initializeBluetooth();
        checkPermissions();
    }

    private void initializeViews() {
        connectButton = findViewById(R.id.connectButton);
        statusText = findViewById(R.id.statusText);
        loadingRing = findViewById(R.id.loadingRing);
        statusIndicator = findViewById(R.id.statusIndicator);
        View actionMap = findViewById(R.id.actionMap);

        connectButton.setOnClickListener(v -> {
            Toast.makeText(this, "Button tapped!", Toast.LENGTH_SHORT).show();
            if (isConnected) {
                disconnect();
            } else {
                // Check if already scanning
                if (scanning) {
                    stopScanning();
                } else {
                    startScanning();
                }
            }
        });

        if (actionMap != null) {
            actionMap.setOnClickListener(v -> {
                Intent intent = new Intent(MainActivity.this, MapActivity.class);
                startActivity(intent);
            });
        }
    }

    private void initializeBluetooth() {
        BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        if (bluetoothManager != null) {
            bluetoothAdapter = bluetoothManager.getAdapter();
            if (bluetoothAdapter != null) {
                bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
            }
        }

        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) {
            Toast.makeText(this, "Bluetooth is not enabled", Toast.LENGTH_LONG).show();
        }
    }

    private void checkPermissions() {
        List<String> permissionsNeeded = new ArrayList<>();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.BLUETOOTH_SCAN);
            }
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.BLUETOOTH_CONNECT);
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION);
            }
        }

        if (!permissionsNeeded.isEmpty()) {
            ActivityCompat.requestPermissions(this, permissionsNeeded.toArray(new String[0]), PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            if (!allGranted) {
                Toast.makeText(this, "Permissions are required for Bluetooth", Toast.LENGTH_LONG).show();
            }
        }
    }

    private void startScanning() {
        // Always try to stop any previous scan to avoid SCAN_FAILED_APPLICATION_REGISTRATION_FAILED
        if (bluetoothLeScanner != null) {
            try {
                bluetoothLeScanner.stopScan(scanCallback);
            } catch (Exception ignored) {
            }
        }
        scanning = false;

        // Check if Bluetooth is enabled
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) {
            Toast.makeText(this, "Please enable Bluetooth first", Toast.LENGTH_LONG).show();
            return;
        }

        // Check if scanner is available
        if (bluetoothLeScanner == null) {
            bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
            if (bluetoothLeScanner == null) {
                Toast.makeText(this, "Bluetooth LE not supported on this device", Toast.LENGTH_LONG).show();
                return;
            }
        }

        // Check permissions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Bluetooth permission required", Toast.LENGTH_LONG).show();
                checkPermissions();
                return;
            }
        } else {
            // For Android 6.0-11, location permission is required for BLE scanning
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Location permission required for Bluetooth scanning", Toast.LENGTH_LONG).show();
                checkPermissions();
                return;
            }
        }

        foundDevices.clear();
        scanning = true;
        updateUI(true, false);

        // Stops scanning after a pre-defined scan period
        handler.postDelayed(() -> {
            if (scanning) {
                stopScanning();
                runOnUiThread(this::showDevicePicker);
            }
        }, SCAN_PERIOD);

        try {
            ScanSettings settings = new ScanSettings.Builder()
                    .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                    .build();

            List<ScanFilter> filters = new ArrayList<>();
            bluetoothLeScanner.startScan(filters, settings, scanCallback);
            Toast.makeText(this, "Scanning for devices...", Toast.LENGTH_SHORT).show();
        } catch (SecurityException e) {
            scanning = false;
            updateUI(false, false);
            Toast.makeText(this, "Permission denied: " + e.getMessage(), Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            scanning = false;
            updateUI(false, false);
            Toast.makeText(this, "Scan failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    private void stopScanning() {
        if (!scanning || bluetoothLeScanner == null) {
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
        }

        scanning = false;
        bluetoothLeScanner.stopScan(scanCallback);
    }

    private void showDevicePicker() {
        scanning = false;
        if (foundDevices.isEmpty()) {
            Toast.makeText(this, "No BLE devices found", Toast.LENGTH_LONG).show();
            updateUI(false, false);
            return;
        }
        String[] displayNames = new String[foundDevices.size()];
        for (int i = 0; i < foundDevices.size(); ++i) {
            BluetoothDevice device = foundDevices.get(i);
            String name = device.getName();
            String addr = device.getAddress();
            displayNames[i] = (name != null && !name.isEmpty() ? name : "(unnamed)") + "\n" + addr;
        }
        new AlertDialog.Builder(this)
            .setTitle("Select device")
            .setItems(displayNames, (dialog, which) -> connectToDevice(foundDevices.get(which)))
            .setNegativeButton("Cancel", (dialog, which) -> updateUI(false, false))
            .show();
    }

    private void connectToDevice(BluetoothDevice device) {
        stopScanning();
        Toast.makeText(this, "Connecting to " + device.getName(), Toast.LENGTH_SHORT).show();

        if (bluetoothGatt != null) {
            bluetoothGatt.close();
            bluetoothGatt = null;
        }

        bluetoothGatt = device.connectGatt(this, false, new BluetoothGattCallback() {
            @Override
            public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
                super.onConnectionStateChange(gatt, status, newState);
                if (newState == BluetoothGatt.STATE_CONNECTED) {
                    runOnUiThread(() -> {
                        isConnected = true;
                        updateUI(false, true);
                        Toast.makeText(MainActivity.this, "GATT Connected!", Toast.LENGTH_SHORT).show();
                    });
                    gatt.discoverServices();
                } else if (newState == BluetoothGatt.STATE_DISCONNECTED) {
                    runOnUiThread(() -> {
                        isConnected = false;
                        updateUI(false, false);
                        Toast.makeText(MainActivity.this, "Disconnected", Toast.LENGTH_SHORT).show();
                    });
                    gatt.close();
                    bluetoothGatt = null;
                }
            }

            @Override
            public void onServicesDiscovered(BluetoothGatt gatt, int status) {
                super.onServicesDiscovered(gatt, status);
                // Subscribe to Location and Speed notifications if available
                BluetoothGattService lnService = gatt.getService(LOCATION_NAV_SERVICE_UUID);
                if (lnService != null) {
                    BluetoothGattCharacteristic locChar =
                            lnService.getCharacteristic(LOCATION_AND_SPEED_CHAR_UUID);
                    if (locChar != null) {
                        boolean notifSet = gatt.setCharacteristicNotification(locChar, true);
                        BluetoothGattDescriptor cccd =
                                locChar.getDescriptor(CLIENT_CHAR_CONFIG_UUID);
                        if (cccd != null) {
                            cccd.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                            gatt.writeDescriptor(cccd);
                        }
                        runOnUiThread(() -> Toast.makeText(MainActivity.this,
                                notifSet ? "Subscribed to location notifications"
                                         : "Failed to subscribe to notifications",
                                Toast.LENGTH_SHORT).show());
                    } else {
                        runOnUiThread(() -> Toast.makeText(MainActivity.this,
                                "Location characteristic 0x2A68 not found", Toast.LENGTH_SHORT).show());
                    }
                } else {
                    runOnUiThread(() -> Toast.makeText(MainActivity.this,
                            "Location & Navigation service 0x1819 not found", Toast.LENGTH_SHORT).show());
                }
            }

            @Override
            public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
                super.onCharacteristicRead(gatt, characteristic, status);
            }

            @Override
            public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
                super.onCharacteristicChanged(gatt, characteristic);
                if (LOCATION_AND_SPEED_CHAR_UUID.equals(characteristic.getUuid())) {
                    byte[] value = characteristic.getValue();
                    if (value != null && value.length > 0) {
                        // Convert bytes to a hex string, e.g. "01 02 03 04"
                        StringBuilder sb = new StringBuilder();
                        for (byte b : value) {
                            sb.append(String.format("%02X ", b));
                        }
                        final String hexString = sb.toString().trim();

                        runOnUiThread(() -> {
                            statusText.setText("Data (hex): " + hexString);
                            Toast.makeText(MainActivity.this,
                                    "Received hex: " + hexString,
                                    Toast.LENGTH_SHORT).show();
                        });
                    }
                }
            }

            @Override
            public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
                super.onCharacteristicWrite(gatt, characteristic, status);
            }
        });
    }

    private void disconnect() {
        if (bluetoothGatt != null) {
            bluetoothGatt.disconnect();
            bluetoothGatt.close();
            bluetoothGatt = null;
        }
        isConnected = false;
        updateUI(false, false);
        Toast.makeText(this, "Disconnected", Toast.LENGTH_SHORT).show();
    }

    private void updateUI(boolean isLoading, boolean connected) {
        runOnUiThread(() -> {
            if (isLoading) {
                loadingRing.setVisibility(View.VISIBLE);
                statusText.setText(R.string.scanning);
                connectButton.setText(R.string.scanning);
                connectButton.setEnabled(false);
                statusIndicator.setAlpha(0.5f);
            } else if (connected) {
                loadingRing.setVisibility(View.GONE);
                statusText.setText(R.string.connected);
                connectButton.setText(R.string.disconnect);
                connectButton.setTextColor(getResources().getColor(android.R.color.white, getTheme()));
                connectButton.setEnabled(true);
                connectButton.setBackgroundResource(R.drawable.button_disconnect);
                statusIndicator.setAlpha(1.0f);
                statusIndicator.setBackgroundResource(R.drawable.status_circle_connected);
            } else {
                loadingRing.setVisibility(View.GONE);
                statusText.setText(R.string.disconnected);
                connectButton.setText(R.string.connect);
                connectButton.setTextColor(getResources().getColor(android.R.color.black, getTheme()));
                connectButton.setEnabled(true);
                connectButton.setBackgroundResource(R.drawable.button_connect);
                statusIndicator.setAlpha(0.7f);
                statusIndicator.setBackgroundResource(R.drawable.status_circle);
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        stopScanning();
    }
}

