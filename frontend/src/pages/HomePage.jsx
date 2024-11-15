import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação entre páginas
import toast from 'react-hot-toast';

import { AuthContext } from '../context/AuthContext'; // Para pegar o authUser
import Search from '../components/Search';
import SortRepos from '../components/SortRepos';
import ProfileInfo from '../components/ProfileInfo';
import Repos from '../components/Repos';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const { authUser } = useContext(AuthContext); // Pegando o authUser
  const navigate = useNavigate(); // Hook para navegação
  const [userProfile, setUserProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState('recent');

  const getUserProfileAndRepos = useCallback(async (username) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${username}`,
      );

      if (!res.ok) {
        throw new Error('Erro ao buscar dados do GitHub');
      }

      const data = await res.json();
      const { repos, userProfile } = data;

      if (!Array.isArray(repos)) {
        console.error('Repos não é um array:', repos);
        throw new Error('A resposta da API não contém repositórios válidos');
      }

      setUserProfile(userProfile);

      // Mantendo a ordenação padrão por data de criação
      const sortedRepos = [...repos].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );

      setRepos(sortedRepos);

      return { userProfile, repos: sortedRepos };
    } catch (error) {
      console.error('Erro ao buscar dados do GitHub:', error);
      toast.error(error.message || 'Erro ao buscar dados do GitHub');
      return { userProfile: null, repos: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      // Se o usuário estiver autenticado, usamos o username do authUser
      const username = authUser.username || authUser.name;
      if (username) {
        getUserProfileAndRepos(username);
      } else {
        toast.error('Usuário não autenticado corretamente');
      }
    } else {
      // Se não estiver autenticado, redireciona para o perfil
      navigate('/profile');
    }
  }, [authUser, navigate, getUserProfileAndRepos]);

  const onSearch = async (e, username) => {
    e.preventDefault();

    setLoading(true);
    setRepos([]);
    setUserProfile(null);

    try {
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
