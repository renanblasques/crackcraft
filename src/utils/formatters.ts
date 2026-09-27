export function formatUptime(
  launchTime: string | null | undefined,
) {
  if (!launchTime) return '—'

  const milliseconds =
    Date.now() -
    new Date(launchTime).getTime()

  if (milliseconds <= 0) {
    return '0 min'
  }

  const minutes =
    Math.floor(milliseconds / 60_000)

  const hours =
    Math.floor(minutes / 60)

  if (hours === 0) {
    return `${minutes} min`
  }

  const remainingMinutes =
    minutes % 60

  return `${hours}h ${remainingMinutes}min`
}

export function formatDuration(
  seconds: number | null | undefined,
) {
  if (
    seconds === null ||
    seconds === undefined
  ) {
    return '—'
  }

  const totalMinutes =
    Math.floor(seconds / 60)

  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }

  const hours =
    Math.floor(totalMinutes / 60)

  const minutes =
    totalMinutes % 60

  if (hours < 24) {
    return `${hours}h ${minutes}min`
  }

  const days =
    Math.floor(hours / 24)

  const remainingHours =
    hours % 24

  return `${days}d ${remainingHours}h`
}

export function formatBytes(
  bytes: number,
) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const kb = bytes / 1024

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }

  const mb = kb / 1024

  if (mb < 1024) {
    return `${mb.toFixed(1)} MB`
  }

  return `${(mb / 1024).toFixed(2)} GB`
}

export function formatGiB(
  bytes: number,
) {
  return `${(
    bytes /
    1024 /
    1024 /
    1024
  ).toFixed(2)} GiB`
}

export function formatBackupDate(
  date: string | null,
) {
  if (!date) return '—'

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  ).format(new Date(date))
}

export function getRestoreStep(
  stage: string | null,
) {
  if (!stage) return 0

  const match =
    stage.match(/\[(\d+)\/8\]/)

  if (!match) {
    return stage === 'Concluído'
      ? 8
      : 0
  }

  return Number(match[1])
}

export function getRestoreDescription(
  stage: string | null,
) {
  if (!stage) {
    return 'Preparando restauração...'
  }

  return stage
    .replace(/^\[\d+\/8\]\s*/, '')
    .replace(/\.\.\.$/, '')
}