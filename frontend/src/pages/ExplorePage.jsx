import { useState } from 'react';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import Repos from '../components/Repos';
import IconComponent, { TECH_ICONS } from '../components/IconComponent';

// Lista de linguagens válidas para pesquisa
const VALID_LANGUAGES = [
  'javascript',
  'python',
  'java',
  'c++',
  'typescript',
  'go',
  'html',
  'css',
  'ruby',
  'php',
  'rust',
  'kotlin',
  'dart',
  'scala',
  'r',
  'perl',
  'haskell',
  'lua',
  'shell',
  'powershell',
  'sql',
];

const ExplorePage = () => {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]); // Repositórios com dados e ícones
  const [selected, setSelected] = useState(null); // Estado para a tecnologia selecionada
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const exploreRepos = async (language) => {
    setLoading(true);
    setRepos([]); // Limpa os repositórios ao buscar novos

    // Verificar se a linguagem é válida
    if (!VALID_LANGUAGES.includes(language.toLowerCase())) {
      toast.error(`A linguagem "${language}" não é válida para pesquisa.`);
      setLoading(false);
      return;
    }

    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN; // Obtém o token do GitHub do ambiente
      if (!token) {
        console.warn('GitHub token não encontrado');
      }
      const res = await fetch(
        `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await res.json();

      // Adiciona o ícone para cada repositório baseado na linguagem
      const reposWithIcons = data.items.map((repo) => {
        const language = repo.language;
        const techIcon = language ? TECH_ICONS[language] : null; // Procura o ícone correspondente à linguagem
        return {
          ...repo,
          techIcon, // Adiciona o ícone ao repositório
        };
      });

      setRepos(reposWithIcons);
      setSelectedLanguage(language);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (tech) => {
    setSelected(tech); // Define a tecnologia selecionada
    exploreRepos(tech.toLowerCase()); // Pesquisa repositórios dessa tecnologia
  };

  return (
    <div className="px-4">
      <div className="bg-glass mx-auto max-w-2xl rounded-md p-4">
        <h1 className="text-center text-xl font-bold">
          Explore Popular Repositories
        </h1>
        <div className="my-2 flex flex-wrap justify-center gap-2">
          {Object.keys(TECH_ICONS).map((tech) => (
            <button
              key={tech}
              onClick={() => onSelect(tech)} // Chama onSelect ao clicar
              className={`flex items-center gap-2 rounded p-2 ${
                selected === tech ? 'bg-gray-500/20 text-white' : 'bg-blue-900'
              }`}
            >
              <IconComponent name={tech} size={16} />
              <span className="text-sm">{tech}</span>
            </button>
          ))}
        </div>
        {repos && repos.length > 0 && (
          <h2 className="my-4 text-center text-lg font-semibold">
            <span className="me-2 rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800">
              {selectedLanguage ? selectedLanguage.toUpperCase() : 'ALL'}{' '}
            </span>
            Repositories
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
