import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");
export const api = client.api;

/*--------------- Query Options ------------- */
export const hackathonQueryOptions = queryOptions({
  queryKey: ["hackathons"],
  queryFn: fetchHackathons,
});

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export function individualHackathonQueryOptions(hackathon_id: string) {
  return queryOptions({
    queryKey: ["individual-hackathon", hackathon_id],
    queryFn: fetchIndividualHackathon,
  });
}

export const findPotentialTeammatesQueryOptions = queryOptions({
  queryKey: ["potential-teammates"],
  queryFn: fetchPotentialTeammates,
});

// export const individualHackathonQueryOptions = queryOptions({
//   queryKey: ["individual-hackathon"],
//   queryFn: fetchIndividualHackathon(),
// });

/*--------------- Query Functions ------------- */
async function fetchHackathons() {
  const res = await api.hackathons.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data.hackathons;
}
async function fetchIndividualHackathon({
  queryKey,
}: {
  queryKey: [string, string];
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, hackathon_id] = queryKey;
  const res = await api.hackathons[":uuid"].$get({
    param: {
      uuid: hackathon_id,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch hackathons");
  }
  const data = await res.json();
  return data.hackathon[0];
}

async function fetchPotentialTeammates() {
  const res = await api.hackathons.teammates.$post({
    json: {
      hackathon_id: "e3141227-048d-4d2f-860d-344f354fcd47",
    },
  });
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}
