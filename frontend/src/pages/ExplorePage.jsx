import { useState } from 'react';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import Repos from '../components/Repos';

const ExplorePage = () => {
  //
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const exploreRepos = async (language) => {
    setLoading(true);
    setRepos([]);
    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (!token) {
        console.warn('GitHub token não encontrado');
      }
      const res = await fetch(
        `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await res.json();
      setRepos(data.items);
      setSelectedLanguage(language);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
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
            onClick={() => exploreRepos('javascript')}
          />
          <img
            src="/typescript.svg"
            alt="TypeScript logo"
            className="h-11 cursor-pointer sm:h-20"
            onClick={() => exploreRepos('typescript')}
          />
          <img
            src="/c++.svg"
            alt="C++ logo"
            className="h-11 cursor-pointer sm:h-20"
            onClick={() => exploreRepos('c++')}
          />
          <img
            src="/python.svg"
            alt="Python logo"
            className="h-11 cursor-pointer sm:h-20"
            onClick={() => exploreRepos('python')}
          />
          <img
            src="/java.svg"
            alt="Java logo"
            className="h-11 cursor-pointer sm:h-20"
            onClick={() => exploreRepos('java')}
          />
        </div>
        {repos.length > 0 && (
          <h2 className="my-4 text-center text-lg font-semibold">
            <span className="me-2 rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800">
              {selectedLanguage.toUpperCase()}{' '}
            </span>
            Repositórios
          </h2>
        )}
        {!loading && repos.length > 0 && (
          <Repos repos={repos} alwaysFullWidth />
        )}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default ExplorePage;
