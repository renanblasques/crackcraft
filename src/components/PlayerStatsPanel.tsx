import {
  Clock,
  Footprints,
  Package,
  Pickaxe,
  RefreshCw,
  Skull,
} from 'lucide-react'

import type {
  PlayerStatItem,
  PlayerStatsData,
} from '../types/dashboard'

type Props = {
  data: PlayerStatsData | null
  loading: boolean
  error: string | null

  onRefresh: () =>
    void | Promise<unknown>
}

function formatDuration(
  totalSeconds: number,
) {
  const seconds =
    Math.max(
      0,
      Math.floor(totalSeconds),
    )

  const days =
    Math.floor(
      seconds / 86400,
    )

  const hours =
    Math.floor(
      (seconds % 86400) /
        3600,
    )

  const minutes =
    Math.floor(
      (seconds % 3600) /
        60,
    )

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}min`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }

  return `${minutes}min`
}

function formatDistance(
  meters: number,
) {
  if (meters >= 1000) {
    return `${(
      meters / 1000
    ).toLocaleString(
      'pt-BR',
      {
        maximumFractionDigits: 2,
      },
    )} km`
  }

  return `${meters.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2,
    },
  )} m`
}

function formatMinecraftName(
  name: string,
) {
  return name
    .replace(
      /^minecraft:/,
      '',
    )
    .replaceAll('_', ' ')
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    )
}

function TopStats({
  title,
  items,
}: {
  title: string
  items: PlayerStatItem[]
}) {
  if (
    items.length === 0
  ) {
    return null
  }

  return (
    <div className="player-stats-top">
      <span className="player-stats-top-title">
        {title}
      </span>

      <div className="player-stats-top-list">
        {items.map(
          (item) => (
            <div
              key={item.name}
              className="player-stats-top-item"
            >
              <span>
                {formatMinecraftName(
                  item.name,
                )}
              </span>

              <strong>
                {item.count.toLocaleString(
                  'pt-BR',
                )}
              </strong>
            </div>
          ),
        )}
      </div>
    </div>
  )
}

export function PlayerStatsPanel({
  data,
  loading,
  error,
  onRefresh,
}: Props) {
  return (
    <article className="panel player-stats-panel">
      <div className="panel-title">
        <div>
          <h2>
            Estatísticas dos jogadores
          </h2>

          <p>
            Progresso acumulado no mundo
          </p>
        </div>

        <button
          type="button"
          className="player-stats-refresh"
          disabled={loading}
          onClick={() =>
            void onRefresh()
          }
          title="Atualizar estatísticas"
          aria-label="Atualizar estatísticas"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? 'player-stats-spinning'
                : undefined
            }
          />
        </button>
      </div>

      {loading &&
      !data ? (
        <div className="player-stats-empty">
          Carregando estatísticas...
        </div>
      ) : error &&
        !data ? (
        <div className="player-stats-empty">
          <strong>
            Não foi possível carregar
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              void onRefresh()
            }
          >
            Tentar novamente
          </button>
        </div>
      ) : data ? (
        <>
          <div className="player-stats-grid">
            {data.players.map(
              (player) => {
                const totalDistance =
                  player.distance
                    .walkedMeters +
                  player.distance
                    .sprintedMeters +
                  player.distance
                    .flownMeters +
                  player.distance
                    .crouchedMeters +
                  player.distance
                    .climbedMeters

                return (
                  <section
                    key={player.id}
                    className="player-stat-card"
                  >
                    <div className="player-stat-header">
                      <div className="player-stat-avatar">
                        {player.name
                          .slice(
                            0,
                            1,
                          )
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3>
                          {player.name}
                        </h3>

                        <span>
                          {formatDuration(
                            player.playTimeSeconds,
                          )}{' '}
                          jogados
                        </span>
                      </div>
                    </div>

                    <div className="player-stat-primary">
                      <div>
                        <Clock
                          size={15}
                        />

                        <span>
                          Tempo jogado
                        </span>

                        <strong>
                          {formatDuration(
                            player.playTimeSeconds,
                          )}
                        </strong>
                      </div>

                      <div>
                        <Skull
                          size={15}
                        />

                        <span>
                          Mortes
                        </span>

                        <strong>
                          {player.deaths}
                        </strong>
                      </div>

                      <div>
                        <Pickaxe
                          size={15}
                        />

                        <span>
                          Blocos minerados
                        </span>

                        <strong>
                          {player.blocksMined.toLocaleString(
                            'pt-BR',
                          )}
                        </strong>
                      </div>

                      <div>
                        <Package
                          size={15}
                        />

                        <span>
                          Itens criados
                        </span>

                        <strong>
                          {player.itemsCrafted.toLocaleString(
                            'pt-BR',
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="player-stat-section">
                      <div className="player-stat-section-title">
                        <Footprints
                          size={14}
                        />

                        <span>
                          Distância
                        </span>

                        <strong>
                          {formatDistance(
                            totalDistance,
                          )}
                        </strong>
                      </div>

                      <div className="player-stat-distance">
                        <div>
                          <span>
                            Andando
                          </span>

                          <strong>
                            {formatDistance(
                              player
                                .distance
                                .walkedMeters,
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Correndo
                          </span>

                          <strong>
                            {formatDistance(
                              player
                                .distance
                                .sprintedMeters,
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Voando
                          </span>

                          <strong>
                            {formatDistance(
                              player
                                .distance
                                .flownMeters,
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="player-stat-secondary">
                      <div>
                        <span>
                          Pulos
                        </span>

                        <strong>
                          {player.jumps.toLocaleString(
                            'pt-BR',
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Mobs mortos
                        </span>

                        <strong>
                          {player.mobKills.toLocaleString(
                            'pt-BR',
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Itens coletados
                        </span>

                        <strong>
                          {player.itemsPickedUp.toLocaleString(
                            'pt-BR',
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Itens usados
                        </span>

                        <strong>
                          {player.itemsUsed.toLocaleString(
                            'pt-BR',
                          )}
                        </strong>
                      </div>
                    </div>

                    <TopStats
                      title="Blocos mais minerados"
                      items={
                        player.topMinedBlocks
                      }
                    />

                    <TopStats
                      title="Itens mais criados"
                      items={
                        player.topCraftedItems
                      }
                    />

                    <TopStats
                      title="Entidades mais eliminadas"
                      items={
                        player.killedEntities
                      }
                    />
                  </section>
                )
              },
            )}
          </div>

          {error && (
            <div className="player-stats-error">
              {error}
            </div>
          )}
        </>
      ) : null}
    </article>
  )
}