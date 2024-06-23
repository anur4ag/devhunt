import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { individualHackathonQueryOptions } from "@/lib/api";

export const Route = createFileRoute("/$hackathonId/overview")({
  loader: async ({ context, params }) => {
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
  component: HackathonHome,
});

function HackathonHome() {
  const data = Route.useLoaderData();
  const date = new Date(data.starts_at);

  console.log(data);
  return (
    <div className=" flex flex-col justify-center">
      <div className="relative mb-4 w-full" style={{ height: "200px" }}>
        <img
          src={data.cover_img}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-stretch"
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
            {data.name}
          </h1>
          <p className="mt-4 text-center">{data.desc}</p>
          <div className="flex md:flex-row flex-col mt-4 items-center md:justify-center gap-8">
            <Card className="w-full sm:w-1/2 md:w-1/3 drop-shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Team size</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold tracking-wider text-muted-foreground">
                  {data.team_min} - {data.team_max}
                </p>
              </CardContent>
            </Card>
            <Card className="w-full sm:w-1/2 md:w-1/3 drop-shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Date</CardTitle>
              </CardHeader>
              <CardContent className="font-semibold  text-muted-foreground">
                <p>{`${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`}</p>
              </CardContent>
            </Card>
          </div>
          <div className="applyButton w-full sm:w-auto md:w-auto mt-4 sm:mt-0">
            <RegisterDialog hackathon={data} />
          </div>
        </MaxWidthWrapper>
      </div>
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
      navigate({ to: `/${hackathon.uuid}/findteam` });
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
      navigate({
        to: `/${hackathon.uuid}/findteam`,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="">
        <div className="w-full flex justify-center pt-8">
          <Button className="px-8 py-6 w-full sm:w-auto md:w-auto text-lg rounded-full">
            Apply now
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Register for {hackathon.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Create a new team or submit individual application to find hackers
            who are participating in this hackathon.
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
            {/* <teamForm.Field
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
            /> */}
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
interface HackathonProps {
  hackathon: {
    name: string;
    desc: string;
    cover_img: string;
    uuid: string;
  };
}

function Divider() {
  return (
    <div className="relative flex py-3 items-center">
      <div className="flex-grow border-t border-gray-400"></div>
      <span className="flex-shrink mx-4 text-gray-400">or</span>
      <div className="flex-grow border-t border-gray-400"></div>
    </div>
  );
}
