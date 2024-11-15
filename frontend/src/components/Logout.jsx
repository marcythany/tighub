import { MdLogout } from 'react-icons/md';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Importa o Link

const Logout = () => {
  const { authUser, setAuthUser } = useAuthContext();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { credentials: 'include' });
      const data = await res.json();
      console.log(data);
      setAuthUser(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Link envolvê a imagem do usuário */}
      <Link to="/profile">
        <img
          src={authUser?.avatarUrl}
          className="h-10 w-10 rounded-full border border-gray-800"
          alt="User Avatar"
        />
      </Link>

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
