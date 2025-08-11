import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import * as styles from "./MainLayout.css";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id="mobile-menu-toggle"
        className={styles.mobileMenuToggle}
      />
      <label
        htmlFor="mobile-menu-toggle"
        className={styles.mobileMenuLabel}
        aria-label="Toggle navigation menu"
      >
        <div className={styles.hamburgerIcon}>
          <div className={styles.hamburgerLineTop} />
          <div className={styles.hamburgerLineMiddle} />
          <div className={styles.hamburgerLineBottom} />
        </div>
      </label>
      <div style={{ display: "contents" }}>
        <label
          htmlFor="mobile-menu-toggle"
          className={styles.overlay}
          aria-hidden="true"
        />
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </div>
  );
}
