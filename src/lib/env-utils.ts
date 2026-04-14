export function parseBooleanEnv(value: string | undefined, fallback: boolean) {
  if (!value) return fallback

  const normalized = value.trim().toLowerCase()

  if (["1", "on", "true", "yes"].includes(normalized)) return true
  if (["0", "false", "no", "off"].includes(normalized)) return false

  return fallback
}

export function parseNumberEnv(value: string | undefined, fallback: number) {
  if (!value) return fallback

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
