import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "./styles.module.scss";

export interface DialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}

const Modal: React.FC<DialogProps> = ({
  trigger,
  title,
  description,
  children,
  onOpenChange,
  defaultOpen,
  className,
}) => (
  <Dialog.Root defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <Dialog.Trigger asChild>
      {trigger}
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={`${styles.content} ${className || ''}`}>
        <Dialog.Title className={styles.title}>
          {title}
        </Dialog.Title>
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
