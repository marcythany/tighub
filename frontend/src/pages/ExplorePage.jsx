import { useState } from 'react';
import toast from 'react-hot-toast';
import githubAPI from '../api/github';
import Spinner from '../components/Spinner';
import Repos from '../components/Repos';
import IconComponent, { TECH_ICONS } from '../components/IconComponent';

// Lista de linguagens válidas para pesquisa
const VALID_LANGUAGES = [
  'javascript',
  'python',
  'java',
  'c++',
  'c#',
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
  'julia',
  'lua',
  'shell',
  'swift',
  'powershell',
  'sql',
];

const ExplorePage = () => {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const exploreRepos = async (language) => {
    // Validação inicial da linguagem
    if (!VALID_LANGUAGES.includes(language.toLowerCase())) {
      toast.error(`A linguagem "${language}" não é válida para pesquisa.`);
      return;
    }

    setLoading(true);
    setRepos([]);

    try {
      // Usando o módulo githubAPI para buscar os repositórios
      const repositories = await githubAPI.getRepositories(language);

      // Adiciona os ícones aos repositórios
      const reposWithIcons = repositories.map((repo) => ({
        ...repo,
        techIcon: repo.language ? TECH_ICONS[repo.language] : null,
      }));

      setRepos(reposWithIcons);
      setSelectedLanguage(language);
    } catch (error) {
      console.error('Error exploring repositories:', error);
      toast.error(error.message || 'Erro ao buscar repositórios');
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (tech) => {
    setSelected(tech);
    exploreRepos(tech.toLowerCase());
  };

  // Função para limpar o cache dos repositórios
  const clearReposCache = () => {
    githubAPI.clearCache();
    toast.success('Cache de repositórios limpo!');
  };

  // Função para atualizar os repositórios atuais
  const refreshCurrentLanguage = async () => {
    if (selectedLanguage) {
      clearReposCache();
      await exploreRepos(selectedLanguage);
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
