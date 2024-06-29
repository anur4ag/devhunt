import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/OrganizeHackathon")({
  component: CreateHackathon,
});

function CreateHackathon() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: "",
      desc: "",
      tagline: "",
      cover_img: "",
      logo: "",
      is_online: true,
      team_min: 1,
      team_max: 4,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
      const res = await api.hackathons.$post({ json: value });
      if (!res.ok) {
        throw new Error("Failed to create hackathon");
      }
      navigate({ to: "/hackathons" });
    },
  });
  return (
    <div className="flex flex-col max-w-lg mx-auto my-5 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Want to organize your own hackathon?</CardTitle>
          <CardDescription>Fill in the details to get started!</CardDescription>
        </CardHeader>
        <CardContent>{/* <ExpenseForm /> */}</CardContent>
      </Card>
      <div className="py-4">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Hackathon Title</Label>
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
          <form.Field
            name="tagline"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>
                  Desribe your hack in one line:
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
                  placeholder="tagline"
                  required
                />
                {field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null}
                {field.state.meta.isValidating ? "Validating..." : null}
              </>
            )}
          />
          <form.Field
            name="desc"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Hackathon description:</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="description"
                  required
                />
                {field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null}
                {field.state.meta.isValidating ? "Validating..." : null}
              </>
            )}
          />
          <form.Field
            name="cover_img"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Banner image URL:</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="text"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="image link"
                  required
                />
                {field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null}
                {field.state.meta.isValidating ? "Validating..." : null}
              </>
            )}
          />
          <form.Field
            name="logo"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Logo URL:</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="text"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="logo link"
                  required
                />
                {field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null}
                {field.state.meta.isValidating ? "Validating..." : null}
              </>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
