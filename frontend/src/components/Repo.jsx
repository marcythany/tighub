import { FaCodeBranch, FaCopy, FaRegStar } from 'react-icons/fa';
import { FaCodeFork } from 'react-icons/fa6';

const Repo = () => {
  return (
    <li className="mb-10 ms-7">
      <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
        <FaCodeBranch className="h-5 w-5 text-blue-800" />
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={'https://github.com/burakorkmez/mern-chat-app'}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          mern-chat-app
        </a>
        <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          <FaRegStar /> 167
        </span>
        <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
          <FaCodeFork /> 25
        </span>
        <span className="flex cursor-pointer items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <FaCopy /> Clone
        </span>
      </div>

      <time className="my-1 block text-xs font-normal leading-none text-gray-400">
        Released on Jan 1, 2021
      </time>
      <p className="mb-4 text-base font-normal text-gray-500">
        Real Time Chat App | MERN && Socket.io && JWT
      </p>
      <img
        src={'/javascript.svg'}
        alt="Programming language icon"
        className="h-8"
      />
    </li>
  );
};
