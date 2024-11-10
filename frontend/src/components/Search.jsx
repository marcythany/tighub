import { IoSearch } from 'react-icons/io5';

const Search = () => {
  return (
    <form className="mx-auto max-w-xl p-2 sm:w-72">
      <label
        htmlFor="default-search"
        className="sr-only mb-2 text-sm font-medium text-gray-900"
      >
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3">
          <IoSearch className="h-5 w-5" />
        </div>
        <input
          type="search"
          id="default-search"
          className="bg-glass block w-full rounded-lg bg-transparent p-4 ps-10 text-sm focus:border-blue-500 focus:bg-transparent focus:ring-blue-500"
          placeholder="i.e. johndoe"
          required
        />
        <button
          type="submit"
          className="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 bg-gradient-to-r from-cyan-900 to-blue-900 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-95 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-90"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default Search;
