"use client"

import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { functions } from "@/models/client/config"

type Props = {
  angebotId: string
}

const FUNCTION_ID = "68b84d3b000781ab7684"

export default function OrderDialog({ angebotId }: Props) {
  const [open, setOpen] = React.useState(false)
  const [menge, setMenge] = React.useState<string>("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = Number(menge)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Bitte eine gültige Menge > 0 eingeben.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        angebotID: angebotId,
        mitgliedschaftID: "devMembership",
        menge: parsed,
      }

      await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify(payload)
      )

      setSuccess("Anfrage gesendet. Wir melden uns zeitnah!")
      // Optionally close after brief delay
      setTimeout(() => {
        setOpen(false)
        setMenge("")
        setSuccess(null)
      }, 1200)
    } catch (err: any) {
      // Appwrite SDK errors typically have message/code
      const message = err?.message || "Unbekannter Fehler beim Senden."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-permdal-600 hover:bg-permdal-700">
          Jetzt bestellen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bestellung anfragen</DialogTitle>
          <DialogDescription>
            Gib die gewünschte Menge ein und sende deine Anfrage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="menge" className="block text-sm font-medium mb-1">
              Menge
            </label>
            <Input
              id="menge"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              placeholder="z. B. 25"
              value={menge}
              onChange={(e) => setMenge(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" aria-live="assertive">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700" aria-live="polite">
              {success}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Senden…" : "Anfrage senden"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

