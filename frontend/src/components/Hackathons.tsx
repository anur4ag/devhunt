import { api } from "@/lib/api";
import { useEffect, useState } from "react";

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
  useEffect(() => {
    async function fetchHackathons() {
      const data = await api.hackathons.$get();
      const res = await data.json();
      setHackathons(res.hackathons);
    }
    fetchHackathons();
  }, []);

  return (
    <div>
      {hackathons.map((hackathon) => (
        <div key={hackathon.uuid}>
          <h3>{hackathon.name}</h3>
          <p>{hackathon.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Hackathons;
