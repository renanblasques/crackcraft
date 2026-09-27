import {
  Clock3,
  Cpu,
  HardDrive,
  MemoryStick,
  Users,
} from 'lucide-react'

import type {
  MinecraftData,
  ServerStatus,
} from '../types/dashboard'

import {
  formatDuration,
  formatGiB,
  formatUptime,
} from '../utils/formatters'

type Props = {
  status: ServerStatus | null
  minecraft: MinecraftData | null
}

export function StatsGrid({
  status,
  minecraft,
}: Props) {
  const metrics =
    minecraft?.metrics ?? null

  const playerCount =
    minecraft?.playerCount ?? 0

  const isRunning =
    status?.ec2State === 'running'

  return (
    <section className="stats-grid">
      <article className="stat-card">
        <div className="stat-icon">
          <Users size={21} />
        </div>

        <span>Jogadores</span>

        <strong>
          {playerCount} / 5
        </strong>

        <small>
          {minecraft?.online
            ? `Minecraft ${
                minecraft.version?.name ?? ''
              }`
            : 'Servidor offline'}
        </small>
      </article>

      <article className="stat-card">
        <div className="stat-icon">
          <Cpu size={21} />
        </div>

        <span>CPU</span>

        <strong>
          {metrics
            ? `${metrics.cpu.usagePercent.toFixed(
                1,
              )}%`
            : '—'}
        </strong>

        <small>
          {metrics
            ? `${metrics.cpu.vcpus} vCPU · ${
                status?.instanceType ?? '—'
              }`
            : status?.instanceType ?? '—'}
        </small>
      </article>

      <article className="stat-card">
        <div className="stat-icon">
          <MemoryStick size={21} />
        </div>

        <span>Memória</span>

        <strong>
          {metrics
            ? `${formatGiB(
                metrics.memory.usedBytes,
              )} / ${formatGiB(
                metrics.memory.totalBytes,
              )}`
            : '—'}
        </strong>

        <small>
          {metrics
            ? `${metrics.memory.usagePercent.toFixed(
                1,
              )}% em uso`
            : 'RAM da instância'}
        </small>
      </article>

      <article className="stat-card">
        <div className="stat-icon">
          <HardDrive size={21} />
        </div>

        <span>Armazenamento</span>

        <strong>
          {metrics
            ? `${formatGiB(
                metrics.disk.usedBytes,
              )} / ${formatGiB(
                metrics.disk.totalBytes,
              )}`
            : '—'}
        </strong>

        <small>
          {metrics
            ? `${metrics.disk.usagePercent.toFixed(
                1,
              )}% em uso · EBS`
            : 'Amazon EBS gp3'}
        </small>
      </article>

      <article className="stat-card">
        <div className="stat-icon">
          <Clock3 size={21} />
        </div>

        <span>Sessão atual</span>

        <strong>
          {isRunning
            ? metrics
              ? formatDuration(
                  metrics.uptimeSeconds,
                )
              : formatUptime(
                  status?.launchTime,
                )
            : '—'}
        </strong>

        <small>
          Tempo que a EC2 está ligada
        </small>
      </article>
    </section>
  )
}