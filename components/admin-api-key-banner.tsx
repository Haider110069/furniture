"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "furni-admin-key"

export function AdminApiKeyBanner() {
  const [value, setValue] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setValue(sessionStorage.getItem(STORAGE_KEY) ?? "")
  }, [])

  const save = () => {
    sessionStorage.setItem(STORAGE_KEY, value.trim())
    setSaved(true)
    window.dispatchEvent(new CustomEvent("furni-admin-auth"))
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="sticky top-0 z-[100] bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
        <p className="text-amber-900 dark:text-amber-100 shrink-0">
          Admin API key — must match <code className="font-mono text-xs">ADMIN_API_SECRET</code> in{" "}
          <code className="font-mono text-xs">.env</code>
        </p>
        <div className="flex flex-1 gap-2 min-w-0">
          <input
            type="password"
            autoComplete="off"
            placeholder="Paste secret and save"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-700 bg-background text-foreground text-sm"
          />
          <Button type="button" size="sm" variant="secondary" onClick={save} className="shrink-0">
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
