/** Escape and build CSV rows for client-side export */

export function csvEscape(cell: string | number): string {
  const s = String(cell)
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const BOM = "\uFEFF"
  const lines = [headers.join(","), ...rows.map((r) => r.map(csvEscape).join(","))]
  const blob = new Blob([BOM + lines.join("\r\n")], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
