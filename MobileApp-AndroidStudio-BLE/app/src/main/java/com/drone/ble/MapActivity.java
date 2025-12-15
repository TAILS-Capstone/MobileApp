package com.drone.ble;

import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MapStyleOptions;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.PolygonOptions;

import java.util.ArrayList;
import java.util.List;

public class MapActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap googleMap;
    private Polygon currentPolygon;
    private final List<Marker> markers = new ArrayList<>();

    private EditText polygonInput;
    private EditText pinInput;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map);

        polygonInput = findViewById(R.id.polygonInput);
        pinInput = findViewById(R.id.pinInput);

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.mapFragment);
        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }

        View tabHome = findViewById(R.id.tabHome);
        if (tabHome != null) {
            tabHome.setOnClickListener(v -> {
                Intent intent = new Intent(MapActivity.this, MainActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabConnect = findViewById(R.id.tabConnect);
        if (tabConnect != null) {
            tabConnect.setOnClickListener(v -> {
                Intent intent = new Intent(MapActivity.this, ConnectActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabHistory = findViewById(R.id.tabHistory);
        if (tabHistory != null) {
            tabHistory.setOnClickListener(v -> {
                Intent intent = new Intent(MapActivity.this, HistoryActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        // Handle "Done" on polygon input
        if (polygonInput != null) {
            polygonInput.setOnEditorActionListener((TextView v, int actionId, KeyEvent event) -> {
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    applyPolygonFromInput();
                    return true;
                }
                return false;
            });
        }

        // Handle "Done" on pin input
        if (pinInput != null) {
            pinInput.setOnEditorActionListener((TextView v, int actionId, KeyEvent event) -> {
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    applyPinsFromInput();
                    return true;
                }
                return false;
            });
        }
    }

    @Override
    public void onMapReady(@NonNull GoogleMap map) {
        googleMap = map;

        // Dark satellite-style view
        try {
            googleMap.setMapStyle(
                    MapStyleOptions.loadRawResourceStyle(
                            this, R.raw.map_style_night
                    )
            );
        } catch (Exception ignored) {
        }
        googleMap.setMapType(GoogleMap.MAP_TYPE_HYBRID); // Satellite with labels

        // Center on Ottawa (same defaults as old implementation)
        LatLng ottawa = new LatLng(45.4215, -75.6972);
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(ottawa, 13f));

        // Initial rectangular polygon similar to old default
        drawDefaultPolygon();
    }

    private void drawDefaultPolygon() {
        if (googleMap == null) return;

        double lat = 45.4215;
        double lng = -75.6972;
        double latDelta = 0.03;
        double lngDelta = 0.04;

        PolygonOptions polygonOptions = new PolygonOptions()
                .add(
                        new LatLng(lat + latDelta / 2, lng - lngDelta / 2),
                        new LatLng(lat + latDelta / 2, lng + lngDelta / 2),
                        new LatLng(lat - latDelta / 2, lng + lngDelta / 2),
                        new LatLng(lat - latDelta / 2, lng - lngDelta / 2)
                )
                .strokeWidth(2f)
                .strokeColor(0xFF0096FF)
                .fillColor(0x330096FF);

        currentPolygon = googleMap.addPolygon(polygonOptions);
    }

    private void applyPolygonFromInput() {
        if (googleMap == null || polygonInput == null) return;
        String text = polygonInput.getText().toString().trim();
        if (text.isEmpty()) return;

        try {
            String[] parts = text.split(",");
            if (parts.length < 8) {
                Toast.makeText(this, "Enter at least 4 coordinate pairs", Toast.LENGTH_SHORT).show();
                return;
            }
            List<LatLng> coords = new ArrayList<>();
            for (int i = 0; i < parts.length; i += 2) {
                double lat = Double.parseDouble(parts[i].trim());
                double lng = Double.parseDouble(parts[i + 1].trim());
                coords.add(new LatLng(lat, lng));
            }

            if (currentPolygon != null) {
                currentPolygon.remove();
            }
            PolygonOptions options = new PolygonOptions()
                    .addAll(coords)
                    .strokeWidth(2f)
                    .strokeColor(0xFF0096FF)
                    .fillColor(0x330096FF);
            currentPolygon = googleMap.addPolygon(options);

            // Move camera roughly to center of polygon
            double sumLat = 0, sumLng = 0;
            for (LatLng ll : coords) {
                sumLat += ll.latitude;
                sumLng += ll.longitude;
            }
            LatLng center = new LatLng(sumLat / coords.size(), sumLng / coords.size());
            googleMap.animateCamera(CameraUpdateFactory.newLatLng(center));
        } catch (Exception e) {
            Toast.makeText(this, "Invalid polygon format", Toast.LENGTH_SHORT).show();
        }
    }

    private void applyPinsFromInput() {
        if (googleMap == null || pinInput == null) return;
        String text = pinInput.getText().toString().trim();
        if (text.isEmpty()) return;

        try {
            String[] parts = text.split(",");
            if (parts.length < 2 || parts.length % 2 != 0) {
                Toast.makeText(this, "Enter valid coordinate pairs", Toast.LENGTH_SHORT).show();
                return;
            }

            for (int i = 0; i < parts.length; i += 2) {
                double lat = Double.parseDouble(parts[i].trim());
                double lng = Double.parseDouble(parts[i + 1].trim());
                LatLng pos = new LatLng(lat, lng);
                Marker marker = googleMap.addMarker(new MarkerOptions().position(pos));
                if (marker != null) {
                    markers.add(marker);
                }
            }

            pinInput.setText("");
        } catch (Exception e) {
            Toast.makeText(this, "Invalid pin format", Toast.LENGTH_SHORT).show();
        }
    }
}

