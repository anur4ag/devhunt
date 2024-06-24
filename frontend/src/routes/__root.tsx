import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { type QueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import logo from "@public/logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotebookPen } from "lucide-react";
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
  return (
    <div className="py-4 gap-2 font-nunito antialiased">
      <MaxWidthWrapper className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className="max-h-[50px] max-w-[50px]" />
          <p className="text-3xl font-extrabold tracking-tight pe-4">Devhunt</p>
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-2 ml-8 ">
              <NotebookPen />
              <Link
                to="/OrganizeHackathon"
                className="hover:text-muted-foreground [&.active]:text-black [&.active]:font-bold"
              >
                organize?
              </Link>
            </div>
            <Avatar>
              <AvatarImage
                src={
                  user?.picture
                    ? user?.picture
                    : "https://github.com/shadcn.png"
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <p className="font-bold text-xl cursor-pointer">
                  {user?.given_name}
                </p>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="ms-8">
                <DropdownMenuLabel>Logout?</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full">
                  <a href="/api/logout" className="w-full">
                    <Button className="w-full" variant={"destructive"}>
                      Logout
                    </Button>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Login />
        )}
      </MaxWidthWrapper>
    </div>
  );
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <NewNav />
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools />
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
