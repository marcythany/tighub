import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import githubAPI from '../api/github';

import Search from '../components/Search';
import SortRepos from '../components/SortRepos';
import ProfileInfo from '../components/ProfileInfo';
import Repos from '../components/Repos';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState('recent');

  const getUserProfileAndRepos = useCallback(
    async (username = 'marcythany') => {
      setLoading(true);
      try {
        // Utilizando a instância do githubAPI para fazer as requisições
        const userProfile = await githubAPI.getUser(username);
        setUserProfile(userProfile);

        // Buscando os repositórios do usuário
        const repos = await githubAPI.getUserRepositories(username);

        // Mantendo a ordenação padrão por data de criação
        const sortedRepos = [...repos].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        setRepos(sortedRepos);

        return { userProfile, repos: sortedRepos };
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        toast.error(error.message || 'Erro ao buscar dados do GitHub');
        return { userProfile: null, repos: [] };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    getUserProfileAndRepos();
  }, [getUserProfileAndRepos]);

  const onSearch = async (e, username) => {
    e.preventDefault();

    try {
      setLoading(true);
      setRepos([]);
      setUserProfile(null);

      const { userProfile, repos } = await getUserProfileAndRepos(username);

      if (userProfile) setUserProfile(userProfile);
      if (repos) setRepos(repos);
    } catch (error) {
      toast.error('Erro ao buscar usuário');
    } finally {
      setLoading(false);
    }
  };

  const onSort = (sortType) => {
    const sortedRepos = [...repos];

    if (sortType === 'recent') {
      sortedRepos.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    } else if (sortType === 'stars') {
      sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortType === 'forks') {
      sortedRepos.sort((a, b) => b.forks_count - a.forks_count);
    }

    setSortType(sortType);
    setRepos(sortedRepos);
  };

  // Função para limpar o cache quando necessário
  const clearCache = useCallback(() => {
    githubAPI.clearCache();
    toast.success('Cache limpo com sucesso!');
  }, []);

  return (
    <div className="m-4">
      <Search onSearch={onSearch} />
      {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
      <div className="flex flex-col items-start justify-center gap-4 lg:flex-row">
        {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
        {repos.length > 0 && !loading && <Repos repos={repos} />}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default HomePage;
