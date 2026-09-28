// Narrative bullet points can contain commas. The CMS promises one item per line.
export function impactLines(value: FormDataEntryValue | null) {
  return String(value ?? '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}
