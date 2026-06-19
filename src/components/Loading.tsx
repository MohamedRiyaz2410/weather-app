interface Props {
  isDark: boolean;
}

function Loading({ isDark }: Props) {
  return (
    <div
      className={`text-center mt-5 ${
        isDark ? "text-slate-300" : "text-slate-600"
      }`}
    >
      Loading...
    </div>
  );
}

export default Loading;
