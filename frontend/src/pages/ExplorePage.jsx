import { useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import Repos from '../components/Repos';
import IconComponent, { TECH_ICONS } from '../components/IconComponent';

// Lista de linguagens válidas
const LINGUAGENS_VALIDAS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Swift',
  'C#',
  'Go',
  'HTML',
  'CSS',
  'Ruby',
  'PHP',
  'Rust',
  'Kotlin',
  'Dart',
  'R',
  'Scala',
  'Perl',
  'Haskell',
  'Julia',
  'Lua',
  'Shell',
  'PowerShell',
  'SQL',
];

const ExplorePage = () => {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Função para buscar repositórios populares de uma linguagem específica
  const exploreRepos = async (language) => {
    if (!language || !LINGUAGENS_VALIDAS.includes(language)) {
      toast.error('Nenhuma linguagem válida especificada.');
      return;
    }

    setLoading(true);
    setRepos([]); // Limpa os repositórios ao iniciar uma nova busca

    try {
      // Converte a linguagem para o formato desejado (ex.: minúsculas)
      const formattedLanguage = language.toLowerCase();

      // Faz a chamada para a API do backend
      const res = await fetch(`/api/explore/repos/${formattedLanguage}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao buscar repositórios');
      }

      const result = await res.json();
      console.log('Resposta da API:', result);

      const data = result.repos;

      // Valida a resposta recebida da API
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Nenhum repositório encontrado.');
      }

      // Adiciona os ícones aos repositórios com base na linguagem
      const reposWithIcons = data.map((repo) => {
        const tech = repo.language ? repo.language.trim() : '';
        const formattedTech = tech.charAt(0).toUpperCase() + tech.slice(1); // Capitaliza a primeira letra
        return {
          ...repo,
          techIcon: TECH_ICONS[formattedTech]
            ? TECH_ICONS[formattedTech].icon
            : null,
        };
      });

      setRepos(reposWithIcons);
      setSelectedLanguage(language); // Define a linguagem selecionada
    } catch (error) {
      console.error('Erro ao explorar repositórios:', error);
      toast.error(error.message || 'Erro ao buscar repositórios');
    } finally {
      setLoading(false);
    }
  };

  // Função para selecionar uma tecnologia e buscar repositórios
  const onSelect = (tech) => {
    if (!tech || !LINGUAGENS_VALIDAS.includes(tech)) {
      toast.error('Tecnologia selecionada não é válida.');
      return;
    }

    setSelected(tech);
    exploreRepos(tech); // Chama a API para a linguagem selecionada
  };

  // Função para atualizar os repositórios da linguagem atual
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
          {LINGUAGENS_VALIDAS.map((tech) => (
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
