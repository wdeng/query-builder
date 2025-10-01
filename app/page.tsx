"use client";

import { useMemo, useState } from "react";
import QueryBuilderPanel from "../components/QueryBuilderPanel";
import JsonLogicPanel from "../components/JsonLogicPanel";
import FileIOControls from "../components/FileIOControls";
import FieldsEditor from "../components/FieldsEditor";
import FieldsEditorModal from "../components/FieldsEditorModal";
import type { JsonLogicObject } from "../lib/jsonlogic";
import type { Field } from "react-querybuilder";
import type { AppField } from "../lib/fields";
import { createAppField } from "../lib/fields";

const DEFAULT_FIELDS: Omit<AppField, "id">[] = [
  { name: "dicom_magnetic_field_strength", label: "Field Strength", dataType: "number" },
  { name: "dicom_modality_list", label: "DICOM Modality", dataType: "string" },
  { name: "exam_body_part", label: "Body Part", dataType: "string" },
  { name: "exam_contrast_string", label: "Contrast", dataType: "string" },
  { name: "exam_procedure_code_cpt", label: "CPT Code", dataType: "string" },
  { name: "exam_procedure_modality", label: "Procedure Modality", dataType: "string" },
  { name: "exam_tags", label: "Exam Tags", dataType: "string" },
  { name: "exam_trigger", label: "Exam Trigger", dataType: "string" },
  { name: "member_age_at_study", label: "Member Age", dataType: "number" },
  { name: "member_business_line_cd", label: "Business Line", dataType: "string" },
  { name: "member_gender", label: "Gender", dataType: "string" },
  { name: "number_of_series", label: "Number of Series", dataType: "number" },
  { name: "number_of_views", label: "Number of Views", dataType: "number" },
  { name: "views_mentioned", label: "Views Mentioned", dataType: "string" },
];

export default function Home() {
  const [jsonLogic, setJsonLogic] = useState<JsonLogicObject>({});
  const [fields, setFields] = useState<AppField[]>(
    DEFAULT_FIELDS.map(createAppField)
  );
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
    <div className="w-full max-w-[900px] mx-auto p-6">
      {header}
      <div className="flex flex-col gap-6 items-stretch">
        <div className="min-h-[400px] border rounded p-3 flex flex-col gap-4">
          <QueryBuilderPanel
            initialJsonLogic={jsonLogic}
            appFields={fields}
            onJsonLogicChange={setJsonLogic}
            resetKey={resetKey}
          />
        </div>
        <div className="min-h-[280px] border rounded p-3">
          <JsonLogicPanel json={jsonLogic} />
        </div>
      </div>
    </div>
  );
}
