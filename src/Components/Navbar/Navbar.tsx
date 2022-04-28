import { FC, memo, useEffect, useState } from "react";
import Logo from "../Logo";
import { GiHamburgerMenu } from "react-icons/gi";
import Navlist from "./Navlist";
import { Transition } from "@headlessui/react";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  return (
    <nav className="border-gray-200 z-10 px-2 sm:px-4 py-2.5  bg-gray-800 w-full">
      <div className="flex flex-col flex-wrap items-center justify-between w-full mx-auto md:container sm:flex-row">
        <div className={`flex items-center justify-between w-full md:w-auto`}>
          <Logo type="CodeYogiLogoEnglishWhite" size="lg" allowRedirect={false} />

          <button
            data-collapse-toggle="mobile-menu"
            type="button"
            className="inline-flex items-center p-2 m-3 text-sm text-gray-400 rounded-lg md:hidden focus:outline-none focus:ring-2 hover:bg-gray-700 focus:ring-gray-600"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() => {
              setIsMenuOpen((isOpen) => !isOpen);
            }}
          >
            <span className="sr-only">Open main menu</span>

            <GiHamburgerMenu className={`h-8 w-8 `} />
          </button>
        </div>

        <div className={`hidden w-full md:block md:w-auto`} id="mobile-menu">
          <Navlist />
        </div>

        <div className={`overflow-hidden w-full md:hidden`}>
          <Transition
            className={`w-full  bg-gray-800 border-black`}
            show={isMenuOpen}
            enter="transition-all ease-in duration-200 "
            enterFrom="-translate-y-full opacity-0 "
            enterTo="translate-y-0 opacity-100"
            leave="transition-all ease-in duration-200 "
            leaveFrom="translate-y-0 opactiy-100"
            leaveTo="-translate-y-full opacity-0 "
          >
            <Navlist />
          </Transition>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
