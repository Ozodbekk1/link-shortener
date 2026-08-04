export function edgeLogger(
  level: "info" | "warn" | "error",
  message: string,
  data?: Record<string, unknown>
) {
  const colors = {
    info: "\x1b[36m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    key: "\x1b[35m",
    value: "\x1b[37m",
    reset: "\x1b[0m",
  }

  const output = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  }

  const colored = Object.entries(output)
    .map(([key, value]) => {
      return `${colors.key}${key}${colors.reset}: ${colors.value}${JSON.stringify(value)}${colors.reset}`
    })
    .join("\n")

  console.log(
    `${colors[level]}${level.toUpperCase()}${colors.reset} ${message}\n${colored}\n`
  )
}
