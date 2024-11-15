import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/functions';

const LikesPage = () => {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const getLikes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/likes`, { credentials: 'include' });
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        // Verifica se há um campo 'likedProfiles' na resposta
        if (Array.isArray(data.likedProfiles)) {
          // Filtra os usuários válidos e adiciona o campo likedDate
          setLikes(
            data.likedProfiles
              .filter((user) => user && user.username)
              .map((user) => ({
                ...user,
                likedDate:
                  user.likedBy && user.likedBy[0] && user.likedBy[0].likedDate
                    ? formatDate(user.likedBy[0].likedDate) // Agora diretamente utiliza o likedDate no formato ISO
                    : 'Data não disponível',
              })),
          );
        } else {
          throw new Error('Formato de dados incorreto');
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getLikes();
  }, []);

  return (
    <div className="relative overflow-x-auto rounded-lg px-4 shadow-md">
      <table className="bg-glass w-full overflow-hidden text-left text-sm rtl:text-right">
        <thead className="bg-glass text-xs uppercase">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">Núm.</div>
            </th>
            <th scope="col" className="px-6 py-3">
              Nome do usuário
            </th>
            <th scope="col" className="px-6 py-3">
              Curtido quando?
            </th>
            <th scope="col" className="px-6 py-3">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {likes.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                Nenhum like encontrado.
              </td>
            </tr>
          ) : (
            likes.map((user, idx) => (
              <tr className="bg-glass border-b" key={user.username}>
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <span>{idx + 1}</span>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center whitespace-nowrap px-6 py-4"
                >
                  <a
                    href={user.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.avatarUrl}
                      alt="User Avatar"
                    />
                  </a>
                  <div className="ps-3">
                    <a
                      href={user.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold"
                    >
                      {user.username}
                    </a>
                  </div>
                </th>
                <td className="px-6 py-4">
                  {user.likedDate || 'Data não disponível'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaHeart size={22} className="mx-2 text-red-500" />
                    Curtido
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LikesPage;
