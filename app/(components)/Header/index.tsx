"use client";

// Next
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

// UI
import { Avatar, Spinner } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const notShowBtnLoginRegisterInPaths = ["/login", "/register"];

const Header = ({ activePath }: { activePath: string }) => {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="top-0 fixed bg-white  h-12 w-full text-black border-b-2 border-blue-900 z-30">
      <nav className="w-full h-full flex justify-between items-center py-1 pl-3 pr-10">
        <div>
          <Link href="/" className="h-full flex justify-center items-center">
            <Image
              className="object-contain w-[200px] h-[30px]"
              alt="k+n logo"
              src="/kuehnenagellogoblue-4@2x.png"
              width="0"
              height="0"
              sizes="200px, 30px"
            />
          </Link>
        </div>
        <div className=" justify-between items-center w-full lg:flex lg:w-auto">
          {!notShowBtnLoginRegisterInPaths.includes(activePath) && user && (
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {/* <li>
                <Link
                  href="/"
                  className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                  aria-current="page"
                >
                  Dashboard
                </Link>
              </li> */}
              <li className="flex flex-row gap-4">
                <Link
                  href="/"
                  aria-current="page"
                  className="text-sm block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                >
                  Produtividade
                </Link>
                <Link
                  href="/planning"
                  aria-current="page"
                  className="text-sm block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                >
                  Planejamento
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/scale"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Escala
                </Link>
              </li> */}
            </ul>
          )}
        </div>
        <ul className="flex items-center gap-4">
          {!notShowBtnLoginRegisterInPaths.includes(activePath) &&
            status === "loading" && (
              <li className="pr-6">
                <Spinner size="sm" classNames={{}} />
              </li>
            )}
          {!user &&
            !notShowBtnLoginRegisterInPaths.includes(activePath) &&
            status !== "loading" && (
              <>
                <li>
                  <Link href="/login" className="text-ct-dark-600">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-ct-dark-600">
                    Register
                  </Link>
                </li>
              </>
            )}
          {user && status !== "loading" && (
            <>
              <li>
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="gap-3" variant="light">
                      <Avatar
                        className="h-7 w-7"
                        showFallback
                        src={user.image || ""}
                      />
                      <div className="flex flex-col justify-start text-left">
                        <p className="capitalize font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem key="profile">Profile</DropdownItem>
                    <DropdownItem
                      key="signout"
                      className="text-danger"
                      color="danger"
                      onClick={() => signOut()}
                    >
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
