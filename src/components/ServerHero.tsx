import { useState } from 'react'

import {
  Copy,
  Power,
  RefreshCw,
  Server,
} from 'lucide-react'

import type {
  ServerStatus,
} from '../types/dashboard'

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
  const [copied, setCopied] =
    useState(false)

  const visualStatus = (() => {
    switch (status?.serverStatus) {
      case 'online':
        return {
          label: 'Online',
          description:
            'Pronto para jogar',
          className: 'online',
        }

      case 'starting':
      case 'pending':
        return {
          label: 'Ligando',
          description:
            'Iniciando a instância AWS',
          className: 'starting',
        }

      case 'starting-minecraft':
        return {
          label: 'Carregando',
          description:
            'Minecraft está iniciando',
          className: 'starting',
        }

      case 'stopping':
        return {
          label: 'Desligando',
          description:
            'Salvando o mundo e desligando',
          className: 'starting',
        }

      default:
        return {
          label: 'Offline',
          description:
            'Servidor desligado',
          className: 'offline',
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
    <section className="hero-card">
      <div className="server-heading">
        <div className="server-icon">
          <Server size={28} />
        </div>

        <div>
          <div className="status-line">
            <span
              className={`status-dot ${visualStatus.className}`}
            />

            <strong>
              {visualStatus.label}
            </strong>
          </div>

          <p>
            {visualStatus.description}
          </p>
        </div>
      </div>

      {status?.address ? (
        <div className="address-box">
          <div>
            <span>
              Endereço do servidor
            </span>

            <strong>
              {status.address}
            </strong>
          </div>

          <button
            type="button"
            onClick={() =>
              void copyAddress()
            }
          >
            <Copy size={17} />

            {copied
              ? 'Copiado!'
              : 'Copiar'}
          </button>
        </div>
      ) : (
        <div className="address-box disabled">
          <div>
            <span>
              Endereço do servidor
            </span>

            <strong>
              Disponível quando o servidor estiver online
            </strong>
          </div>
        </div>
      )}

      <div className="hero-actions">
        <button
          type="button"
          className={
            isStopped
              ? 'primary-button'
              : 'danger-button'
          }
          disabled={
            actionLoading ||
            loading ||
            isTransitioning ||
            restoreRunning
          }
          onClick={() =>
            void onAction(
              isStopped
                ? '/start'
                : '/stop',
            )
          }
        >
          <Power size={18} />

          {actionLoading
            ? 'Aguarde...'
            : status?.ec2State ===
                'pending'
              ? 'Ligando...'
              : status?.ec2State ===
                  'stopping'
                ? 'Desligando...'
                : isStopped
                  ? 'Ligar servidor'
                  : 'Desligar servidor'}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            void onRefresh()
          }
          disabled={loading}
        >
          <RefreshCw size={18} />

          Atualizar
        </button>
      </div>
    </section>
  )
}