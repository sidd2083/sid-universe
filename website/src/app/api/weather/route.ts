import { NextResponse } from 'next/server';

let cachedWeather: any = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function mapWeatherCode(code: number): { condition: string; rain: boolean } {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { condition: 'Clear sky', rain: false };
  if (code === 1) return { condition: 'Mainly clear', rain: false };
  if (code === 2) return { condition: 'Partly cloudy', rain: false };
  if (code === 3) return { condition: 'Overcast', rain: false };
  if (code === 45 || code === 48) return { condition: 'Foggy & misty', rain: false };
  if (code >= 51 && code <= 55) return { condition: 'Light drizzle', rain: true };
  if (code >= 61 && code <= 65) return { condition: 'Rain', rain: true };
  if (code >= 80 && code <= 82) return { condition: 'Rain showers', rain: true };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', rain: true };
  return { condition: 'Mild atmosphere', rain: false };
}

export async function GET() {
  const now = Date.now();

  if (cachedWeather && now - lastFetchTime < CACHE_DURATION_MS) {
    return NextResponse.json(cachedWeather);
  }

  try {
    // Hetauda, Nepal: Lat 27.4284, Lon 85.0331
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=27.4284&longitude=85.0331&current=temperature_2m,relative_humidity_2m,weather_code,is_day,wind_speed_10m&daily=sunrise,sunset&timezone=Asia%2FKathmandu',
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      throw new Error(`Weather service returned ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};
    const code = current.weather_code ?? 0;
    const { condition, rain } = mapWeatherCode(code);

    const payload = {
      city: 'Hetauda, Nepal',
      temperature: Math.round(current.temperature_2m ?? 23),
      weatherCode: code,
      condition,
      rain,
      isDay: current.is_day === 1,
      humidity: Math.round(current.relative_humidity_2m ?? 65),
      windSpeed: Math.round(current.wind_speed_10m ?? 8),
      sunrise: daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1] : '06:15',
      sunset: daily.sunset?.[0] ? daily.sunset[0].split('T')[1] : '17:45',
      updatedAt: new Date().toISOString()
    };

    cachedWeather = payload;
    lastFetchTime = now;

    return NextResponse.json(payload);
  } catch (error: any) {
    // Fallback based on Kathmandu/Hetauda typical temperature
    const fallback = cachedWeather || {
      city: 'Hetauda, Nepal',
      temperature: 24,
      weatherCode: 1,
      condition: 'Clear & calm',
      rain: false,
      isDay: true,
      humidity: 60,
      windSpeed: 7,
      sunrise: '06:15',
      sunset: '17:45',
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(fallback);
  }
}
