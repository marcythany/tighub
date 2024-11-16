import { useAuthContext } from '../context/AuthContext'; // Certifique-se de que este hook está sendo exportado corretamente

const Logout = () => {
  const { user, logout } = useAuthContext(); // Supondo que o hook 'useAuthContext' forneça 'user' e 'logout'

  const handleLogout = async () => {
    try {
      await logout(); // Isso chama a função de logout para deslogar o usuário
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
