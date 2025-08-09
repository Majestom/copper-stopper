import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import * as styles from "./MainLayout.css";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
