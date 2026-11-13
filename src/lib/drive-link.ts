/** Old notes were PDFs uploaded to Supabase Storage and saved as "<chapter>/<uuid>.pdf". */
export function isStoragePath(value: string): boolean {
  return /^\d+\/[\w-]+\.pdf$/i.test(value.trim());
}

export function isWebLink(value: string): boolean {
  try {
    return new URL(value.trim()).protocol === "https:";
  } catch {
    return false;
  }
}

/** A version of a Google Drive / Docs / Slides / Sheets link that can be shown inside the page. */
export function notesPreviewUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const id = url.pathname.match(/\/d\/([\w-]{10,})/)?.[1] ?? url.searchParams.get("id") ?? "";
  if (!/^[\w-]{10,}$/.test(id)) return null;
  if (url.hostname === "drive.google.com") return `https://drive.google.com/file/d/${id}/preview`;
  if (url.hostname === "docs.google.com") {
    const kind = url.pathname.match(/^\/(document|presentation|spreadsheets)\//)?.[1];
    return kind ? `https://docs.google.com/${kind}/d/${id}/preview` : null;
  }
  return null;
}
