const HomePage = () => {
  return (
    <div className="m-4">
      <Search />
      <SortRepos />
      <div className="flex flex-col items-start justify-center gap-4 lg:flex-row">
        <ProfileInfo />
        <Repos />
        <Spinner />
      </div>
    </div>
  );
};
