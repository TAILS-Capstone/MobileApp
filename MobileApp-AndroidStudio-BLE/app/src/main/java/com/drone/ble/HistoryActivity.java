package com.drone.ble;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

public class HistoryActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);

        View tabHome = findViewById(R.id.tabHome);
        if (tabHome != null) {
            tabHome.setOnClickListener(v -> {
                Intent intent = new Intent(HistoryActivity.this, MainActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabMap = findViewById(R.id.tabMap);
        if (tabMap != null) {
            tabMap.setOnClickListener(v -> {
                Intent intent = new Intent(HistoryActivity.this, MapActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabConnect = findViewById(R.id.tabConnect);
        if (tabConnect != null) {
            tabConnect.setOnClickListener(v -> {
                Intent intent = new Intent(HistoryActivity.this, ConnectActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabHistory = findViewById(R.id.tabHistory);
        if (tabHistory != null) {
            tabHistory.setOnClickListener(v -> {
                // already here
            });
        }
    }
}


