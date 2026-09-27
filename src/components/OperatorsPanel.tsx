import {
  RefreshCw,
  Shield,
  ShieldMinus,
  ShieldPlus,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  RemoveOperatorModal,
} from './RemoveOperatorModal'
import { Badge } from './ui/Badge'

import type {
  MinecraftOperator,
  OperatorsData,
} from '../types/dashboard'

type Props = {
  operators: OperatorsData | null
  loading: boolean
  actionLoading: boolean
  error: string | null

  onRefresh: () =>
    void | Promise<unknown>

  onAdd: (
    name: string,
    permissionLevel?: number,
    bypassesPlayerLimit?: boolean,
  ) => Promise<unknown>

  onRemove: (
    operator: MinecraftOperator,
  ) => Promise<unknown>
}

export function OperatorsPanel({
  operators,
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
    permissionLevel,
    setPermissionLevel,
  ] = useState(4)

  const [
    bypassesPlayerLimit,
    setBypassesPlayerLimit,
  ] = useState(false)

  const [
    operatorToRemove,
    setOperatorToRemove,
  ] =
    useState<MinecraftOperator | null>(
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
        await onAdd(
          name,
          permissionLevel,
          bypassesPlayerLimit,
        )

        setPlayerName('')
      } catch {
        // Erro tratado pelo hook
      }
    }

  return (
    <>
      <article className="panel operators-panel">
        <div className="panel-title">
          <div>
            <h2>
              Operadores
            </h2>

            <p>
              Permissões administrativas
            </p>
          </div>

          <button
            type="button"
            className="operators-refresh"
            disabled={
              loading ||
              actionLoading
            }
            onClick={() =>
              void onRefresh()
            }
            title="Atualizar operadores"
            aria-label="Atualizar operadores"
          >
            <RefreshCw size={17} />
          </button>
        </div>

        {loading &&
        !operators ? (
          <div className="operators-empty">
            <Shield size={30} />

            <strong>
              Carregando operadores...
            </strong>
          </div>
        ) : error &&
          !operators ? (
          <div className="operators-empty">
            <strong>
              Não foi possível carregar
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              className="operators-retry"
              onClick={() =>
                void onRefresh()
              }
            >
              Tentar novamente
            </button>
          </div>
        ) : operators ? (
          <>
            <div className="operators-status">
              <div>
                <Shield size={16} />

                <span>
                  {operators.operatorCount}{' '}
                  {operators.operatorCount ===
                  1
                    ? 'operador'
                    : 'operadores'}
                </span>
              </div>

              <Badge className="operators-badge">
                Padrão: nível{' '}
                {
                  operators.defaultPermissionLevel
                }
              </Badge>
            </div>

            <div className="operators-list">
              {operators.operators.map(
                (operator) => (
                  <div
                    className="operator-row"
                    key={
                      operator.player.id
                    }
                  >
                    <div className="operator-info">
                      <strong>
                        {
                          operator.player
                            .name
                        }
                      </strong>

                      <span>
                        Nível{' '}
                        {
                          operator.permissionLevel
                        }

                        {' · '}

                        {operator.bypassesPlayerLimit
                          ? 'Ignora limite de jogadores'
                          : 'Respeita limite de jogadores'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="operator-remove"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        setOperatorToRemove(
                          operator,
                        )
                      }
                      title={`Remover OP de ${operator.player.name}`}
                      aria-label={`Remover OP de ${operator.player.name}`}
                    >
                      <ShieldMinus
                        size={16}
                      />
                    </button>
                  </div>
                ),
              )}
            </div>

            <div className="operator-add">
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
              />

              <select
                value={permissionLevel}
                disabled={
                  actionLoading
                }
                onChange={(event) =>
                  setPermissionLevel(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              >
                <option value={1}>
                  Nível 1
                </option>

                <option value={2}>
                  Nível 2
                </option>

                <option value={3}>
                  Nível 3
                </option>

                <option value={4}>
                  Nível 4
                </option>
              </select>

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
                <ShieldPlus
                  size={16}
                />

                Dar OP
              </button>
            </div>

            <label className="operator-bypass">
              <input
                type="checkbox"
                checked={
                  bypassesPlayerLimit
                }
                disabled={
                  actionLoading
                }
                onChange={(event) =>
                  setBypassesPlayerLimit(
                    event.target.checked,
                  )
                }
              />

              Ignorar limite máximo de
              jogadores
            </label>

            {error && (
              <div className="operators-error">
                {error}
              </div>
            )}
          </>
        ) : null}
      </article>

      <RemoveOperatorModal
        operator={operatorToRemove}
        loading={actionLoading}
        onClose={() =>
          setOperatorToRemove(null)
        }
        onConfirm={onRemove}
      />
    </>
  )
}
