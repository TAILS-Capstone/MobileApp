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
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Date;
import java.util.Deque;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ConnectActivity extends AppCompatActivity {

    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final long SCAN_PERIOD = 10000; // 10 seconds

    private static final UUID LOCATION_NAV_SERVICE_UUID =
            UUID.fromString("00001819-0000-1000-8000-00805f9b34fb");
    private static final UUID LOCATION_AND_SPEED_CHAR_UUID =
            UUID.fromString("00002a67-0000-1000-8000-00805f9b34fb");
    private static final UUID CLIENT_CHAR_CONFIG_UUID =
            UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private boolean scanning = false;
    private Handler handler = new Handler(Looper.getMainLooper());

    private Button connectButton;
    private TextView statusText;
    private TextView dataText;
    private TextView parsedDataText;
    private TextView logText;
    private ScrollView logScrollView;
    private ProgressBar loadingRing;
    private View statusIndicator;
    private boolean isConnected = false;
    private boolean hasReceivedData = false;

    private BluetoothGatt bluetoothGatt;

    private final List<BluetoothDevice> foundDevices = new ArrayList<>();
    private String lastDeviceAddress = null;
    private String lastDeviceName = null;
    private UUID activeCharacteristicUuid = null;

    private boolean useLegacyScan = false;

    private final Deque<String> logMessages = new ArrayDeque<>();
    private static final int MAX_LOG_LINES = 80;
    private final SimpleDateFormat logTimeFormat =
            new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
    private static final Pattern DETECTION_PATTERN = Pattern.compile(
            "([A-Za-z_\\-]+)\\s*,\\s*(\\d+)\\s*,\\s*(-?\\d+(?:\\.\\d+)?)\\s*,\\s*(-?\\d+(?:\\.\\d+)?)");
    private DetectionData lastDetection = null;

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
        dataText = findViewById(R.id.dataText);
        parsedDataText = findViewById(R.id.parsedDataText);
        logText = findViewById(R.id.logText);
        logScrollView = findViewById(R.id.logScrollView);
        loadingRing = findViewById(R.id.loadingRing);
        statusIndicator = findViewById(R.id.statusIndicator);
        resetDataDisplay();
        resetParsedDataDisplay();
        resetLogDisplay();
        appendLog("Connect UI initialized");

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
            appendLog("Scan requested but already running");
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
            appendLog("Cannot start scan: Bluetooth disabled");
            return;
        }

        if (bluetoothLeScanner == null) {
            bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
            if (bluetoothLeScanner == null) {
                Toast.makeText(this, "Bluetooth LE not supported on this device", Toast.LENGTH_LONG).show();
                appendLog("Cannot start scan: bluetoothLeScanner unavailable");
                return;
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Bluetooth permission required", Toast.LENGTH_LONG).show();
                checkPermissions();   
                appendLog("Cannot start scan: BLUETOOTH_SCAN permission missing");
                return;
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Location permission required for Bluetooth scanning", Toast.LENGTH_LONG).show();
                checkPermissions();
                appendLog("Cannot start scan: location permission missing");
                return;
            }
        }

        foundDevices.clear();
        scanning = true;
        updateUI(true, false);
        appendLog("Starting BLE scan (" + (useLegacyScan ? "legacy" : "modern") + ")");

        handler.postDelayed(() -> {
            if (scanning) {
                stopScanning();
                appendLog("Scan window elapsed, showing picker");
                runOnUiThread(this::showDevicePicker);
            }
        }, SCAN_PERIOD);

        try {
            if (useLegacyScan) {
                bluetoothAdapter.startLeScan(legacyLeScanCallback);
                Toast.makeText(this, "Scanning (legacy)...", Toast.LENGTH_SHORT).show();
                appendLog("Legacy LE scan started");
            } else {
                ScanSettings settings = new ScanSettings.Builder()
                        .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                        .build();

                List<ScanFilter> filters = new ArrayList<>();
                bluetoothLeScanner.startScan(filters, settings, scanCallback);
                Toast.makeText(this, "Scanning for devices...", Toast.LENGTH_SHORT).show();
                appendLog("Modern LE scan started");
            }
        } catch (SecurityException e) {
            scanning = false;
            updateUI(false, false);
            Toast.makeText(this, "Permission denied: " + e.getMessage(), Toast.LENGTH_LONG).show();
             appendLog("Scan failed: " + e.getMessage());
        } catch (Exception e) {
            scanning = false;
            updateUI(false, false);
            Toast.makeText(this, "Scan failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
            appendLog("Scan failed: " + e.getMessage());
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
                BluetoothGattCharacteristic targetCharacteristic = findTargetCharacteristic(gatt);
                if (targetCharacteristic != null) {
                    activeCharacteristicUuid = targetCharacteristic.getUuid();
                    boolean notifSet = gatt.setCharacteristicNotification(targetCharacteristic, true);
                    BluetoothGattDescriptor cccd =
                            targetCharacteristic.getDescriptor(CLIENT_CHAR_CONFIG_UUID);
                    if (cccd != null) {
                        cccd.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                        gatt.writeDescriptor(cccd);
                    }
                    runOnUiThread(() -> Toast.makeText(ConnectActivity.this,
                            notifSet ? "Subscribed to " + activeCharacteristicUuid
                                    : "Failed to subscribe to notifications",
                            Toast.LENGTH_SHORT).show());
                } else {
                    runOnUiThread(() -> Toast.makeText(ConnectActivity.this,
                            "No notifiable characteristic found", Toast.LENGTH_SHORT).show());
                }
            }

            @Override
            public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
                super.onCharacteristicChanged(gatt, characteristic);
                if (activeCharacteristicUuid != null
                        && !activeCharacteristicUuid.equals(characteristic.getUuid())) {
                    return;
                }
                byte[] value = characteristic.getValue();
                if (value != null && value.length > 0) {
                    StringBuilder sb = new StringBuilder();
                    for (byte b : value) {
                        sb.append(String.format("%02X ", b));
                    }
                    final String hexString = sb.toString().trim();

                    runOnUiThread(() -> {
                        updateDataDisplay(hexString, value);
                        Toast.makeText(ConnectActivity.this,
                                "Received hex: " + hexString,
                                Toast.LENGTH_SHORT).show();
                    });
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
        activeCharacteristicUuid = null;
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
                hasReceivedData = false;
                resetDataDisplay();
                resetParsedDataDisplay();
            } else if (connected) {
                loadingRing.setVisibility(View.GONE);
                statusText.setText(R.string.connected);
                connectButton.setText(R.string.disconnect);
                connectButton.setTextColor(getResources().getColor(android.R.color.white, getTheme()));
                connectButton.setEnabled(true);
                applyFlatButtonBackground(R.drawable.button_disconnect);
                statusIndicator.setAlpha(1.0f);
                statusIndicator.setBackgroundResource(R.drawable.status_circle_connected);
                if (!hasReceivedData) {
                    showAwaitingData();
                    showAwaitingParsedData();
                }
            } else {
                loadingRing.setVisibility(View.GONE);
                statusText.setText(R.string.disconnected);
                connectButton.setText(R.string.connect);
                connectButton.setTextColor(getResources().getColor(android.R.color.white, getTheme()));
                connectButton.setEnabled(true);
                applyFlatButtonBackground(R.drawable.button_connect_light);
                statusIndicator.setAlpha(0.7f);
                statusIndicator.setBackgroundResource(R.drawable.status_circle);
                hasReceivedData = false;
                resetDataDisplay();
                resetParsedDataDisplay();
            }
        });
    }

    private BluetoothGattCharacteristic findTargetCharacteristic(BluetoothGatt gatt) {
        BluetoothGattService lnService = gatt.getService(LOCATION_NAV_SERVICE_UUID);
        if (lnService != null) {
            BluetoothGattCharacteristic locChar =
                    lnService.getCharacteristic(LOCATION_AND_SPEED_CHAR_UUID);
            if (locChar != null) {
                return locChar;
            }
        }

        for (BluetoothGattService service : gatt.getServices()) {
            for (BluetoothGattCharacteristic characteristic : service.getCharacteristics()) {
                int props = characteristic.getProperties();
                boolean notifiable =
                        (props & BluetoothGattCharacteristic.PROPERTY_NOTIFY) != 0
                                || (props & BluetoothGattCharacteristic.PROPERTY_INDICATE) != 0;
                if (notifiable) {
                    return characteristic;
                }
            }
        }
        return null;
    }

    private void resetDataDisplay() {
        if (dataText != null) {
            dataText.setText(getString(R.string.last_data_placeholder));
        }
    }

    private void resetParsedDataDisplay() {
        lastDetection = null;
        if (parsedDataText != null) {
            parsedDataText.setText(getString(R.string.parsed_data_placeholder));
        }
    }

    private void showAwaitingData() {
        if (dataText != null) {
            dataText.setText(getString(R.string.last_data_waiting));
        }
    }

    private void showAwaitingParsedData() {
        if (parsedDataText != null) {
            parsedDataText.setText(getString(R.string.parsed_data_waiting));
        }
    }

    private void showParsedDataInvalid() {
        if (parsedDataText != null) {
            parsedDataText.setText(getString(R.string.parsed_data_invalid));
        }
    }

    private void showParsedData(DetectionData detection) {
        lastDetection = detection;
        if (parsedDataText != null) {
            parsedDataText.setText(getString(R.string.parsed_data_format,
                    detection.detectionType,
                    detection.targetId,
                    formatCoordinate(detection.latitude),
                    formatCoordinate(detection.longitude)));
        }
    }

    private String formatCoordinate(double value) {
        return String.format(Locale.US, "%.6f", value);
    }

    private void updateDataDisplay(String hexString, byte[] rawValue) {
        if (dataText == null) {
            return;
        }
        hasReceivedData = true;
        String ascii = new String(rawValue, StandardCharsets.UTF_8).trim();
        boolean readable = isPrintable(ascii);
        StringBuilder display = new StringBuilder();
        display.append("Last data (hex): ").append(hexString);
        if (readable && !ascii.isEmpty()) {
            display.append("\nText: ").append(ascii);
        }
        dataText.setText(display.toString());

        if (readable && !ascii.isEmpty()) {
            DetectionData detection = parseDetectionPayload(ascii);
            if (detection != null) {
                showParsedData(detection);
                appendLog("Parsed detection: " + detection.detectionType + " #" + detection.targetId
                        + " @ " + formatCoordinate(detection.latitude) + ", " + formatCoordinate(detection.longitude));
            } else {
                showParsedDataInvalid();
                appendLog("Payload received but parsing failed: \"" + ascii + "\"");
            }
        } else {
            showAwaitingParsedData();
        }
    }

    private DetectionData parseDetectionPayload(String asciiPayload) {
        if (asciiPayload == null || asciiPayload.isEmpty()) {
            return null;
        }
        Matcher matcher = DETECTION_PATTERN.matcher(asciiPayload);
        DetectionData lastMatch = null;
        while (matcher.find()) {
            try {
                String type = matcher.group(1).trim();
                int id = Integer.parseInt(matcher.group(2).trim());
                double lat = Double.parseDouble(matcher.group(3).trim());
                double lon = Double.parseDouble(matcher.group(4).trim());
                lastMatch = new DetectionData(type, id, lat, lon);
            } catch (NumberFormatException ignored) {
            }
        }
        return lastMatch;
    }

    private void resetLogDisplay() {
        logMessages.clear();
        if (logText != null) {
            logText.setText(getString(R.string.logs_placeholder));
        }
    }

    private void appendLog(String message) {
        if (logText == null) {
            return;
        }
        if (Looper.myLooper() != Looper.getMainLooper()) {
            runOnUiThread(() -> appendLog(message));
            return;
        }
        String timestamp = logTimeFormat.format(new Date());
        logMessages.addFirst(timestamp + "  " + message);
        while (logMessages.size() > MAX_LOG_LINES) {
            logMessages.removeLast();
        }
        StringBuilder builder = new StringBuilder();
        for (String log : logMessages) {
            builder.append(log).append("\n");
        }
        logText.setText(builder.toString().trim());
        if (logScrollView != null) {
            logScrollView.post(() -> logScrollView.fullScroll(View.FOCUS_DOWN));
        }
    }

    private boolean isPrintable(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }
        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            if (Character.isISOControl(c) && !Character.isWhitespace(c)) {
                return false;
            }
        }
        return true;
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

    private static class DetectionData {
        final String detectionType;
        final int targetId;
        final double latitude;
        final double longitude;

        DetectionData(String detectionType, int targetId, double latitude, double longitude) {
            this.detectionType = detectionType;
            this.targetId = targetId;
            this.latitude = latitude;
            this.longitude = longitude;
        }
    }
}


