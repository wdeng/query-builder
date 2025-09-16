import type { Field, RuleGroupType } from "react-querybuilder";
import { formatQuery } from "react-querybuilder/formatQuery";
import { parseJsonLogic } from "react-querybuilder/parseJsonLogic";

export type JsonLogicObject = unknown;

export function parseJsonLogicToQuery(
  jsonLogic: JsonLogicObject | null | undefined
): RuleGroupType {
  try {
    if (!jsonLogic || (typeof jsonLogic === "object" && Object.keys(jsonLogic as object).length === 0)) {
      return { combinator: "and", rules: [] };
    }
    return parseJsonLogic(jsonLogic as any) as RuleGroupType;
  } catch {
    return { combinator: "and", rules: [] };
  }
}

export function formatQueryToJsonLogic(query: RuleGroupType): JsonLogicObject {
  try {
    return formatQuery(query as any, "jsonlogic");
  } catch {
    return {} as JsonLogicObject;
  }
}

export function extractFieldsFromJsonLogic(jsonLogic: JsonLogicObject): string[] {
  const fieldNames = new Set<string>();

  function walk(node: any): void {
    if (node == null) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node === "object") {
      if (Object.prototype.hasOwnProperty.call(node, "var")) {
        const v = (node as { var?: unknown }).var;
        if (typeof v === "string" && v.trim() !== "") fieldNames.add(v);
      }
      for (const value of Object.values(node)) walk(value);
    }
  }

  walk(jsonLogic as any);
  return Array.from(fieldNames);
}

export function mergeFields(baseFields: Field[], inferredFieldNames: string[]): Field[] {
  const existing = new Set(baseFields.map(f => f.name));
  const inferred: Field[] = inferredFieldNames
    .filter(name => !existing.has(name))
    .map(name => ({ name, label: toTitleCase(name) }));
  return [...baseFields, ...inferred];
}

function toTitleCase(input: string): string {
  return input
    .replace(/[_.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
}


