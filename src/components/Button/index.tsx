import styles from "./styles.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button(props: ButtonProps) {
  return (
    <button {...props} className={styles.button + " " + props.className}>
      {props.children}
    </button>
  );
}
