import { FC, memo, useContext } from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "../../APIs/auth.api";
import { NAVBAR_NAMES, ROUTE_PROFILE } from "../../constants.routes";
import { allowedRoutesContext } from "../../Contexts/allowedRoutes.context";
import { userContext } from "../../Contexts/user.contextt";

interface NavlistProps {}

const Navlist: FC<NavlistProps> = ({}) => {
  const { allowedRoutes } = useContext(allowedRoutesContext);
  const { user } = useContext(userContext);

  return (
    <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
      {allowedRoutes.map((route) => {
        return (
          <NavLink
            to={route}
            className={({ isActive }) =>
              `block py-2 pl-3 pr-4 ${
                isActive
                  ? "border-b md:text-white bg-gray-700 text-white md:bg-transparent w-30 border-gray-700 md:border-0 md:p-0"
                  : "text-gray-400 border-b border-gray-700 md:border-0 md:p-0 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent w-30"
              }`
            }
          >
            {NAVBAR_NAMES[route] && NAVBAR_NAMES[route]}
          </NavLink>
        );
      })}

      {user && (
        <button
          onClick={async () => {
            await signOut();
            window.location.reload();
          }}
          className="block text-left py-2 pl-3 pr-4 text-red-400 border-b border-gray-700 md:border-0 md:p-0 md:hover:text-red-600 hover:bg-gray-700 hover:text-red-600 md:hover:bg-transparent w-30"
        >
          Logout
        </button>
      )}
    </ul>
  );
};

export default memo(Navlist);
