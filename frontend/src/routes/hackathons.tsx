import { createFileRoute, Link } from "@tanstack/react-router";
import { hackathonQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export const Route = createFileRoute("/hackathons")({
  component: Hackathons,
});

function Hackathons() {
  return (
    <>
      <div className="w-full h-[230px] sm:h-[230px] md:h-[290px] lg:h-[300px] bg-[#3770ff] flex justify-center items-center">
        <MaxWidthWrapper className="w-full text-center ">
          <p className="text-4xl lg:text-5xl text-white font-bold">
            Applications open
          </p>
        </MaxWidthWrapper>
      </div>
      <div className="md:p-4 pt-4 flex flex-col  bg-gray-50 antialiased">
        <RenderCards />
      </div>
    </>
  );
}

export default Hackathons;

const Tags: React.FC<TagsProps> = ({ content }) => {
  return (
    <div className="flex gap-2">
      <Badge variant="outline" className="px-4 bg-[#f5f7f7] rounded-xl py-2">
        <p className="uppercase text-md tracking-wide">{content}</p>
      </Badge>
    </div>
  );
};

const RenderCards = () => {
  const { user } = Route.useRouteContext();
  const { isPending, error, data } = useQuery(hackathonQueryOptions);
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-1 sm:gap-x-6 lg:grid-cols-2 lg:gap-y-4 px-4">
      {data.map((hackathon) => (
        <Card className="max-w-lg rounded-xl p-4" key={hackathon.uuid}>
          <CardHeader className="">
            <CardTitle className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
              <p className="text-4xl tracking-tight font-bold">
                {hackathon.name}
              </p>
              <div className="flex justify-center items-center h-fit w-fit rounded-full p-3 bg-[#f0f4ff]">
                <LinkIcon />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>{hackathon.tagline}</CardContent>
          <CardFooter className="w-full">
            <div className="flex flex-col sm:flex-row md:flex-row md:w-full sm:justify-between">
              <div className="tags flex gap-3  flex-wrap">
                <Tags content="Open Source" />
                <Tags content="Hackathon" />
                <Tags content="Social" />
              </div>
              <div className="applyButton w-full sm:w-auto md:w-auto mt-4 sm:mt-0">
                {user ? (
                  <a href={`/${hackathon.uuid}/overview`}>
                    <Button className="px-8 py-6 w-full sm:w-auto md:w-auto text-lg rounded-lg">
                      Apply now
                    </Button>
                  </a>
                ) : (
                  <a href={`/api/login`}>
                    <Button className="px-4 flex gap-2 py-6 w-full sm:w-auto md:w-auto text-lg rounded-md" >
                      <Lock size={20}/>
                      Login to apply
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
interface TagsProps {
  content: string;
}
