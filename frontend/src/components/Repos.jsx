import Repo from './Repo';

const Repos = () => {
  return (
    <div className={`bg-glass w-full rounded-lg px-8 py-6 lg:w-2/3`}>
      <ol className="relative border-s border-gray-200">
        <Repo />
        <Repo />
        <Repo />
      </ol>
    </div>
  );
};
