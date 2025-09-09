"use client";
import * as RadixForm from "@radix-ui/react-form";
import clsx from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  validationMessages?: {
    valueMissing?: string;
    typeMismatch?: string;
    patternMismatch?: string;
  };
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  messageClassName?: string;
  inputClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      validationMessages = {
        valueMissing: `Please enter ${label.toLowerCase()}`,
        typeMismatch: `Please provide a valid ${label.toLowerCase()}`,
      },
      error,
      containerClassName,
      labelClassName,
      messageClassName,
      inputClassName,
      leftIcon,
      rightIcon,
      type = "text",
      disabled,
      ...inputProps
    },
    ref
  ) => {
    const showError = Boolean(error);

    return (
      <RadixForm.Field
        className={clsx(styles.container, containerClassName)}
        name={name}
      >
        <RadixForm.Label className={clsx(styles.label, labelClassName)}>
          {label}
        </RadixForm.Label>

        <div className={styles.inputWrapper}>
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          <RadixForm.Control asChild>
            <input
              ref={ref}
              className={clsx(
                styles.input,
                {
                  [styles.hasLeftIcon]: leftIcon,
                  [styles.hasRightIcon]: rightIcon,
                  [styles.hasError]: showError,
                },
                inputClassName
              )}
              type={type}
              disabled={disabled}
              {...inputProps}
            />
          </RadixForm.Control>
          {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
        </div>

        {error ? (
          <div className={clsx(styles.error, messageClassName)}>{error}</div>
        ) : (
          <>
            {validationMessages.valueMissing && (
              <RadixForm.Message
                className={clsx(styles.error, messageClassName)}
                match="valueMissing"
              >
                {validationMessages.valueMissing}
              </RadixForm.Message>
            )}
            {validationMessages.typeMismatch && (
              <RadixForm.Message
                className={clsx(styles.error, messageClassName)}
                match="typeMismatch"
              >
                {validationMessages.typeMismatch}
              </RadixForm.Message>
            )}
            {validationMessages.patternMismatch && (
              <RadixForm.Message
                className={clsx(styles.error, messageClassName)}
                match="patternMismatch"
              >
                {validationMessages.patternMismatch}
              </RadixForm.Message>
            )}
          </>
        )}
      </RadixForm.Field>
    );
  }
);

Input.displayName = "Input";

export default Input;
