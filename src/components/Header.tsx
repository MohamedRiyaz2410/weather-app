interface Props {
  isDark: boolean;
}

function Header({ isDark }: Props) {
  return (
    <header className="max-w-3xl">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.3em] ${
          isDark ? "text-sky-300" : "text-sky-600"
        }`}
      >
        Atmosphere
      </p>
      <h1
        className={`mt-3 text-3xl sm:text-5xl md:text-6xl font-black leading-tight ${
          isDark ? "text-white" : "text-slate-950"
        }`}
      >
        Weather at a glance
      </h1>
      <p
        className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        Search any city for live conditions, comfort details, and a clean 5-day outlook.
      </p>
    </header>
  );
}

export default Header;
