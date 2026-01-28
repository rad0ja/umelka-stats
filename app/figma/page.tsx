// app/app/AppPage.tsx
import { cookies } from "next/headers";
import { getPlayerStatsForSeason } from "@/app/data/getPlayerStatsForSeason";
import AppShell from "./AppShell";

export default async function AppPage() {
  const seasonId = (await cookies()).get("seasonId")?.value;
  const data = seasonId ? await getPlayerStatsForSeason(seasonId) : null;

  if (!data) return null;

  return <AppShell playerStats={data} />;
}
