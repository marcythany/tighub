const SortRepos = ({ onSort, sortType }) => {
  const sortOptions = [
    { value: 'recent', label: 'Mais Recentes' },
    { value: 'stars', label: 'Mais Estrelas' },
    { value: 'forks', label: 'Mais Forks' },
  ];

  const SortButton = ({ value, label }) => (
    <button
      type="button"
      className={`bg-glass mb-2 me-2 rounded-lg px-5 py-2.5 text-xs font-medium focus:outline-none sm:text-sm ${
        sortType === value ? 'border-blue-500' : ''
      }`}
      onClick={() => onSort(value)}
    >
      {label}
    </button>
  );

  return (
    <div className="mb-2 flex justify-center lg:justify-end">
      {sortOptions.map(({ value, label }) => (
        <SortButton key={value} value={value} label={label} />
      ))}
    </div>
  );
};

export default SortRepos;
