'use client';

import { useEffect, useMemo, useState } from "react";
import type { Field, RuleGroupType } from "react-querybuilder";
import { QueryBuilder } from "react-querybuilder";
import {
  extractFieldsFromJsonLogic,
  formatQueryToJsonLogic,
  mergeFields,
  parseJsonLogicToQuery,
  type JsonLogicObject,
} from "../lib/jsonlogic";
import { toRqbFields, type AppField } from "../lib/fields";

export type QueryBuilderPanelProps = {
  initialJsonLogic?: JsonLogicObject;
  baseFields?: Field[];
  appFields?: AppField[];
  onJsonLogicChange?: (json: JsonLogicObject) => void;
  resetKey?: number;
};

const defaultFields: Field[] = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "age", label: "Age", inputType: "number" },
  { name: "email", label: "Email" },
  { name: "isDev", label: "Is Dev", valueEditorType: "checkbox", defaultValue: false },
];

export default function QueryBuilderPanel({
  initialJsonLogic,
  baseFields,
  appFields,
  onJsonLogicChange,
  resetKey,
}: QueryBuilderPanelProps) {
  const [query, setQuery] = useState<RuleGroupType>(() => parseJsonLogicToQuery(initialJsonLogic));

  // Only reset the internal query when resetKey changes (e.g., on import),
  // so user-added groups/rules are not unexpectedly cleared during edits.
  useEffect(() => {
    setQuery(parseJsonLogicToQuery(initialJsonLogic));
  }, [resetKey]);

  const fields: Field[] = useMemo(() => {
    const base = appFields ? toRqbFields(appFields) : (baseFields ?? defaultFields);
    const inferred = extractFieldsFromJsonLogic(initialJsonLogic ?? {});
    return mergeFields(base, inferred);
  }, [initialJsonLogic, baseFields, appFields]);

  const handleQueryChange = (next: RuleGroupType) => {
    setQuery(next);
    const json = formatQueryToJsonLogic(next);
    onJsonLogicChange?.(json);
  };

  return (
    <div className="w-full">
      <QueryBuilder fields={fields} query={query} onQueryChange={handleQueryChange} controlElements={{}} />
    </div>
  );
}


