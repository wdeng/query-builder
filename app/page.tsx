"use client";

import { useMemo, useState } from "react";
import QueryBuilderPanel from "../components/QueryBuilderPanel";
import JsonLogicPanel from "../components/JsonLogicPanel";
import FileIOControls from "../components/FileIOControls";
import FieldsEditor from "../components/FieldsEditor";
import FieldsEditorModal from "../components/FieldsEditorModal";
import type { JsonLogicObject } from "../lib/jsonlogic";
import type { Field } from "react-querybuilder";
import type { AppField, defaultAppFields } from "../lib/fields";

export default function Home() {
  const [jsonLogic, setJsonLogic] = useState<JsonLogicObject>({});
  const [fields, setFields] = useState<AppField[]>([
    { name: "firstName", label: "First Name", dataType: "string" },
    { name: "lastName", label: "Last Name", dataType: "string" },
    { name: "age", label: "Age", dataType: "number" },
    { name: "email", label: "Email", dataType: "string" },
    { name: "isDev", label: "Is Dev", dataType: "boolean" },
  ]);
  const [resetKey, setResetKey] = useState(0);

  const header = useMemo(
    () => (
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">React Query Builder ⇄ JsonLogic</h1>
        <div className="flex items-center gap-2">
          <FieldsEditorModal fields={fields} onChange={setFields} />
          <FileIOControls
            onImport={(jl) => {
              setJsonLogic(jl);
              setResetKey((k) => k + 1);
            }}
            exportData={jsonLogic}
          />
        </div>
      </div>
    ),
    [jsonLogic, fields]
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6">
      {header}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="min-h-[400px] border rounded p-3 flex flex-col gap-4">
          {/* Keep the inline editor for convenience; modal remains the primary control */}
          <QueryBuilderPanel
            initialJsonLogic={jsonLogic}
            appFields={fields}
            onJsonLogicChange={setJsonLogic}
            resetKey={resetKey}
          />
        </div>
        <div className="min-h-[400px] border rounded p-3">
          <JsonLogicPanel json={jsonLogic} />
        </div>
      </div>
    </div>
  );
}
