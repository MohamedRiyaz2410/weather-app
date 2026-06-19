import type { WeatherData } from "../types/Weather";

interface Props {
  weather: WeatherData;
  isDark: boolean;
}

function WeatherCard({ weather, isDark }: Props) {
  const formatDay = (date: string) =>
    new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(new Date(date));

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <section
        className={`rounded-[1.75rem] border p-6 shadow-xl ${
          isDark
            ? "border-white/10 bg-slate-950/60 shadow-black/30"
            : "border-white bg-white shadow-sky-200/50"
        }`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-[0.22em] ${
                isDark ? "text-sky-300" : "text-sky-600"
              }`}
            >
              Current weather
            </p>
            <h2 className="mt-2 text-3xl font-black">
              {weather.city}
            </h2>
            <p
              className={`mt-2 text-base flex items-center gap-2 ${
                isDark ? "text-slate-300" : "text-slate-500"
              }`}
            >
              <span className="text-2xl">{weather.conditionEmoji}</span>
              {weather.condition}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <span className="text-6xl" role="img" aria-label={weather.condition}>
              {weather.conditionEmoji}
            </span>
            <div className="text-left sm:text-right">
              <p className="text-7xl font-black tracking-normal text-sky-500">
                {Math.round(weather.temperature)}°
              </p>
              <p
                className={`mt-1 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-500"
                }`}
              >
                Feels like {Math.round(weather.apparentTemperature)}°C
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric
            label="Humidity"
            value={`${weather.humidity}%`}
            isDark={isDark}
          />
          <Metric
            label="Wind"
            value={`${Math.round(weather.windSpeed)} km/h`}
            isDark={isDark}
          />
          <Metric
            label="Pressure"
            value={`${Math.round(weather.pressure)} hPa`}
            isDark={isDark}
          />
          <Metric
            label="Rain"
            value={`${weather.precipitation} mm`}
            isDark={isDark}
          />
          <Metric
            label="Clouds"
            value={`${weather.cloudCover}%`}
            isDark={isDark}
          />
          <Metric
            label="Updated"
            value={new Intl.DateTimeFormat("en", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(weather.time))}
            isDark={isDark}
          />
        </div>
      </section>

      <section
        className={`rounded-[1.75rem] border p-5 shadow-xl ${
          isDark
            ? "border-white/10 bg-slate-950/60 shadow-black/30"
            : "border-white bg-white shadow-sky-200/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">
            5-day outlook
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isDark
                ? "bg-sky-400/10 text-sky-300"
                : "bg-sky-100 text-sky-700"
            }`}
          >
            Live
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {weather.daily.map((day) => (
            <div
              key={day.date}
              className={`grid grid-cols-[48px_auto_1fr_auto] items-center gap-3 rounded-2xl p-3 ${
                isDark
                  ? "bg-white/[0.06]"
                  : "bg-slate-50"
              }`}
            >
              <span className="text-sm font-bold">
                {formatDay(day.date)}
              </span>
              <span className="text-xl w-6 text-center" role="img" aria-label={day.condition}>
                {day.conditionEmoji}
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {day.condition}
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Rain {day.precipitationChance}% · UV {Math.round(day.uvIndex)}
                </p>
              </div>
              <span className="text-sm font-black">
                {Math.round(day.maxTemperature)}° / {Math.round(day.minTemperature)}°
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        isDark ? "bg-white/[0.06]" : "bg-slate-50"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.16em] ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-lg font-black">
        {value}
      </p>
    </div>
  );
}

export default WeatherCard;
