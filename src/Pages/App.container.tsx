import { FC, memo } from "react";

interface AppContainerProps {}

const AppContainer: FC<AppContainerProps> = () => {
  return (
    <div>
    </div>
  );
};

AppContainer.defaultProps = {};

export default memo(AppContainer);
