const SortRepos = () => {
  return (
    <div className="mb-2 flex justify-center lg:justify-end">
      <button
        type="button"
        className={`bg-glass mb-2 me-2 rounded-lg px-5 py-2.5 text-xs font-medium focus:outline-none sm:text-sm`}
      >
        Most Recent
      </button>
      <button
        type="button"
        className={`bg-glass mb-2 me-2 rounded-lg px-5 py-2.5 text-xs font-medium focus:outline-none sm:text-sm`}
      >
        Most Stars
      </button>
      <button
        type="button"
        className={`bg-glass mb-2 me-2 rounded-lg px-5 py-2.5 text-xs font-medium focus:outline-none sm:text-sm`}
      >
        Most Forks
      </button>
    </div>
  );
};
