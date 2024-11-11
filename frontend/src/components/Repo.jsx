import { useState, useEffect } from 'react'; // Import useState e useEffect
import { FaCodeBranch, FaCopy, FaRegStar } from 'react-icons/fa';
import { FaCodeFork } from 'react-icons/fa6';
import { formatDate } from '../utils/functions';
import toast from 'react-hot-toast';
import IconComponent from './IconComponent';
import { TECH_ICONS } from './IconComponent';

const Repo = ({ repo }) => {
  const [languages, setLanguages] = useState([]); // State to store languages of the repo

  const formattedDate = formatDate(repo.created_at);

  // Fetch the languages used in the repo
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repo.full_name}/languages`,
        );
        const data = await response.json();
        // Filter languages that are in TECH_ICONS
        const usedLanguages = Object.keys(data).filter((language) =>
          TECH_ICONS.hasOwnProperty(language),
        );
        setLanguages(usedLanguages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, [repo.full_name]); // Run when repo.full_name changes

  const handlerCloneClick = async (repo) => {
    try {
      await navigator.clipboard.writeText(repo.clone_url);
      toast.success('URL copiada com sucesso!');
    } catch (error) {
      toast.error('Erro ao copiar URL');
    }
  };

  return (
    <li className="mb-10 ms-7">
      <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
        <FaCodeBranch className="h-5 w-5 text-blue-800" />
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          {repo.name}
        </a>
        <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          <FaRegStar /> {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
          <FaCodeFork /> {repo.forks_count}
        </span>
        <span
          onClick={() => handlerCloneClick(repo)}
          className="flex cursor-pointer items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
        >
          <FaCopy /> Clonar
        </span>
      </div>
      <time className="my-1 block text-xs font-normal leading-none text-gray-400">
        Lançado em {formattedDate}
      </time>
      <p className="mb-4 text-base font-normal text-gray-500">
        {repo.description ? repo.description.slice(0, 500) : 'Sem descrição'}
      </p>
      <div className="my-2 flex flex-wrap justify-center gap-2">
        {/* Exibe apenas as linguagens do repositório que estão no TECH_ICONS */}
        {languages.map((tech) => (
          <button
            key={tech}
            className={`flex cursor-auto items-center gap-2 rounded bg-gray-500/20 p-2 text-white`}
          >
            <IconComponent name={tech} size={16} />
            <span className="text-sm">{tech}</span>
          </button>
        ))}
      </div>
    </li>
  );
};

export default Repo;
