import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  findPotentialTeammatesQueryOptions,
  individualHackathonQueryOptions,
} from "@/lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import {
  Clipboard,
  Medal,
  Home,
  PencilRuler,
  Braces,
  Code,
  Handshake,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const listOfTags = [
  {
    icon: <PencilRuler size={24} />,
    content: "Designer",
  },
  {
    icon: <Braces size={24} />,
    content: "Frontend",
  },
  {
    icon: <Code size={24} />,
    content: "Backend",
  },
];

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
  const teammateQuery = useQuery(findPotentialTeammatesQueryOptions);
  if (hackathonQuery.isPending) return <div>Loading...</div>;
  if (hackathonQuery.error)
    return <div>Error: {hackathonQuery.error.message}</div>;
  // console.log(hackathonId);~
  console.log(teammateQuery.data?.potential_teammates);
  return (
    <div className="min-h-screen w-screen flex">
      <div className="w-[25%] shadow-lg">
        <div className="p-12 flex flex-col flex-1 gap-12">
          <div className="flex items-center gap-4">
            {/* <img src={logo} alt="" className="h-[50px] w-[50px]" /> */}
            <p className="text-xl font-bold">{hackathonQuery.data.name}</p>
          </div>
          <div>
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex justify-around p-8"
              )}
              onClick={() => {}}
            >
              <Clipboard size={24} />
              Application
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex gap-4 justify-around p-8"
              )}
              onClick={() => {}}
            >
              <Medal size={24} />
              Prizes
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full flex gap-4 justify-around p-8"
              )}
              onClick={() => {}}
            >
              <Home size={24} />
              Overview
            </Link>
          </div>
        </div>
      </div>
      <div className="w-[75%] bg-gray-100">
        <div className="p-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold">Looking for hackers?</h1>
            <p className="text-md text-muted-foreground">
              Browser from hackers below, invite them to join your team!
            </p>
          </div>
          <div className="listOfTags flex gap-2 py-4">
            {listOfTags.map((tag) => (
              <Tags key={tag.content} icon={tag.icon} content={tag.content} />
            ))}
          </div>
          <div className="pt-4">
            <Card>
              <CardHeader className="bg-[#f5f3f4cd]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-[70px] h-[70px]">
                      <AvatarImage
                        src={"https://github.com/shadcn.png"}
                        className=""
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Anurag</CardTitle>
                      <CardDescription>Sharma</CardDescription>
                    </div>
                  </div>
                  <Button className="text-xs flex gap-2">
                    <Handshake size={24} />
                    Invite to join team
                  </Button>
                </div>
              </CardHeader>
              <CardContent>{/* <p>Card Content</p> */}</CardContent>
              <CardFooter className="w-full flex justify-around">
                <Card className="w-[30%] rounded-xl">
                  <div className="flex p-3 ">
                    <div className="h-16 w-16 bg-[#ffd7ba] rounded-md flex items-center justify-center">
                      <Bookmark fill="#E5A56E" size={30} />
                    </div>
                    <div className="ps-3 flex flex-col">
                      <p className="font-bold text-xl">5</p>
                      <p className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                        Projects
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="w-[30%] rounded-xl">
                  <div className="flex p-3 ">
                    <div className="h-16 w-16 bg-[#adb5bd] rounded-md flex items-center justify-center">
                      <Bookmark fill="#343a40" size={30} />
                    </div>
                    <div className="ps-3 flex flex-col">
                      <p className="font-bold text-xl">13</p>
                      <p className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                        Hackathons
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="w-[30%] rounded-xl">
                  <div className="flex p-3 ">
                    <div className="h-16 w-16 bg-[#f5cb5c] rounded-md flex items-center justify-center">
                      <Medal fill="#deb841" size={30} />
                    </div>
                    <div className="ps-3 flex flex-col">
                      <p className="font-bold text-xl">3</p>
                      <p className="uppercase tracking-wider text-xs font-bold text-muted-foreground">
                        Prizes
                      </p>
                    </div>
                  </div>
                </Card>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const Tags: React.FC<TagsProps> = ({ content, icon }) => {
  return (
    <div className="flex gap-2">
      {" "}
      <Badge
        variant="outline"
        className="bg-[#fff] flex gap-4 rounded-3xl p-2 px-5"
      >
        {icon}
        <p className="text-sm tracking-wide">{content}</p>
      </Badge>
    </div>
  );
};

interface TagsProps {
  icon: React.ReactNode;
  content: string;
}
