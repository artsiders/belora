"use client";

import { Modal } from "@/components/pro-dashboard/ui/modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  isPending?: boolean;
  tone?: "default" | "danger";
}

/** Confirmation d'une action sensible (remplace window.confirm). */
export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  isPending = false,
  tone = "default",
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={tone === "danger" ? "btn btn-dark bg-rose-700 hover:bg-rose-800" : "btn btn-dark"}
          >
            {isPending ? "En cours..." : confirmLabel}
          </button>
        </div>
      }
    >
      <div className="text-sm text-neutral-600">{description}</div>
    </Modal>
  );
}
