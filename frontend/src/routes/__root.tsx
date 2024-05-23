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
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="max-h-[50px] max-w-[50px]" />
          <p className="text-3xl font-extrabold tracking-tight pe-4">Devhunt</p>
          <Link
            to="/"
            className="[&.active]:text-black [&.active]:font-bold text-xl font-semibold text-muted-foreground"
          >
            Home
          </Link>{" "}
          <Link
            to="/hackathons"
            className="[&.active]:text-black [&.active]:font-bold text-xl font-semibold text-muted-foreground"
          >
            Hackathon
          </Link>
        </div>
        {user ? (
          <div className="flex items-center gap-2">
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
            <p className="font-bold text-xl">{user?.given_name}</p>
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
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

const Login = () => {
  return (
    <Button className="font-nunito font-bold text-xl antialiased">
      <a href="/api/login">Login!</a>
    </Button>
  );
};
