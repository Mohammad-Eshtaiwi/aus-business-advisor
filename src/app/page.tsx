import clsx from "clsx";
import styles from "./mainPage.module.scss";
export default function Home() {
  return (
    <div className={clsx(styles.pageContainer)}>
      <aside className={clsx(styles.formContainer)}>form goes here</aside>
      <main className={clsx(styles.mapContainer)}>
        <div>map goes here</div>
      </main>
    </div>
  );
}
