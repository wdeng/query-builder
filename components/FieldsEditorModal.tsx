'use client';

import { useState } from "react";
import type { AppField } from "../lib/fields";
import FieldsEditor from "./FieldsEditor";

export type FieldsEditorModalProps = {
  fields: AppField[];
  onChange: (fields: AppField[]) => void;
};

export default function FieldsEditorModal({ fields, onChange }: FieldsEditorModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="rounded border px-2 py-1 text-xs cursor-pointer transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]" onClick={() => setOpen(true)}>Edit Fields</button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-neutral-900 border rounded shadow-lg w-[720px] max-w-[95vw] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Edit Fields</h2>
              <button className="rounded border px-2 py-1 text-xs cursor-pointer transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]" onClick={() => setOpen(false)}>Close</button>
            </div>
            <FieldsEditor fields={fields} onChange={onChange} />
          </div>
        </div>
      ) : null}
    </div>
  );
}


