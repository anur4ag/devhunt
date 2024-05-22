import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");
export const api = client.api;

export const hackathonQueryOptions = queryOptions({
  queryKey: ["hackathons"],
  queryFn: fetchHackathons,
  staleTime: Infinity,
});

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

async function fetchHackathons() {
  const res = await api.hackathons.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch hackathons");
  }
  const data = await res.json();
  return data.hackathons;
}
async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}
