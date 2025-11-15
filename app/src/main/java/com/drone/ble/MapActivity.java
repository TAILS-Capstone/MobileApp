package com.drone.ble;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MapStyleOptions;
import com.google.android.gms.maps.model.PolygonOptions;

public class MapActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap googleMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map);

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.mapFragment);
        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }

        // Bottom tab: Home (H) -> go back to MainActivity
        View tabHome = findViewById(R.id.tabHome);
        if (tabHome != null) {
            tabHome.setOnClickListener(v -> {
                Intent intent = new Intent(MapActivity.this, MainActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }
        // tabMap is current screen; no handler needed.
    }

    @Override
    public void onMapReady(@NonNull GoogleMap map) {
        googleMap = map;

        // Apply a dark/night map style similar to the old implementation
        try {
            googleMap.setMapStyle(
                    MapStyleOptions.loadRawResourceStyle(
                            this, R.raw.map_style_night
                    )
            );
        } catch (Exception ignored) {
        }

        // Center on Ottawa (same defaults as old implementation)
        LatLng ottawa = new LatLng(45.4215, -75.6972);
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(ottawa, 13f));

        // Simple rectangular polygon similar to old default
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

        googleMap.addPolygon(polygonOptions);
    }
}

