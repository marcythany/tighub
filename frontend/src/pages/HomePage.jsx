import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import Search from '../components/Search';
import SortRepos from '../components/SortRepos';
import ProfileInfo from '../components/ProfileInfo';
import Repos from '../components/Repos';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortType, setSortType] = useState('forks');
  const user = true;

  const getUserProfileAndRepos = useCallback(async () => {
    setLoading(true);
    try {
      const userRes = await fetch('https://api.github.com/users/marcythany');
      const userProfile = await userRes.json();
      setUserProfile(userProfile);

      const reposRes = await fetch(userProfile.repos_url);
      const repos = await reposRes.json();
      setRepos(repos);
      console.log('userProfile:', userProfile);
      console.log('repos:', repos);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfileAndRepos();
  }, [getUserProfileAndRepos]);

  return (
    <div className="m-4">
      <Search />
      <SortRepos />
      <div className="flex flex-col items-start justify-center gap-4 lg:flex-row">
        <ProfileInfo userProfile={userProfile} />
        <Repos />
        <Spinner />
      </div>
    </div>
  );
};

export default HomePage;
