import { Link, createFileRoute } from "@tanstack/react-router";
import { getTeamQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal, Bookmark } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/$hackathonId/myTeam")({
  component: GetTeamDetails,
});

function GetTeamDetails() {
  const hackathon_id = Route.useParams().hackathonId;
  console.log(hackathon_id);
  const { data, isPending, error } = useQuery(
    getTeamQueryOptions(hackathon_id)
  );
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data.case === 1) {
    return <div>You are not registered for this hackathon</div>;
  } else if (data.case === 2) {
    return <div>User not in any team</div>;
  } else {
    return (
      <div className="p-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Your team</h1>
          <p className="text-md text-muted-foreground">
            Here are the details of your team and your teammates.
          </p>
        </div>
        <div className=" flex flex-col mt-8 gap-2">
          <p className="text-lg">
            Team Name :{" "}
            <span className="font-bold uppercase">{data.teamName}</span>
          </p>
          <p className="text-lg">Team Members: You +</p>
        </div>
        <div className="pt-4 flex flex-col gap-4">
          {data.teamMembers.length > 0 ? (
            <PersonCard data={data.teamMembers} />
          ) : (
            <div>No team members, <Link className="text-blue-700 font-semibold underline" to={`/${hackathon_id}/findteam`}>Add Teammates</Link></div>
          )}
        </div>
      </div>
    );
  }
}

function PersonCard({ data }) {
  return (
    <>
      {data.map((person) => (
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
                  <CardTitle>{person.name}</CardTitle>
                  <CardDescription>{person.email}</CardDescription>
                </div>
              </div>
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
