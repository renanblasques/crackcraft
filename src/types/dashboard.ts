export type ServerStatus = {
  serverStatus: string
  ec2State: string
  minecraftOnline: boolean
  publicIp: string | null
  address: string | null
  privateIp: string | null
  instanceType: string | null
  launchTime: string | null
}

export type MinecraftPlayer = {
  id: string
  name: string
}

export type SystemMetrics = {
  sampledAt: string

  cpu: {
    usagePercent: number
    vcpus: number

    loadAverage: {
      oneMinute: number
      fiveMinutes: number
      fifteenMinutes: number
    }
  }

  memory: {
    usedBytes: number
    totalBytes: number
    availableBytes: number
    usagePercent: number
  }

  disk: {
    path: string
    usedBytes: number
    totalBytes: number
    availableBytes: number
    usagePercent: number
  }

  uptimeSeconds: number

  platform: {
    hostname: string
    arch: string
    release: string
  }
}

export type MinecraftData = {
  online: boolean
  players: MinecraftPlayer[]
  playerCount: number

  version: {
    name: string
    protocol: number
  } | null

  metrics: SystemMetrics | null

  agentAvailable?: boolean
  error?: string
}

export type Backup = {
  key: string
  name: string
  size: number
  lastModified: string | null
}

export type BackupsData = {
  backups: Backup[]
  count: number
}

export type BackupActionResponse = {
  accepted: boolean
  message?: string
}

export type BackupDownloadResponse = {
  url?: string
}

export type BackupStatus = {
  running: boolean
  lastStartedAt: string | null
  lastFinishedAt: string | null
  lastSuccess: boolean | null
  lastError: string | null
}

export type RestoreStatus = {
  running: boolean
  backupName: string | null
  stage: string | null
  lastStartedAt: string | null
  lastFinishedAt: string | null
  lastSuccess: boolean | null
  lastError: string | null
}

export type CostService = {
  name: string
  amount: number
  unit: string
}

export type CostData = {
  month: string

  period: {
    start: string
    end: string
  }

  region: string
  currency: string
  totalUsd: number
  estimated: boolean

  services: CostService[]

  updatedAt: string

  cache: CostCache
}

export type CostCache = {
  hit: boolean
  cachedAt: string
  nextRefreshAt: string
  ttlHours: number
  stale?: boolean
}

export type AllowlistPlayer = {
  id: string
  name: string
}

export type AllowlistData = {
  players: AllowlistPlayer[]
  playerCount: number
  enabled: boolean
  enforced: boolean
}

export type AllowlistMutationResult = {
  players: AllowlistPlayer[]
  playerCount: number

  added?: AllowlistPlayer
  removed?: AllowlistPlayer
}

export type OperatorPlayer = {
  id: string
  name: string
}

export type MinecraftOperator = {
  player: OperatorPlayer
  permissionLevel: number
  bypassesPlayerLimit: boolean
}

export type OperatorsData = {
  operators: MinecraftOperator[]
  operatorCount: number
  defaultPermissionLevel: number
}

export type OperatorsMutationResult = {
  operators: MinecraftOperator[]
  operatorCount: number

  added?: MinecraftOperator

  removed?: {
    id: string
    name: string
  }
}

export type MinecraftDifficulty =
  | 'peaceful'
  | 'easy'
  | 'normal'
  | 'hard'

export type MinecraftGameMode =
  | 'survival'
  | 'creative'
  | 'adventure'
  | 'spectator'

export type ServerSettings = {
  difficulty: MinecraftDifficulty
  gameMode: MinecraftGameMode
  maxPlayers: number
  motd: string
  viewDistance: number
  simulationDistance: number
  spawnProtectionRadius: number
  pauseWhenEmptySeconds: number
  playerIdleTimeout: number
  allowFlight: boolean
  forceGameMode: boolean
  operatorPermissionLevel: number
}

export type UpdateServerSettingsResponse = {
  updated: boolean
  settings: ServerSettings
}

export type LogLineLimit =
  | 50
  | 100
  | 200
  | 500

export type MinecraftLogs = {
  lines: string[]
  lineCount: number
  updatedAt: string
  requestedLines: number
}

export type PlayerStatItem = {
  name: string
  count: number
}

export type PlayerDistance = {
  walkedMeters: number
  sprintedMeters: number
  flownMeters: number
  crouchedMeters: number
  climbedMeters: number
}

export type PlayerStats = {
  id: string
  name: string

  playTimeSeconds: number

  deaths: number
  jumps: number
  sessions: number

  mobKills: number
  playerKills: number

  blocksMined: number
  itemsCrafted: number
  itemsPickedUp: number
  itemsUsed: number

  distance: PlayerDistance

  topMinedBlocks: PlayerStatItem[]
  topCraftedItems: PlayerStatItem[]

  killedEntities: PlayerStatItem[]
  killedByEntities: PlayerStatItem[]

  dataVersion: number | null
}

export type PlayerStatsData = {
  players: PlayerStats[]
  playerCount: number
  updatedAt: string
}
