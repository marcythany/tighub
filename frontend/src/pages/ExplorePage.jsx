const ExplorePage = () => {
  return (
    <div className="px-4">
      <div className="bg-glass mx-auto max-w-2xl rounded-md p-4">
        <h1 className="text-center text-xl font-bold">
          Explore Popular Repositories
        </h1>
        <div className="my-2 flex flex-wrap justify-center gap-2">
          <img
            src="/javascript.svg"
            alt="JavaScript"
            className="h-11 cursor-pointer sm:h-20"
          />
          <img
            src="/typescript.svg"
            alt="TypeScript logo"
            className="h-11 cursor-pointer sm:h-20"
          />
          <img
            src="/c++.svg"
            alt="C++ logo"
            className="h-11 cursor-pointer sm:h-20"
          />
          <img
            src="/python.svg"
            alt="Python logo"
            className="h-11 cursor-pointer sm:h-20"
          />
          <img
            src="/java.svg"
            alt="Java logo"
            className="h-11 cursor-pointer sm:h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
