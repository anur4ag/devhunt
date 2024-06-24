import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api, findPotentialTeammatesQueryOptions } from "@/lib/api";
import { addUserToTeamQueryOptions } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Medal,
  PencilRuler,
  Braces,
  Code,
  Handshake,
  Bookmark,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/$hackathonId/findTeam")({
  component: FindTeam,
});

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

function FindTeam() {
  return (
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
      <div className="pt-4 flex flex-col gap-4">
        <PersonCard />
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

function PersonCard() {
  const [isLoading, setIsLoading] = useState(false);

  const hackathon_id = Route.useParams().hackathonId;
  const findTeammateQuery = useQuery(
    findPotentialTeammatesQueryOptions(hackathon_id)
  );
  if (findTeammateQuery.isPending) return <div>Loading...</div>;
  if (findTeammateQuery.error)
    return <div>Error: {findTeammateQuery.error.message}</div>;
  if (findTeammateQuery.data.potential_teammates.length === 0)
    return <div>No potential teammates found</div>;

  const handleButtonClick = async (hackathonId: string, personId: string) => {
    setIsLoading(true);
    try {
      const data = await onButtonClick(hackathonId, personId);
      console.log(data);
    } catch (error) {
      // Handle error if needed
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {findTeammateQuery.data.potential_teammates.map((person) => (
        <Card key={person.id} className="rounded-2xl  drop-shadow-sm">
          <CardHeader className="bg-[#f5f3f4cd] rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-[70px] h-[70px]">
                  {person.picture ? (
                    <AvatarImage src={person.picture} className="" />
                  ) : (
                    <AvatarFallback>CN</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle>{person.given_name}</CardTitle>
                  <CardDescription>{person.email}</CardDescription>
                </div>
              </div>
              <Button
                onClick={() => handleButtonClick(hackathon_id, person.id)}
                className="text-xs flex gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                        opacity="0.25"
                      />
                      <path
                        fill="currentColor"
                        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                      >
                        <animateTransform
                          attributeName="transform"
                          dur="0.75s"
                          repeatCount="indefinite"
                          type="rotate"
                          values="0 12 12;360 12 12"
                        />
                      </path>
                    </svg>
                    <p>Adding to team...</p>
                  </>
                ) : (
                  <>
                    <Handshake size={24} />
                    Invite to join team
                  </>
                )}
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
      ))}
    </>
  );
}

async function onButtonClick(hackathon_id: string, user_id: string) {
  const res = await api.user.addtoteam.$put({
    json: {
      hackathonId: hackathon_id,
      userId: user_id,
    },
  });
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}
interface TagsProps {
  icon: React.ReactNode;
  content: string;
}
