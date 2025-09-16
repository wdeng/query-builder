'use client';

import { useMemo, useState } from "react";
import type { AppField, DataType } from "../lib/fields";
import { createAppField } from "../lib/fields";

export type FieldsEditorProps = {
  fields: AppField[];
  onChange: (fields: AppField[]) => void;
  className?: string;
};

export default function FieldsEditor({ fields, onChange, className }: FieldsEditorProps) {
  const [newName, setNewName] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const nameSet = useMemo(() => new Set(fields.map(f => f.name)), [fields]);

  const addField = () => {
    const name = newName.trim();
    const label = (newLabel.trim() || toTitleCase(name));
    if (!name || nameSet.has(name)) return;
    onChange([...fields, createAppField({ name, label, dataType: "string" })]);
    setNewName("");
    setNewLabel("");
  };

  const updateField = (idx: number, updates: Partial<AppField>) => {
    const next = fields.slice();
    next[idx] = { ...next[idx], ...updates } as AppField;
    onChange(next);
  };

  const removeField = (idx: number) => {
    const next = fields.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Fields</span>
      </div>
      <div className="flex flex-col gap-2">
        {fields.map((f, i) => (
          <div key={f.id} className="flex items-center gap-2">
            <input
              className="border rounded px-2 py-1 text-xs w-40"
              value={f.name}
              onChange={e => updateField(i, { name: e.target.value })}
              placeholder="name"
            />
            <input
              className="border rounded px-2 py-1 text-xs w-48"
              value={f.label ?? ""}
              onChange={e => updateField(i, { label: e.target.value })}
              placeholder="label"
            />
            <select
              className="border rounded px-2 py-1 text-xs w-28"
              value={f.dataType}
              onChange={e => updateField(i, { dataType: e.target.value as DataType })}
            >
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
              <option value="date">date</option>
            </select>
            <button className="rounded border px-2 py-1 text-xs cursor-pointer transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]" onClick={() => removeField(i)}>Remove</button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <input
            className="border rounded px-2 py-1 text-xs w-40"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="new field name"
          />
          <input
            className="border rounded px-2 py-1 text-xs w-48"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="label (optional)"
          />
          <button className="rounded border px-2 py-1 text-xs cursor-pointer transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]" onClick={addField}>Add</button>
        </div>
      </div>
    </div>
  );
}

function toTitleCase(input: string): string {
  return input
    .replace(/[_.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
}


