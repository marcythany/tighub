import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const LikeProfile = ({ userProfile }) => {
  const { authUser } = useAuthContext();
  const [liked, setLiked] = useState(false);

  const isOwnProfile = authUser?.username === userProfile.login;

  useEffect(() => {
    const fetchLikedProfiles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/likes`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        // Verifica se o perfil está na lista de perfis curtidos
        const isLiked = data.likedProfiles.some(
          (profile) => profile.username === userProfile.login,
        );
        setLiked(isLiked);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (authUser) {
      fetchLikedProfiles();
    }
  }, [authUser, userProfile]);

  const handleLikeProfile = async () => {
    try {
      const res = await fetch(`/api/users/like/${userProfile.login}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setLiked((prevLiked) => !prevLiked); // Atualiza o estado de liked
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!authUser || isOwnProfile) return null;

  return (
    <button
      className={`bg-glass flex w-full items-center gap-2 rounded-md border border-blue-400 p-2 text-xs font-medium ${
        liked ? 'text-red-500' : 'text-gray-400'
      }`}
      onClick={handleLikeProfile}
    >
      <FaHeart size={16} /> {liked ? 'Curtido' : 'Curtir o Perfil'}
    </button>
  );
};

export default LikeProfile;
