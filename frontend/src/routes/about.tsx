import { createFileRoute } from "@tanstack/react-router";
import Hackathons from "@/components/Hackathons";

export const Route = createFileRoute("/about")({
  component: Hackathons,
});
