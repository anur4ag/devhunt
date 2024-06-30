import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Link } from "@tanstack/react-router";
import logo from "@public/logo.svg";
import { NotebookPen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";

function NavBar() {
  const { data, isPending, error } = useQuery(userQueryOptions);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (isPending) return <NavWithouthUser />;
  if (error) return;
  const { user } = data;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <MaxWidthWrapper className="font-nunito antialiased">
      <nav className="flex flex-wrap items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Devhunt Logo"
            className="max-h-[50px] max-w-[50px]"
          />
          <p className="text-3xl font-extrabold tracking-tight">Devhunt</p>
        </Link>

        {user ? (
          <>
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div
              className={`${isMenuOpen ? "block" : "hidden"} w-full lg:flex lg:w-auto lg:items-center mt-4 lg:mt-0 flex justify-center items-center gap-4`}
            >
              <Link
                to="/OrganizeHackathon"
                className="flex items-center gap-2 hover:text-muted-foreground [&.active]:text-black [&.active]:font-bold"
              >
                <NotebookPen />
                <span>Organize?</span>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={user?.picture || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <p className="font-bold text-xl cursor-pointer">
                      {user?.given_name}
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Logout?</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <a href="/api/logout" className="w-full">
                        <Button className="w-full" variant="destructive">
                          Logout
                        </Button>
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        ) : (
          <Login />
        )}
      </nav>
    </MaxWidthWrapper>
  );
}

const NavWithouthUser = () => {
  return (
    <MaxWidthWrapper className="font-nunito antialiased">
      <nav className="flex flex-wrap items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Devhunt Logo"
            className="max-h-[50px] max-w-[50px]"
          />
          <p className="text-3xl font-extrabold tracking-tight">Devhunt</p>
        </Link>
        <Login />
      </nav>
    </MaxWidthWrapper>
  );
};

const Login = () => {
  return (
    <Button className="font-nunito font-bold text-xl antialiased">
      <a href="/api/login">Login</a>
    </Button>
  );
};

export default NavBar;
