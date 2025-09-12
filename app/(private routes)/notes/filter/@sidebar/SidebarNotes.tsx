"use client";

import css from "./SidebarNotes.module.css";
import Link from "next/link";
const tags = ["All", "Work", "Personal", "Todo", "Shopping"];
interface SidebarNotesProps {
  tags: string[];
}
export default function SidebarNotes({ tags }: SidebarNotesProps) {
  return (
    <ul className={css.menuList}>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
