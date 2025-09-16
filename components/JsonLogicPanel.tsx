'use client';

import { useCallback, useMemo } from "react";
import type { JsonLogicObject } from "../lib/jsonlogic";

export type JsonLogicPanelProps = {
  json: JsonLogicObject;
};

export default function JsonLogicPanel({ json }: JsonLogicPanelProps) {
  const text = useMemo(() => JSON.stringify(json ?? {}, null, 2), [json]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  }, [text]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">JsonLogic</span>
        <button className="rounded border px-2 py-1 text-xs" onClick={copy}>Copy</button>
      </div>
      <pre className="whitespace-pre-wrap text-xs leading-[1.25rem] p-3 rounded border overflow-auto min-h-[300px]">
        {text}
      </pre>
    </div>
  );
}


