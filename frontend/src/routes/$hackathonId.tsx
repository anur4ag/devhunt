import { buttonVariants } from "@/components/ui/button";
import { individualHackathonQueryOptions } from "@/lib/api";

import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { Clipboard, Home, Handshake } from "lucide-react";
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
    <div className=" w-screen md:h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[25%] shadow-lg">
        <div className="p-4 md:p-12 flex flex-row md:flex-col flex-1 gap-12">
          <div className="flex justify-center gap-4">
            {/* <img src={logo} alt="" className="h-[50px] w-[50px]" /> */}
            <div className="hidden sm:inline">
              <p className="text-xl font-bold">{hackathonQuery.data.name}</p>
            </div>
          </div>
          <div className="w-full justify-center flex md:flex-col flex-wrap md:gap-4">
            <Link
              to="/$hackathonId/overview"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex justify-around md:p-8 [&.active]:bg-blue-500 [&.active]:text-white"
              )}
              onClick={() => {}}
            >
              <div className="hidden sm:inline">
                <Home size={24} />
              </div>
              Overview
            </Link>
            <Link
              to="/$hackathonId/findteam"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex justify-around md:p-8 [&.active]:bg-blue-500 [&.active]:text-white"
              )}
              onClick={() => {}}
            >
              <div className="hidden sm:inline">
                <Clipboard size={24} />
              </div>
              Find Hackers
            </Link>
            <Link
              to="/$hackathonId/myteam"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex justify-around md:p-8 [&.active]:bg-blue-500 [&.active]:text-white"
              )}
              onClick={() => {}}
            >
              <div className="hidden sm:inline">
                <Handshake size={24} />
              </div>
              My Team
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full pb-12 md:pb-4 md:w-[75%] bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
