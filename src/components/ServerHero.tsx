import { useState } from 'react'

import {
  Check,
  Copy,
  Power,
  RefreshCw,
  Server,
} from 'lucide-react'

import type {
  ServerStatus,
} from '../types/dashboard'

import styles from './ServerHero.module.css'

type Props = {
  status: ServerStatus | null
  loading: boolean
  actionLoading: boolean
  restoreRunning: boolean
  onAction: (
    path: '/start' | '/stop',
  ) => void | Promise<void>
  onRefresh: () => void | Promise<void>
  onError: (message: string) => void
}

export function ServerHero({
  status,
  loading,
  actionLoading,
  restoreRunning,
  onAction,
  onRefresh,
  onError,
}: Props) {
  const [copied, setCopied] = useState(false)

  const visualStatus = (() => {
    switch (status?.serverStatus) {
      case 'online':
        return {
          label: 'Online',
          description: 'Pronto para jogar',
          tone: styles.online,
        }
      case 'starting':
      case 'pending':
        return {
          label: 'Ligando',
          description: 'Iniciando a instância AWS',
          tone: styles.starting,
        }
      case 'starting-minecraft':
        return {
          label: 'Carregando',
          description: 'Minecraft está iniciando',
          tone: styles.starting,
        }
      case 'stopping':
        return {
          label: 'Desligando',
          description: 'Salvando o mundo',
          tone: styles.starting,
        }
      default:
        return {
          label: 'Offline',
          description: 'Servidor desligado',
          tone: styles.offline,
        }
    }
  })()

  const isStopped =
    status?.ec2State === 'stopped'

  const isTransitioning =
    status?.ec2State === 'pending' ||
    status?.ec2State === 'stopping'

  async function copyAddress() {
    if (!status?.address) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        status.address,
      )
      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      onError(
        'Não foi possível copiar o endereço',
      )
    }
  }

  return (
    <section
      className={styles.controlBar}
      aria-label="Controle do servidor"
    >
      <div className={styles.statusGroup}>
        <div className={styles.serverIcon}>
          <Server size={23} />
        </div>

        <div>
          <div className={styles.statusLine}>
            <span
              className={`${styles.statusDot} ${visualStatus.tone}`}
            />
            <strong>{visualStatus.label}</strong>
          </div>
          <span className={styles.statusDescription}>
            {visualStatus.description}
          </span>
        </div>
      </div>

      <div className={styles.address}>
        <small>Endereço do servidor</small>
        <strong>
          {status?.address ?? 'Disponível quando online'}
        </strong>

        {status?.address && (
          <button
            type="button"
            onClick={() => void copyAddress()}
            className={styles.copyButton}
            aria-label="Copiar endereço do servidor"
          >
            {copied ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={
            isStopped
              ? styles.startButton
              : styles.stopButton
          }
          disabled={
            actionLoading ||
            loading ||
            isTransitioning ||
            restoreRunning
          }
          onClick={() =>
            void onAction(
              isStopped ? '/start' : '/stop',
            )
          }
        >
          <Power size={17} />
          {actionLoading
            ? 'Aguarde...'
            : status?.ec2State === 'pending'
              ? 'Ligando...'
              : status?.ec2State === 'stopping'
                ? 'Desligando...'
                : isStopped
                  ? 'Ligar servidor'
                  : 'Desligar servidor'}
        </button>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={() => void onRefresh()}
          disabled={loading}
          aria-label="Atualizar status"
          title="Atualizar status"
        >
          <RefreshCw
            size={17}
            className={loading ? styles.spinning : ''}
          />
        </button>
      </div>
    </section>
  )
}
