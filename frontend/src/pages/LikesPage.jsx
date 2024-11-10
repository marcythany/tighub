import { FaHeart } from 'react-icons/fa';

const LikesPage = () => {
  return (
    <div className="relative overflow-x-auto rounded-lg px-4 shadow-md">
      <table className="bg-glass w-full overflow-hidden text-left text-sm rtl:text-right">
        <thead className="bg-glass text-xs uppercase">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">No</div>
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-glass border-b">
            <td className="w-4 p-4">
              <div className="flex items-center">
                <span>1</span>
              </div>
            </td>
            <th
              scope="row"
              className="flex items-center whitespace-nowrap px-6 py-4"
            >
              <img
                className="h-10 w-10 rounded-full"
                src={
                  'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'
                }
                alt="Jese image"
              />
              <div className="ps-3">
                <div className="text-base font-semibold">dasdas</div>
              </div>
            </th>
            <td className="px-6 py-4">das</td>
            <td className="px-6 py-4">
              <div className="flex items-center">
                <FaHeart size={22} className="mx-2 text-red-500" />
                Liked your profile
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
