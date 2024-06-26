import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

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
    staleTime: Infinity,
  });
}

export function findPotentialTeammatesQueryOptions(hackathon_id: string) {
  return queryOptions({
    queryKey: ["potential-teammates", hackathon_id],
    queryFn: fetchPotentialTeammates,
  });
}

export const isUserRegisteredHackathon = queryOptions({
  queryKey: ["user-registered-hackathon"],
  queryFn: fetchUserRegisteredHackathon,
});

export function addUserToTeamQueryOptions(
  hackathon_id: string,
  user_id: string
) {
  return queryOptions({
    queryKey: ["add-user-to-team", hackathon_id, user_id],
    queryFn: addUserToTeamFunction,
  });
}

export function getTeamQueryOptions(hackathon_id: string) {
  return queryOptions({
    queryKey: ["get-team-details", hackathon_id],
    queryFn: fetchTeamDetails,
  });
}

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
    toast.error("Please login first!");
    throw new Error("Failed to fetch hackathons");
  }
  const data = await res.json();
  return data.hackathon[0];
}

async function fetchPotentialTeammates({
  queryKey,
}: {
  queryKey: [string, string];
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, hackathon_id] = queryKey;
  const res = await api.hackathons.teammates.$post({
    json: {
      hackathon_id: hackathon_id,
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

async function fetchUserRegisteredHackathon() {
  const res = await api.user.userhackathons.$get();
  if (!res.ok) {
    toast.error("Please login first!");
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

async function addUserToTeamFunction({
  queryKey,
}: {
  queryKey: [string, string, string];
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, hackathon_id, user_id] = queryKey;
  const res = await api.user.addtoteam.$put({
    json: {
      hackathonId: hackathon_id,
      userId: user_id,
    },
  });
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

async function fetchTeamDetails({ queryKey }: { queryKey: [string, string] }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, hackathon_id] = queryKey;
  const res = await api.user.myteam[":hackathonId"].$get({
    param: {
      hackathonId: hackathon_id,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch hackathons");
  }
  const data = await res.json();
  if (data.case === 1) {
    toast.error("Please register for this hackathon first");
  } else if (data.case === 2) {
    toast.error("Please join a team first");
  }
  return data;
}
