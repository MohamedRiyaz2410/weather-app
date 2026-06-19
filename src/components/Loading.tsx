interface Props {
  isDark: boolean;
}

function Loading({ isDark }: Props) {
  return (
    <div
      className={`mt-6 flex items-center gap-3 rounded-2xl border p-4 ${
        isDark ? "text-slate-300" : "text-slate-600"
      }`}
    >
      <span className="h-3 w-3 animate-pulse rounded-full bg-sky-500" />
      Updating live forecast...
    </div>
  );
}

export default Loading;
