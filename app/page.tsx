import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>CPU Research Archiving System</h1>
        <p className={styles.subtitle}>
          A digital repository for research papers at CPU.
        </p>

        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.primaryBtn}>
            Explore Research
          </Link>
          <Link href="/login" className={styles.secondaryBtn}>
            Admin Login
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} CPU Research Archiving</p>
      </footer>
    </div>
  );
}
