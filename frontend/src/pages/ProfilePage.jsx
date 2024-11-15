import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Supondo que o AuthContext forneça o authUser
import toast from 'react-hot-toast';
import ProfileInfo from '../components/ProfileInfo';

const ProfilePage = () => {
  const { authUser } = useContext(AuthContext); // Pega o authUser do contexto
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função que faz a requisição para pegar o perfil do usuário
  const fetchUserProfile = async (username) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/${username}`, {
        credentials: 'include', // Garantir que o cookie da sessão é enviado
      });

      if (!res.ok) {
        throw new Error('Erro ao carregar os dados do perfil');
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Verifica se os dados recebidos têm a estrutura esperada
      setUserProfile(data.userProfile); // Atualiza o estado com os dados do perfil
    } catch (error) {
      console.error('Erro ao carregar o perfil:', error);
      setError(error.message);
      toast.error(error.message); // Exibe o erro
    } finally {
      setLoading(false);
    }
  };

  // Effect que observa mudanças no authUser
  useEffect(() => {
    if (authUser) {
      let username = '';

      if (typeof authUser === 'object') {
        console.log(
          'authUser parece ser um objeto, tentando extrair o username...',
        );
        username = authUser.username || authUser.name; // Acessa a propriedade correta
        console.log('Username extraído:', username);
      } else {
        username = authUser;
      }

      // Valida se o username é válido antes de buscar os dados
      if (username && username.trim()) {
        fetchUserProfile(username);
      } else {
        setError('O username do usuário é inválido.');
        toast.error('O username do usuário é inválido.');
        setLoading(false); // Finaliza o carregamento mesmo com erro
      }
    }
  }, [authUser]);

  // Exibição durante o carregamento
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>Carregando...</span>
      </div>
    );
  }

  // Exibição de erro caso aconteça algum problema
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>{`Erro ao carregar perfil: ${error}`}</span>
      </div>
    );
  }

  // Exibição do perfil do usuário
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-8">
      {userProfile ? (
        <ProfileInfo userProfile={userProfile} />
      ) : (
        <div>Perfil não encontrado</div>
      )}
    </div>
  );
};

export default ProfilePage;
