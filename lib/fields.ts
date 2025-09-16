import type { Field } from "react-querybuilder";

export type DataType = "string" | "number" | "boolean" | "date";

export interface AppField {
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

export const defaultAppFields: AppField[] = [
  { name: "firstName", label: "First Name", dataType: "string" },
  { name: "lastName", label: "Last Name", dataType: "string" },
  { name: "age", label: "Age", dataType: "number" },
  { name: "email", label: "Email", dataType: "string" },
  { name: "isDev", label: "Is Dev", dataType: "boolean" },
];


