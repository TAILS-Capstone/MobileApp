package com.drone.ble;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    private static final String WEATHER_API_KEY = "183de782c7c6f6ea3abec22d8a21ed85";

    private final Handler handler = new Handler(Looper.getMainLooper());

    private TextView weatherTempValue;
    private TextView weatherConditionValue;
    private TextView weatherWindValue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initializeViews();
        fetchWeather();
    }

    private void initializeViews() {
        weatherTempValue = findViewById(R.id.weatherTempValue);
        weatherConditionValue = findViewById(R.id.weatherConditionValue);
        weatherWindValue = findViewById(R.id.weatherWindValue);

        View actionMap = findViewById(R.id.actionMap);
        if (actionMap != null) {
            actionMap.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, MapActivity.class)));
        }

        View actionHistory = findViewById(R.id.actionHistory);
        if (actionHistory != null) {
            actionHistory.setOnClickListener(v ->
                    startActivity(new Intent(MainActivity.this, HistoryActivity.class)));
        }

        View tabHome = findViewById(R.id.tabHome);
        if (tabHome != null) {
            tabHome.setOnClickListener(v -> {
                // Already on home
            });
        }

        View tabMap = findViewById(R.id.tabMap);
        if (tabMap != null) {
            tabMap.setOnClickListener(v -> {
                Intent intent = new Intent(MainActivity.this, MapActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabConnect = findViewById(R.id.tabConnect);
        if (tabConnect != null) {
            tabConnect.setOnClickListener(v -> {
                Intent intent = new Intent(MainActivity.this, ConnectActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }

        View tabHistory = findViewById(R.id.tabHistory);
        if (tabHistory != null) {
            tabHistory.setOnClickListener(v -> {
                Intent intent = new Intent(MainActivity.this, HistoryActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                startActivity(intent);
            });
        }
    }

    private void fetchWeather() {
        if (WEATHER_API_KEY == null || WEATHER_API_KEY.isEmpty()) {
            Toast.makeText(this, "Weather API key missing", Toast.LENGTH_LONG).show();
            return;
        }

        new Thread(() -> {
            HttpURLConnection connection = null;
            try {
                String urlStr = "https://api.openweathermap.org/data/2.5/weather"
                        + "?lat=45.4215&lon=-75.6972&units=metric&appid=" + WEATHER_API_KEY;
                URL url = new URL(urlStr);
                connection = (HttpURLConnection) url.openConnection();
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);

                InputStream is = connection.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
                reader.close();

                JSONObject json = new JSONObject(sb.toString());
                JSONObject main = json.getJSONObject("main");
                JSONArray weatherArr = json.getJSONArray("weather");
                JSONObject wind = json.getJSONObject("wind");

                double temp = main.getDouble("temp");
                String condition = weatherArr.getJSONObject(0).getString("main");
                double windSpeed = wind.optDouble("speed", 0.0);

                final String tempText = Math.round(temp) + "°C";
                final String condText = condition;
                final String windText = Math.round(windSpeed * 3.6) + " km/h";

                handler.post(() -> {
                    if (weatherTempValue != null) {
                        weatherTempValue.setText(tempText);
                    }
                    if (weatherConditionValue != null) {
                        weatherConditionValue.setText(condText);
                    }
                    if (weatherWindValue != null) {
                        weatherWindValue.setText(windText);
                    }
                });
            } catch (Exception e) {
                final String msg = e.getClass().getSimpleName()
                        + (e.getMessage() != null ? (": " + e.getMessage()) : "");
                handler.post(() ->
                        Toast.makeText(MainActivity.this, "Weather error: " + msg, Toast.LENGTH_LONG).show()
                );
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }).start();
    }
}


