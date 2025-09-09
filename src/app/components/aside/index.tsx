import styles from "@/app/mainPage.module.scss";
import Form from "./form";

export default function Aside() {
  return (
    <div className={styles.formContainer}>
      <Form />
    </div>
  );
}
