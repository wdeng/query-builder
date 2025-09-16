'use client';

import { ChangeEvent, useRef } from "react";
import type { JsonLogicObject } from "../lib/jsonlogic";

export type FileIOControlsProps = {
  onImport: (json: JsonLogicObject) => void;
  exportData: JsonLogicObject;
  className?: string;
};

export default function FileIOControls({ onImport, exportData, className }: FileIOControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const text = String(ev.target?.result ?? "{}");
        const json = JSON.parse(text);
        onImport(json);
      } catch {
        // ignore invalid JSON
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify(exportData ?? {}, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jsonlogic.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept=".json,application/json" onChange={onFileChange} className="hidden" />
      <div className="flex items-center gap-2">
        <button className="rounded border px-2 py-1 text-xs" onClick={() => inputRef.current?.click()}>Import JSON</button>
        <button className="rounded border px-2 py-1 text-xs" onClick={onExport}>Export JSON</button>
      </div>
    </div>
  );
}


