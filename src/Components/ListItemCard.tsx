import MDEditor from "@uiw/react-md-editor";
import { FC, LiHTMLAttributes, memo, ReactElement } from "react";
import { Link } from "react-router-dom";
import { ListItemCardButtonProps } from "./ListItemCardButton";

interface ListItemCardProps extends LiHTMLAttributes<HTMLLIElement> {
  heading: string;
  subheading: string;
  date: string;
  indicator: string;
  indicatorLink: string;
  details: string;
  markdown?: boolean;
  children?: ReactElement<ListItemCardButtonProps>[] | ReactElement<ListItemCardButtonProps>;
  className?: string;
}

export const ListItemCard: FC<ListItemCardProps> = ({
  heading,
  subheading,
  date,
  indicator,
  details,
  children,
  indicatorLink,
  markdown,
  className,
  ...rest
}) => {
  return (
    <li className={`${className} border-2 border-gray-100 bg-white rounded-lg shadow-lg list-none`} {...rest}>
      <div className="flex items-center justify-between w-full p-3 space-x-6">
        <div className="flex-1">
          <div className="flex flex-col justify-between sm:items-center sm:flex-row">
            <div className={`mb-2 sm:mb-0`}>
              <h3 className="font-medium text-gray-900 truncate">
                {heading} &nbsp; <span className="text-gray-500">{date}</span>
              </h3>
              <p className="mt-1 text-sm text-gray-500 truncate">{subheading}</p>
            </div>
            {indicator && (
              <Link to={indicatorLink} className="p-1 px-2 text-sm font-semibold text-white bg-indigo-600 rounded-full max-w-max">
                {indicator}
              </Link>
            )}
          </div>

          {markdown ? (
            <MDEditor.Markdown className={`flex-shrink-0 inline-block mt-3 p-1 py-2 text-sm font-medium`} source={details} />
          ) : (
            <div className={`flex-shrink-0 inline-block mt-3 p-1 py-2 text-sm font-medium`}>{details}</div>
          )}
        </div>
      </div>

      <div className="flex justify-center divide-x divide-gray-200">{children}</div>
    </li>
  );
};

export default memo(ListItemCard);
