import { Outlet, createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
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
  component: Component,
});

function Component() {
  const { user } = Route.useRouteContext();
  if (!user) return <Login />;
  return <Outlet />;
}
const Login = () => {
  return (
    <Button>
      <a href="/api/login">Login!</a>
    </Button>
  );
};
