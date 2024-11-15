import { useAuthContext } from '../context/AuthContext';

const Logout = () => {
  const { user, signout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div
      className="bg-glass mt-auto flex cursor-pointer items-center rounded-lg border border-gray-800 p-2"
      onClick={handleLogout}
    >
      <img
        src={user?.image}
        className="h-10 w-10 rounded-full border border-gray-800"
        alt="User Avatar"
      />
    </div>
  );
};

export default Logout;
