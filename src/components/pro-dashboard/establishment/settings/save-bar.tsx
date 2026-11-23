"use client";

import { AnimatePresence, motion } from "framer-motion";

interface SaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  errorCount: number;
  onReset: () => void;
  onSave: () => void;
}

/** Barre d'enregistrement collante, visible dès qu'une modification est en attente. */
export function SaveBar({ isDirty, isSaving, errorCount, onReset, onSave }: SaveBarProps) {
  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="sticky bottom-4 z-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-neutral-950 text-white px-5 py-3 shadow-lg">
            <p className="text-sm">
              {errorCount > 0
                ? `${errorCount} champ${errorCount > 1 ? "s" : ""} à corriger avant d'enregistrer.`
                : "Modifications non enregistrées."}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={onReset} disabled={isSaving} className="btn btn-sm btn-on-photo">
                Annuler
              </button>
              <button type="button" onClick={onSave} disabled={isSaving || errorCount > 0} className="btn btn-sm btn-primary">
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
