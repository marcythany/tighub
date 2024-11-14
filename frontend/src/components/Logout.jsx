import { MdLogout } from 'react-icons/md';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Logout = () => {
  // Desestruture authUser e setAuthUser diretamente no componente
  const { authUser, setAuthUser } = useAuthContext();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { credentials: 'include' });
      const data = await res.json();
      console.log(data);
      setAuthUser(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <img
        src={authUser?.avatarUrl}
        className="h-10 w-10 rounded-full border border-gray-800"
        alt="User Avatar"
      />

      <div
        className="bg-glass mt-auto flex cursor-pointer items-center rounded-lg border border-gray-800 p-2"
        onClick={handleLogout}
      >
        <MdLogout size={22} />
      </div>
    </>
  );
};

export default Logout;
