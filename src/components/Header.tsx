interface Props {
  isDark: boolean;
}

function Header({ isDark }: Props) {
  return (
    <h1
      className={`text-4xl font-bold text-center mb-6 ${
        isDark ? "text-sky-200" : "text-slate-900"
      }`}
    >
      🌤 Weather App
    </h1>
  );
}

export default Header;
