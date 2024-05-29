import { createFileRoute } from "@tanstack/react-router";
import banner from "@public/banner.png";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/$hackathonId/")({
  component: HackathonHome,
});

function HackathonHome() {
  return (
    <div className=" flex flex-col justify-center">
      <div className="relative mb-4 w-full" style={{ height: "200px" }}>
        <img
          src={banner}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <img
          src={"https://github.com/shadcn.png"}
          alt=""
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full"
        />
      </div>
      <div className="mt-8">
        <MaxWidthWrapper>
          <h1 className="text-center text-3xl font-bold tracking-tight">
            Hackathon name
          </h1>
          <p className="mt-4 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat,
            ratione minima quaerat fuga et, esse necessitatibus asperiores ad
            dignissimos, sequi eius consequatur eum non odio voluptatum.
            Assumenda, exercitationem veritatis? Fugiat?
          </p>
          <div className="flex md:flex-row flex-col mt-4 items-center md:justify-center gap-8">
            <Card className="w-full sm:w-1/2 md:w-1/3 drop-shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Team size</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold tracking-wider text-muted-foreground">
                  1-3
                </p>
              </CardContent>
            </Card>
            <Card className="w-full sm:w-1/2 md:w-1/3 drop-shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Date</CardTitle>
              </CardHeader>
              <CardContent className="font-semibold  text-muted-foreground">
                <p>25 Feb 2022</p>
              </CardContent>
            </Card>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}
