import { createFileRoute } from "@tanstack/react-router";
import { hackathonQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/hackathons")({
  component: Hackathons,
});

function Hackathons() {
  const { isPending, error, data } = useQuery(hackathonQueryOptions);
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map((hackathon) => (
        <div key={hackathon.uuid}>
          <h3>{hackathon.name}</h3>
          <p>{hackathon.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default Hackathons;
