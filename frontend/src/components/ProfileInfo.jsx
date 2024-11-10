import { IoLocationOutline } from 'react-icons/io5';
import {
  RiGitRepositoryFill,
  RiUserFollowFill,
  RiUserFollowLine,
} from 'react-icons/ri';
import { FaXTwitter } from 'react-icons/fa6';
import { TfiThought } from 'react-icons/tfi';
import { FaEye } from 'react-icons/fa';

const ProfileInfo = () => {
  const userProfile = {
    avatar_url:
      'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745',
    bio: '👨🏻‍💻👨🏻‍💻👨🏻‍💻',
    email: 'johndoe@gmail.com',
    followers: 100,
    following: 200,
    html_url: 'https://github.com/burakorkmez',
    location: 'Somewhere, Earth',
    name: 'John Doe',
    public_gists: 100,
    public_repos: 100,
    twitter_username: 'johndoe',
    login: 'johndoe',
  };

  return (
    <div className="flex w-full flex-col gap-2 md:sticky md:top-10 lg:w-1/3">
      <div className="bg-glass rounded-lg p-4">
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <a href={userProfile?.html_url} target="_blank" rel="noreferrer">
            <img
              src={userProfile?.avatar_url}
              className="mb-2 h-24 w-24 rounded-md"
              alt=""
            />
          </a>
          {/* View on Github */}
          <div className="flex flex-col items-center gap-2">
            <a
              href={userProfile.html_url}
              target="_blank"
              rel="noreferrer"
              className="bg-glass flex w-full cursor-pointer items-center gap-2 rounded-md border border-blue-400 p-2 text-xs font-medium"
            >
              <FaEye size={16} />
              View on Github
            </a>
          </div>
        </div>

        {/* User Bio */}
        {userProfile?.bio ? (
          <div className="flex items-center gap-2">
            <TfiThought />
            <p className="text-sm">{userProfile?.bio.substring(0, 60)}...</p>
          </div>
        ) : null}

        {/* Location */}
        {userProfile?.location ? (
          <div className="flex items-center gap-2">
            <IoLocationOutline />
            {userProfile?.location}
          </div>
        ) : null}

        {/* Twitter Username */}
        {userProfile?.twitter_username ? (
          <a
            href={`https://twitter.com/${userProfile.twitter_username}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-sky-500"
          >
            <FaXTwitter />
            {userProfile?.twitter_username}
          </a>
        ) : null}

        {/* Member Since Date */}
        <div className="my-2">
          <p className="text-sm font-bold text-gray-600">Member since</p>
          <p className="">21 Sep, 2023</p>
        </div>

        {/* Email Address */}
        {userProfile?.email && (
          <div className="my-2">
            <p className="text-sm font-bold text-gray-600">Email address</p>
            <p className="">{userProfile.email}</p>
          </div>
        )}

        {/* Full Name */}
        {userProfile?.name && (
          <div className="my-2">
            <p className="text-sm font-bold text-gray-600">Full name</p>
            <p className="">{userProfile?.name}</p>
          </div>
        )}

        {/* Username */}
        <div className="my-2">
          <p className="text-sm font-bold text-gray-600">Username</p>
          <p className="">{userProfile?.login}</p>
        </div>
      </div>

      <div className="mx-4 flex flex-wrap gap-2">
        {/* Followers Count */}
        <div className="bg-glass flex min-w-24 flex-1 items-center gap-2 rounded-lg p-2">
          <RiUserFollowFill className="h-5 w-5 text-blue-800" />
          <p className="text-xs">Followers: {userProfile?.followers}</p>
        </div>

        {/* Following count */}
        <div className="bg-glass flex min-w-24 flex-1 items-center gap-2 rounded-lg p-2">
          <RiUserFollowLine className="h-5 w-5 text-blue-800" />
          <p className="text-xs">Following: {userProfile?.following}</p>
        </div>

        {/* Number of public repos */}
        <div className="bg-glass flex min-w-24 flex-1 items-center gap-2 rounded-lg p-2">
          <RiGitRepositoryFill className="h-5 w-5 text-blue-800" />
          <p className="text-xs">Public repos: {userProfile?.public_repos}</p>
        </div>

        {/* Number of public gists */}
        <div className="bg-glass flex min-w-24 flex-1 items-center gap-2 rounded-lg p-2">
          <RiGitRepositoryFill className="h-5 w-5 text-blue-800" />
          <p className="text-xs">Public gists: {userProfile?.public_gists}</p>
        </div>
      </div>
    </div>
  );
};
