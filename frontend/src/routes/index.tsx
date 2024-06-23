import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isPending, data, error } = useQuery(userQueryOptions);
  if (isPending) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Please <a href="/api/login">login</a> first
      </div>
    );
  return (
    <div className="p-2">
      <h3>Welcome {data.user.given_name}</h3>
    </div>
  );
}
