import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { hackathonQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Link as LinkIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
          <p className="text-4xl lg:text-5xl pt-16 text-white font-bold">
            Applications open
          </p>
        </MaxWidthWrapper>
      </div>
      <div className="p-4 flex flex-col min-h-screen bg-gray-50 antialiased">
        <RenderCards />
      </div>
    </>
  );
}

export default Hackathons;

const Tags: React.FC<TagsProps> = ({ content }) => {
  return (
    <div className="flex gap-2">
      <Badge variant="outline" className="px-4 bg-[#f5f7f7] rounded-xl py-4">
        <p className="uppercase text-md tracking-wide">{content}</p>
      </Badge>
    </div>
  );
};

const RenderCards = () => {
  const { isPending, error, data } = useQuery(hackathonQueryOptions);
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-1 sm:gap-x-6 lg:grid-cols-2 lg:gap-y-4 px-12">
      {data.map((hackathon) => (
        <Card className="max-w-lg rounded-xl p-4" key={hackathon.uuid}>
          <CardHeader className="">
            <CardTitle className="flex justify-between items-center gap-8">
              <p className="text-4xl tracking-tight font-bold">
                {hackathon.name}
              </p>
              <div className="flex justify-center items-center h-fit w-fit rounded-full p-3 bg-[#f0f4ff]">
                <LinkIcon />
              </div>
            </CardTitle>
            <CardDescription className="tracking-wider text-md ">
              Hackathon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>hackathon</p>
          </CardContent>
          <CardFooter className="w-full">
            <div className="flex flex-col sm:flex-row md:flex-row md:w-full sm:justify-between">
              <div className="tags flex gap-3  flex-wrap">
                <Tags content="Open Source" />
                <Tags content="Hackathon" />
                <Tags content="Social" />
              </div>
              <div className="applyButton w-full sm:w-auto md:w-auto mt-4 sm:mt-0">
                <RegisterDialog hackathon={hackathon} />
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

function Divider() {
  return (
    <div className="relative flex py-3 items-center">
      <div className="flex-grow border-t border-gray-400"></div>
      <span className="flex-shrink mx-4 text-gray-400">or</span>
      <div className="flex-grow border-t border-gray-400"></div>
    </div>
  );
}

const RegisterDialog: React.FC<HackathonProps> = ({ hackathon }) => {
  const navigate = useNavigate();

  const teamForm = useForm({
    defaultValues: {
      team_name: "",
      hackathon_id: hackathon.uuid,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const res = await api.hackathons.newteam.$post({ json: value });
      if (!res.ok) {
        throw new Error("Failed to create hackathon");
      }
      navigate({ to: "/findTeammates" });
    },
  });

  const individualForm = useForm({
    defaultValues: {
      hackathon_id: hackathon.uuid,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const res = await api.hackathons.register.$post({ json: value });
      if (!res.ok) {
        throw new Error("Failed to create hackathon");
      }
      navigate({ to: "/findTeammates" });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="px-8 py-6 w-full sm:w-auto md:w-auto text-lg rounded-lg">
          Apply now
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Register for {hackathon.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Create a new team or submit individual application, either way you
            can invite your friends to join you later.
          </AlertDialogDescription>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              individualForm.handleSubmit();
            }}
          >
            <individualForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Submit individual application"}
                </Button>
              )}
            />
          </form>
          <Divider />
          <AlertDialogTitle className="text-center text-xl">
            Create a team
          </AlertDialogTitle>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              teamForm.handleSubmit();
            }}
          >
            <teamForm.Field
              name="team_name"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Team name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="title"
                    required
                  />
                  {field.state.meta.touchedErrors ? (
                    <em>{field.state.meta.touchedErrors}</em>
                  ) : null}
                  {field.state.meta.isValidating ? "Validating..." : null}
                </>
              )}
            />
            <teamForm.Field
              name="hackathon_id"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Hackathon ID</Label>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    disabled
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="hackathon_id"
                    required
                  />
                  {field.state.meta.touchedErrors ? (
                    <em>{field.state.meta.touchedErrors}</em>
                  ) : null}
                  {field.state.meta.isValidating ? "Validating..." : null}
                </>
              )}
            />
            <teamForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Create team"}
                </Button>
              )}
            />
          </form>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              navigate({ to: "/hackathons" });
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction>dfd</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface TagsProps {
  content: string;
}
interface HackathonProps {
  hackathon: {
    name: string;
    desc: string;
    cover_img: string;
    uuid: string;
  };
}
