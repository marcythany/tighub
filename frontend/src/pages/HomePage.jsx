import { useState, useEffect } from 'react';

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

  const getUserProfileAndRepos = async () => {
    try {
    } catch (error) {}
  };

  useEffect(() => {
    getUserProfileAndRepos();
  }, [sortType]);

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
