interface Props {
  city: string;
  setCity: (city: string) => void;
  searchWeather: () => void;
}

function SearchBar({
  city,
  setCity,
  searchWeather,
}: Props) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        className="flex-1 border rounded-lg p-3"
      />

      <button
        onClick={searchWeather}
        className="bg-blue-600 text-white px-4 rounded-lg"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;