import { FC, memo } from "react";
import { FaSpinner } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";

export interface ListItemCardButtonProps {
  type: "link" | "button";
  children: string;
  onClick?: () => void;
  Icon?: IconType;
  className?: string;
  iconClassName?: string;
  to?: string;
  isLoading?: boolean;
}

const ListItemCardButton: FC<ListItemCardButtonProps> = ({ type, children, onClick, Icon, className, iconClassName, to, isLoading }) => {
  return (
    <div className="flex flex-1 px-2 sm:px-8">
      {type === "link" ? (
        <Link
          to={to || "#"}
          className={`relative inline-flex items-center justify-center flex-1 py-4 text-sm font-medium text-gray-500 border border-transparent rounded-br-lg hover:text-gray-700 ${className}`}
        >
          {Icon && <Icon className="w-4 h-4 sm:w-6 sm:h-6" aria-hidden="true" />}

          <span className="ml-1 sm:ml-3">{children}</span>
        </Link>
      ) : (
        <button
          className={`relative inline-flex items-center justify-center flex-1 py-4 text-sm font-medium text-gray-500 border border-transparent rounded-br-lg hover:text-gray-700 ${className}`}
          onClick={onClick}
        >
          {Icon && <Icon className={`w-4 h-4 sm:w-6 sm:h-6  ${iconClassName}`} aria-hidden="true" />}

          <span className="ml-1 sm:ml-3">{isLoading ? <FaSpinner className={`animate-spin text-black w-5 h-5 mx-auto`} /> : children}</span>
        </button>
      )}
    </div>
  );
};

export default memo(ListItemCardButton);
