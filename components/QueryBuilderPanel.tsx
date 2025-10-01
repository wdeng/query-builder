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

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function ensureRuleIds(group: RuleGroupType): RuleGroupType {
  const withIds: RuleGroupType = {
    ...group,
    id: group.id ?? genId(),
    rules: (group.rules ?? []).map((r: any) => {
      if (r && typeof r === "object" && Array.isArray(r.rules)) {
        return ensureRuleIds(r as RuleGroupType);
      }
      return r && typeof r === "object" ? { ...r, id: r.id ?? genId() } : r;
    }),
  };
  return withIds;
}

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
  const [query, setQuery] = useState<RuleGroupType>(() => ensureRuleIds(parseJsonLogicToQuery(initialJsonLogic)));

  // Only reset the internal query when resetKey changes (e.g., on import),
  // so user-added groups/rules are not unexpectedly cleared during edits.
  useEffect(() => {
    setQuery(ensureRuleIds(parseJsonLogicToQuery(initialJsonLogic)));
  }, [resetKey]);

  const fields: Field[] = useMemo(() => {
    const base = appFields ? toRqbFields(appFields) : (baseFields ?? defaultFields);
    const inferred = extractFieldsFromJsonLogic(initialJsonLogic ?? {});
    return mergeFields(base, inferred);
  }, [baseFields, appFields, resetKey]);

  const handleQueryChange = (next: RuleGroupType) => {
    setQuery(next);
    const json = formatQueryToJsonLogic(next);
    onJsonLogicChange?.(json);
  };

  return (
    <div className="w-full">
      <QueryBuilder fields={fields} query={query} onQueryChange={handleQueryChange} />
    </div>
  );
}


