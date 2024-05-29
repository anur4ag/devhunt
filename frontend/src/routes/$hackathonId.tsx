import { buttonVariants } from "@/components/ui/button";
import { individualHackathonQueryOptions } from "@/lib/api";

import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { Clipboard, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/$hackathonId")({
  beforeLoad: async ({ context, params }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(
        individualHackathonQueryOptions(params.hackathonId)
      );
      return data;
    } catch (e) {
      console.error(e);
      return redirect({ to: "/hackathons" });
    }
  },
  component: FindTeammate,
});

function FindTeammate() {
  const { hackathonId } = Route.useParams();
  const hackathonQuery = useQuery(individualHackathonQueryOptions(hackathonId));

  if (hackathonQuery.isPending) return <div>Loading...</div>;
  if (hackathonQuery.error)
    return <div>Error: {hackathonQuery.error.message}</div>;
  // console.log(hackathonId);~
  return (
    <div className="min-h-screen w-screen flex">
      <div className="w-[25%] shadow-lg">
        <div className="p-12 flex flex-col flex-1 gap-12">
          <div className="flex justify-center gap-4">
            {/* <img src={logo} alt="" className="h-[50px] w-[50px]" /> */}
            <p className="text-xl font-bold">{hackathonQuery.data.name}</p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              to="/$hackathonId"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex justify-around p-8"
              )}
              onClick={() => {}}
            >
              <Home size={24} />
              Overview
            </Link>
            <Link
              to="/$hackathonId/findteam"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex justify-around p-8"
              )}
              onClick={() => {}}
            >
              <Clipboard size={24} />
              Application
            </Link>
            {/* <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex gap-4 justify-around p-8"
              )}
              onClick={() => {}}
            >
              <Medal size={24} />
              Prizes
            </Link> */}
          </div>
        </div>
      </div>
      <div className="w-[75%] bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
