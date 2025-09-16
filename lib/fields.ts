import type { Field } from "react-querybuilder";

export type DataType = "string" | "number" | "boolean" | "date";

export interface AppField {
  id: string;
  name: string;
  label: string;
  dataType: DataType;
}

export function toRqbField(f: AppField): Field {
  switch (f.dataType) {
    case "number":
      return { name: f.name, label: f.label, inputType: "number" };
    case "boolean":
      return { name: f.name, label: f.label, valueEditorType: "checkbox", defaultValue: false } as Field;
    case "date":
      return { name: f.name, label: f.label, inputType: "date" };
    case "string":
    default:
      return { name: f.name, label: f.label };
  }
}

export function toRqbFields(fields: AppField[]): Field[] {
  return fields.map(toRqbField);
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function createAppField(partial: Omit<AppField, "id">): AppField {
  return { id: genId(), ...partial };
}

export const defaultAppFields: AppField[] = [
  createAppField({ name: "firstName", label: "First Name", dataType: "string" }),
  createAppField({ name: "lastName", label: "Last Name", dataType: "string" }),
  createAppField({ name: "age", label: "Age", dataType: "number" }),
  createAppField({ name: "email", label: "Email", dataType: "string" }),
  createAppField({ name: "isDev", label: "Is Dev", dataType: "boolean" }),
];


