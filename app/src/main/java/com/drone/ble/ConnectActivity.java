package com.drone.ble;

import android.Manifest;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
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

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ConnectActivity extends AppCompatActivity {

    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final long SCAN_PERIOD = 10000; // 10 seconds

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

    private final List<BluetoothDevice> foundDevices = new ArrayList<>();
    private String lastDeviceAddress = null;
    private String lastDeviceName = null;

    private boolean useLegacyScan = false;

    private final BluetoothAdapter.LeScanCallback legacyLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) {
            if (device != null && !foundDevices.contains(device)) {
                foundDevices.add(device);
            }
        }
    };

    private final ScanCallback scanCallback = new ScanCallback() {
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
            scanning = false;
            updateUI(false, false);
            if (errorCode == ScanCallback.SCAN_FAILED_APPLICATION_REGISTRATION_FAILED) {
                useLegacyScan = true;
                Toast.makeText(ConnectActivity.this,
                        "Scan failed: 2. Switching to legacy scan...", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(ConnectActivity.this,
                        "Scan failed: " + errorCode, Toast.LENGTH_SHORT).show();
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_connect);

        initializeViews();
        initializeBluetooth();
        checkPermissions();
    }

    private void initializeViews() {
        connectButton = findViewById(R.id.connectButton);
        statusText = findViewById(R.id.statusText);
        loadingRing = findViewById(R.id.loadingRing);
        statusIndicator = findViewById(R.id.statusIndicator);

        connectButton.setOnClickListener(v -> {
            Toast.makeText(this, "Button tapped!", Toast.LENGTH_SHORT).show();
            if (isConnected) {
                disconnect();
            } else {
                if (lastDeviceAddress != null && bluetoothAdapter != null && bluetoothAdapter.isEnabled()) {
                    String label = (lastDeviceName != null && !lastDeviceName.isEmpty())
                            ? lastDeviceName
                            : "(unnamed)";
                    new AlertDialog.Builder(this)
                            .setTitle("Connect")
                            .setMessage("Reconnect to:\n" + label + "\n" + lastDeviceAddress + "?")
                            .setPositiveButton("Reconnect", (dialog, which) -> reconnectToLastDevice())
                            .setNegativeButton("Scan", (dialog, which) -> startScanning())
                            .show();
                } else {
                    if (scanning) {
                        stopScanning();
                    } else {
                        startScanning();
                    }
                }
            }
        });

        View tabHome = findViewById(R.id.tabHome);
        if (tabHome != null) {
            tabHome.setOnClickListener(v -> {
                Intent intent = new Intent(ConnectActivity.this, MainActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabMap = findViewById(R.id.tabMap);
        if (tabMap != null) {
            tabMap.setOnClickListener(v -> {
                Intent intent = new Intent(ConnectActivity.this, MapActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabConnect = findViewById(R.id.tabConnect);
        if (tabConnect != null) {
            tabConnect.setOnClickListener(v -> {
                // already on Connect tab
            });
        }

        View tabHistory = findViewById(R.id.tabHistory);
        if (tabHistory != null) {
            tabHistory.setOnClickListener(v -> {
                Intent intent = new Intent(ConnectActivity.this, HistoryActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
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
        if (scanning) {
            Toast.makeText(this, "Already scanning...", Toast.LENGTH_SHORT).show();
            return;
        }

        if (bluetoothLeScanner != null) {
            try {
                bluetoothLeScanner.stopScan(scanCallback);
            } catch (Exception ignored) {
            }
        }
        scanning = false;

        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) {
            Toast.makeText(this, "Please enable Bluetooth first", Toast.LENGTH_LONG).show();
            return;
        }

        if (bluetoothLeScanner == null) {
            bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
            if (bluetoothLeScanner == null) {
                Toast.makeText(this, "Bluetooth LE not supported on this device", Toast.LENGTH_LONG).show();
                return;
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Bluetooth permission required", Toast.LENGTH_LONG).show();
                checkPermissions();
                return;
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Location permission required for Bluetooth scanning", Toast.LENGTH_LONG).show();
                checkPermissions();
                return;
            }
        }

        foundDevices.clear();
        scanning = true;
        updateUI(true, false);

        handler.postDelayed(() -> {
            if (scanning) {
                stopScanning();
                runOnUiThread(this::showDevicePicker);
            }
        }, SCAN_PERIOD);

        try {
            if (useLegacyScan) {
                bluetoothAdapter.startLeScan(legacyLeScanCallback);
                Toast.makeText(this, "Scanning (legacy)...", Toast.LENGTH_SHORT).show();
            } else {
                ScanSettings settings = new ScanSettings.Builder()
                        .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                        .build();

                List<ScanFilter> filters = new ArrayList<>();
                bluetoothLeScanner.startScan(filters, settings, scanCallback);
                Toast.makeText(this, "Scanning for devices...", Toast.LENGTH_SHORT).show();
            }
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
        if (!scanning) {
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
        }

        scanning = false;
        try {
            if (useLegacyScan) {
                bluetoothAdapter.stopLeScan(legacyLeScanCallback);
            } else if (bluetoothLeScanner != null) {
                bluetoothLeScanner.stopScan(scanCallback);
            }
        } catch (Exception ignored) {
        }
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
        if (device == null) {
            Toast.makeText(this, "Device is null", Toast.LENGTH_SHORT).show();
            return;
        }

        lastDeviceAddress = device.getAddress();
        lastDeviceName = device.getName();

        updateUI(true, false);

        Toast.makeText(this,
                "Connecting to " + (lastDeviceName != null ? lastDeviceName : device.getAddress()),
                Toast.LENGTH_SHORT).show();

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
                        Toast.makeText(ConnectActivity.this, "GATT Connected!", Toast.LENGTH_SHORT).show();
                    });
                    gatt.discoverServices();
                } else if (newState == BluetoothGatt.STATE_DISCONNECTED) {
                    runOnUiThread(() -> {
                        isConnected = false;
                        updateUI(false, false);
                        Toast.makeText(ConnectActivity.this, "Disconnected", Toast.LENGTH_SHORT).show();
                    });
                    gatt.close();
                    bluetoothGatt = null;
                }
            }

            @Override
            public void onServicesDiscovered(BluetoothGatt gatt, int status) {
                super.onServicesDiscovered(gatt, status);
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
                        runOnUiThread(() -> Toast.makeText(ConnectActivity.this,
                                notifSet ? "Subscribed to location notifications"
                                        : "Failed to subscribe to notifications",
                                Toast.LENGTH_SHORT).show());
                    } else {
                        runOnUiThread(() -> Toast.makeText(ConnectActivity.this,
                                "Location characteristic 0x2A68 not found", Toast.LENGTH_SHORT).show());
                    }
                } else {
                    runOnUiThread(() -> Toast.makeText(ConnectActivity.this,
                            "Location & Navigation service 0x1819 not found", Toast.LENGTH_SHORT).show());
                }
            }

            @Override
            public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
                super.onCharacteristicChanged(gatt, characteristic);
                if (LOCATION_AND_SPEED_CHAR_UUID.equals(characteristic.getUuid())) {
                    byte[] value = characteristic.getValue();
                    if (value != null && value.length > 0) {
                        StringBuilder sb = new StringBuilder();
                        for (byte b : value) {
                            sb.append(String.format("%02X ", b));
                        }
                        final String hexString = sb.toString().trim();

                        runOnUiThread(() -> {
                            statusText.setText("Data (hex): " + hexString);
                            Toast.makeText(ConnectActivity.this,
                                    "Received hex: " + hexString,
                                    Toast.LENGTH_SHORT).show();
                        });
                    }
                }
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

    private void reconnectToLastDevice() {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) {
            Toast.makeText(this, "Please enable Bluetooth first", Toast.LENGTH_LONG).show();
            return;
        }
        if (lastDeviceAddress == null || lastDeviceAddress.isEmpty()) {
            Toast.makeText(this, "No previous device to reconnect", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            BluetoothDevice device = bluetoothAdapter.getRemoteDevice(lastDeviceAddress);
            if (device == null) {
                Toast.makeText(this, "Saved device not found", Toast.LENGTH_SHORT).show();
                return;
            }
            connectToDevice(device);
        } catch (IllegalArgumentException e) {
            Toast.makeText(this, "Invalid saved device address", Toast.LENGTH_SHORT).show();
        }
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
                applyFlatButtonBackground(R.drawable.button_disconnect);
                statusIndicator.setAlpha(1.0f);
                statusIndicator.setBackgroundResource(R.drawable.status_circle_connected);
            } else {
                loadingRing.setVisibility(View.GONE);
                statusText.setText(R.string.disconnected);
                connectButton.setText(R.string.connect);
                connectButton.setTextColor(getResources().getColor(android.R.color.white, getTheme()));
                connectButton.setEnabled(true);
                applyFlatButtonBackground(R.drawable.button_connect_light);
                statusIndicator.setAlpha(0.7f);
                statusIndicator.setBackgroundResource(R.drawable.status_circle);
            }
        });
    }

    private void applyFlatButtonBackground(int drawableRes) {
        connectButton.setBackgroundResource(drawableRes);
        connectButton.setBackgroundTintList(null);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            connectButton.setStateListAnimator(null);
            connectButton.setElevation(0f);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        stopScanning();
    }

    @Override
    protected void onPause() {
        super.onPause();
        stopScanning();
    }
}


