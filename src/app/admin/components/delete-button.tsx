"use client";

import { useState, useTransition } from "react";
import styles from "../admin.module.css";

interface DeleteButtonProps {
  action: (formData: FormData) => Promise<void>;
  hiddenFields: Record<string, string>;
  label?: string;
}

export default function DeleteButton({
  action,
  hiddenFields,
  label = "Delete",
}: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className={styles.confirmGroup}>
        <button
          className={styles.btnDangerConfirm}
          disabled={isPending}
          onClick={() => {
            const fd = new FormData();
            for (const [k, v] of Object.entries(hiddenFields)) {
              fd.set(k, v);
            }
            startTransition(() => action(fd));
            setConfirming(false);
          }}
        >
          {isPending ? "..." : "Confirm"}
        </button>
        <button
          className={styles.btnCancel}
          onClick={() => setConfirming(false)}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button className={styles.btnDanger} onClick={() => setConfirming(true)}>
      {label}
    </button>
  );
}
