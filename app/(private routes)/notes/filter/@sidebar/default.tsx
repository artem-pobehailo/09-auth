import { fetchTags } from "@/lib/api/serverApi";
import SidebarNotes from "./SidebarNotes";

export default async function DefaultSidebar() {
  const tags = await fetchTags();

  return <SidebarNotes tags={tags} />;
}
