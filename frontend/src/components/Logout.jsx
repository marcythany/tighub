import { MdLogout } from 'react-icons/md';
// TODO Implement Logout functionality

const Logout = () => {
  return (
    <>
      <img
        src={
          'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'
        }
        className="h-10 w-10 rounded-full border border-gray-800"
      />

      <div className="bg-glass mt-auto flex cursor-pointer items-center rounded-lg border border-gray-800 p-2">
        <MdLogout size={22} />
      </div>
    </>
  );
};
