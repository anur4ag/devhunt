import { api } from "@/lib/api";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Hackathons = () => {
  const [hackathons, setHackathons] = useState<
    {
      uuid: string;
      name: string;
      tagline: string;
      desc: string;
      cover_img: string;
      starts_at: string | null;
      ends_at: string | null;
      is_online: boolean;
      team_min: number;
      team_max: number;
    }[]
  >([]);
  const { isPending, error, data } = useQuery({
    queryKey: ["hackathons"],
    queryFn: fetchHackathons,
  });
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
};

export default Hackathons;

async function fetchHackathons() {
  const res = await api.hackathons.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch hackathons");
  }
  const data = await res.json();
  return data.hackathons;
}
