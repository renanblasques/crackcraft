import {
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  RemovePlayerModal,
} from './RemovePlayerModal'
import { Badge } from './ui/Badge'

import type {
  AllowlistData,
  AllowlistPlayer,
} from '../types/dashboard'

type Props = {
  allowlist: AllowlistData | null
  loading: boolean
  actionLoading: boolean
  error: string | null

  onRefresh: () =>
    void | Promise<unknown>

  onAdd: (
    name: string,
  ) => Promise<unknown>

  onRemove: (
    player: AllowlistPlayer,
  ) => Promise<unknown>
}

export function AllowlistPanel({
  allowlist,
  loading,
  actionLoading,
  error,
  onRefresh,
  onAdd,
  onRemove,
}: Props) {
  const [
    playerName,
    setPlayerName,
  ] = useState('')

  const [
    playerToRemove,
    setPlayerToRemove,
  ] =
    useState<AllowlistPlayer | null>(
      null,
    )

  const handleAdd =
    async () => {
      const name =
        playerName.trim()

      if (!name) {
        return
      }

      try {
        await onAdd(name)

        setPlayerName('')
      } catch {
        // O erro já é tratado
        // pelo hook.
      }
    }

  return (
    <>
      <article className="panel allowlist-panel">
        <div className="panel-title">
          <div>
            <h2>
              Jogadores permitidos
            </h2>

            <p>
              Minecraft Allowlist
            </p>
          </div>

          <button
            type="button"
            className="allowlist-refresh"
            disabled={
              loading ||
              actionLoading
            }
            onClick={() =>
              void onRefresh()
            }
            title="Atualizar lista"
            aria-label="Atualizar lista"
          >
            <RefreshCw
              size={17}
            />
          </button>
        </div>

        {loading &&
        !allowlist ? (
          <div className="allowlist-empty">
            <ShieldCheck
              size={30}
            />

            <strong>
              Carregando jogadores...
            </strong>
          </div>
        ) : error &&
          !allowlist ? (
          <div className="allowlist-empty">
            <strong>
              Não foi possível carregar
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              className="allowlist-retry"
              onClick={() =>
                void onRefresh()
              }
            >
              Tentar novamente
            </button>
          </div>
        ) : allowlist ? (
          <>
            <div className="allowlist-status">
              <div>
                <ShieldCheck
                  size={16}
                />

                <span>
                  {allowlist.playerCount}{' '}
                  {allowlist.playerCount ===
                  1
                    ? 'jogador permitido'
                    : 'jogadores permitidos'}
                </span>
              </div>

              <Badge
                className={
                  allowlist.enabled &&
                  allowlist.enforced
                    ? 'allowlist-badge active'
                    : 'allowlist-badge'
                }
              >
                {allowlist.enabled
                  ? 'Ativada'
                  : 'Desativada'}
              </Badge>
            </div>

            <div className="allowlist-list">
              {allowlist.players.map(
                (player) => (
                  <div
                    className="allowlist-player"
                    key={player.id}
                  >
                    <div className="allowlist-player-info">
                      <strong>
                        {player.name}
                      </strong>

                      <span>
                        {player.id}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="allowlist-remove"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        setPlayerToRemove(
                          player,
                        )
                      }
                      title={`Remover ${player.name}`}
                      aria-label={`Remover ${player.name}`}
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                ),
              )}
            </div>

            <div className="allowlist-add">
              <input
                type="text"
                value={playerName}
                maxLength={16}
                disabled={
                  actionLoading
                }
                placeholder="Nome do jogador"
                onChange={(event) =>
                  setPlayerName(
                    event.target.value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    'Enter'
                  ) {
                    void handleAdd()
                  }
                }}
              />

              <button
                type="button"
                disabled={
                  actionLoading ||
                  !playerName.trim()
                }
                onClick={() =>
                  void handleAdd()
                }
              >
                <UserPlus
                  size={16}
                />

                Adicionar
              </button>
            </div>

            {error && (
              <div className="allowlist-error">
                {error}
              </div>
            )}
          </>
        ) : null}
      </article>

      <RemovePlayerModal
        player={playerToRemove}
        loading={actionLoading}
        onClose={() =>
          setPlayerToRemove(null)
        }
        onConfirm={onRemove}
      />
    </>
  )
}
