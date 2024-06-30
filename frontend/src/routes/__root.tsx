import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { type QueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import React, { useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import logo from "@public/logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotebookPen, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewNav from "@/components/NewNav";
import { Toaster } from "sonner";
interface MyRouterContext {
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (e) {
      console.error(e);
      return { user: null };
    }
  },
  component: Root,
});

function NavBar() {
  const { user } = Route.useRouteContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <NewNav />
      <Toaster richColors />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}

const Login = () => {
  return (
    <Button className="font-nunito font-bold text-xl antialiased">
      <a href="/api/login">Login</a>
    </Button>
  );
};
