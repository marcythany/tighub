import { useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import Repos from '../components/Repos';
import IconComponent, { TECH_ICONS } from '../components/IconComponent';
import { API_URL } from '../lib/functions';

const ExplorePage = () => {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const exploreRepos = async (language) => {
    setLoading(true);
    setRepos([]); // Limpa os repositórios ao iniciar a nova busca

    try {
      // Faz a chamada para a API do seu backend, que irá buscar os repositórios
      const res = await fetch(`/api/explore/repos/${language}`);

      if (!res.ok) {
        throw new Error('Erro ao buscar repositórios');
      }

      const result = await res.json();
      console.log('Resposta da API:', result); // Verifique a resposta no console

      const data = result.data.items; // Acesse data.items em vez de result.items

      // Verifica se os repositórios foram encontrados e se são válidos
      if (
        !Array.isArray(data) ||
        !data.every((repo) => repo.id && repo.name && repo.language)
      ) {
        throw new Error('A resposta da API não contém repositórios válidos');
      }

      // Adiciona os ícones aos repositórios
      const reposWithIcons = data.map((repo) => ({
        ...repo,
        techIcon: repo.language ? TECH_ICONS[repo.language] : null,
      }));

      setRepos(reposWithIcons);
      setSelectedLanguage(language); // Define a linguagem selecionada
    } catch (error) {
      console.error('Erro ao explorar repositórios:', error);
      toast.error(error.message || 'Erro ao buscar repositórios');
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (tech) => {
    setSelected(tech);
    exploreRepos(tech.toLowerCase()); // Chama a API para a linguagem selecionada
  };

  // Função para atualizar os repositórios atuais
  const refreshCurrentLanguage = async () => {
    if (selectedLanguage) {
      await exploreRepos(selectedLanguage); // Refaz a busca com a linguagem atual
    }
  };

  return (
    <div className="px-4">
      <div className="bg-glass mx-auto max-w-2xl rounded-md p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-center text-xl font-bold">
            Explore Repositórios Populares
          </h1>
          {selectedLanguage && (
            <button
              onClick={refreshCurrentLanguage}
              className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
              title="Atualizar repositórios"
            >
              Atualizar
            </button>
          )}
        </div>

        <div className="my-2 flex flex-wrap justify-center gap-2">
          {Object.keys(TECH_ICONS).map((tech) => (
            <button
              key={tech}
              onClick={() => onSelect(tech)}
              className={`flex items-center gap-2 rounded p-2 transition-colors duration-200 ${
                selected === tech
                  ? 'bg-gray-500/20 text-white'
                  : 'bg-blue-900 hover:bg-blue-800'
              }`}
            >
              <IconComponent name={tech} size={16} />
              <span className="text-sm">{tech}</span>
            </button>
          ))}
        </div>

        {repos.length > 0 && (
          <h2 className="my-4 text-center text-lg font-semibold">
            Repositórios{' '}
            <span className="me-2 rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800">
              {selectedLanguage ? selectedLanguage.toUpperCase() : 'ALL'}
            </span>
          </h2>
        )}

        {!loading && repos.length > 0 && (
          <Repos repos={repos} alwaysFullWidth />
        )}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default ExplorePage;
