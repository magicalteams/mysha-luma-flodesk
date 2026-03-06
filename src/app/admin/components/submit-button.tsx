"use client";

import { useFormStatus } from "react-dom";
import styles from "../admin.module.css";

interface SubmitButtonProps {
  label?: string;
  pendingLabel?: string;
}

export default function SubmitButton({
  label = "Add",
  pendingLabel = "Adding...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.btnPrimary} disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}
