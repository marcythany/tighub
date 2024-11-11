import Repo from './Repo';

const Repos = ({ repos }) => {
  return (
    <div className={`bg-glass w-full rounded-lg px-8 py-6 lg:w-2/3`}>
      <ol className="relative border-s border-gray-200">
        {repos.map((repo) => (
          <Repo key={repo.id} repo={repo} />
        ))}
        {repos.legth === 0 && (
          <p className="flex h-32 items-center justify-center">
            Nenhum repositório encontrado
          </p>
        )}
      </ol>
    </div>
  );
};

export default Repos;
