import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "./styles.module.scss";

export interface DialogProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Modal: React.FC<DialogProps> = ({
  title,
  description,
  children,
  defaultOpen,
  className,
  open,
  onOpenChange,
}) => (
  <Dialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={`${styles.content} ${className || ""}`}>
        <Dialog.Title className={styles.title}>{title}</Dialog.Title>
        {description && (
          <Dialog.Description className={styles.description}>
            {description}
          </Dialog.Description>
        )}
        {children}
        <Dialog.Close asChild>
          <button className={styles.closeButton} aria-label="Close">
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;
