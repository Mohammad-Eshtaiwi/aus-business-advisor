import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import clsx from "clsx";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import styles from "./styles.module.scss";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

function SelectItem({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <SelectPrimitive.Item className={clsx(styles.Item, className)} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className={styles.ItemIndicator}>
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label,
  ariaLabel,
  className,
  disabled = false,
  error = false,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={clsx(styles.Trigger, className, { [styles.error]: error })}
        aria-label={ariaLabel}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className={styles.Icon}>
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className={styles.Content}>
          <SelectPrimitive.ScrollUpButton className={styles.ScrollButton}>
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className={styles.Viewport}>
            <SelectPrimitive.Group>
              {label && (
                <SelectPrimitive.Label className={styles.Label}>
                  {label}
                </SelectPrimitive.Label>
              )}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className={styles.ScrollButton}>
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
