import DefaultSidebar from "./@sidebar/default";
import css from "./LayoutNotes.module.css";

export default async function LayoutNotes({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar ?? <DefaultSidebar />}</aside>
      <main className={css.notesWrapper}>{children}</main>
    </div>
  );
}
