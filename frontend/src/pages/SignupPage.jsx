import { FaGithub, FaUnlockAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { handleLoginWithGithub } from '../lib/functions';

const SignUpPage = () => {
  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
      <div className="bg-glass w-full rounded-lg shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-center text-xl font-bold md:text-2xl">
            Create Account
          </h1>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#24292F] p-2 text-center font-medium text-white hover:bg-[#24292F]/90 focus:ring-4 focus:ring-[#24292F]/50"
            onClick={handleLoginWithGithub}
          >
            <FaGithub className="h-5 w-5" />
            Sign up with Github
          </button>
          <p className="text-gray-300">
            By signing up, you will unlock all the features of the app.
            <span>
              <FaUnlockAlt className="mx-2 inline h-4 w-4" />
            </span>
          </p>
          <p className="text-sm font-light text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
