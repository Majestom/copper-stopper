import Link from "next/link";
import { useRouter } from "next/router";
import * as styles from "./Sidebar.css";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Map",
    icon: "🗺️",
  },
  {
    href: "/table",
    label: "Table",
    icon: "📊",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: "📈",
  },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navButton} ${
                isActive ? styles.navButtonActive : ""
              }`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
