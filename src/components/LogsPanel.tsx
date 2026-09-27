import {
  RefreshCw,
  Terminal,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type {
  LogLineLimit,
  MinecraftLogs,
} from '../types/dashboard'

type LogFilter =
  | 'all'
  | 'info'
  | 'warn'
  | 'error'

type Props = {
  logs: MinecraftLogs | null
  loading: boolean
  error: string | null
  lineLimit: LogLineLimit

  onRefresh: () =>
    void | Promise<unknown>

  onLineLimitChange: (
    limit: LogLineLimit,
  ) => void
}

function getLogLevel(
  line: string,
): Exclude<LogFilter, 'all'> {
  if (
    line.includes('/ERROR]') ||
    line.includes('[ERROR]')
  ) {
    return 'error'
  }

  if (
    line.includes('/WARN]') ||
    line.includes('[WARN]')
  ) {
    return 'warn'
  }

  return 'info'
}

function formatUpdatedAt(
  value: string,
) {
  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  ).format(date)
}

export function LogsPanel({
  logs,
  loading,
  error,
  lineLimit,
  onRefresh,
  onLineLimitChange,
}: Props) {
  const [
    filter,
    setFilter,
  ] =
    useState<LogFilter>('all')

  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const filteredLines =
    useMemo(() => {
      const lines =
        logs?.lines ?? []

      if (
        filter === 'all'
      ) {
        return lines
      }

      return lines.filter(
        (line) =>
          getLogLevel(line) ===
          filter,
      )
    }, [
      logs,
      filter,
    ])

  useEffect(() => {
    const container =
      containerRef.current

    if (!container) {
      return
    }

    container.scrollTop =
      container.scrollHeight
  }, [
    filteredLines,
  ])

  return (
    <article className="panel logs-panel">
      <div className="panel-title">
        <div>
          <h2>
            Logs do servidor
          </h2>

          <p>
            latest.log
          </p>
        </div>

        <button
          type="button"
          className="logs-refresh"
          disabled={loading}
          onClick={() =>
            void onRefresh()
          }
          title="Atualizar logs"
          aria-label="Atualizar logs"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? 'logs-refresh-spinning'
                : undefined
            }
          />
        </button>
      </div>

      {loading &&
      !logs ? (
        <div className="logs-empty">
          <Terminal
            size={30}
          />

          <strong>
            Carregando logs...
          </strong>
        </div>
      ) : error &&
        !logs ? (
        <div className="logs-empty">
          <Terminal
            size={30}
          />

          <strong>
            Não foi possível carregar
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            className="logs-retry"
            onClick={() =>
              void onRefresh()
            }
          >
            Tentar novamente
          </button>
        </div>
      ) : logs ? (
        <>
          <div className="logs-toolbar">
            <div className="logs-filters">
              <button
                type="button"
                className={
                  filter === 'all'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setFilter('all')
                }
              >
                Todos
              </button>

              <button
                type="button"
                className={
                  filter === 'info'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setFilter('info')
                }
              >
                INFO
              </button>

              <button
                type="button"
                className={
                  filter === 'warn'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setFilter('warn')
                }
              >
                WARN
              </button>

              <button
                type="button"
                className={
                  filter === 'error'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setFilter('error')
                }
              >
                ERROR
              </button>
            </div>

            <select
              className="logs-limit"
              value={lineLimit}
              disabled={loading}
              onChange={(event) =>
                onLineLimitChange(
                  Number(
                    event.target.value,
                  ) as LogLineLimit,
                )
              }
              aria-label="Quantidade de linhas"
            >
              <option value={50}>
                50 linhas
              </option>

              <option value={100}>
                100 linhas
              </option>

              <option value={200}>
                200 linhas
              </option>

              <option value={500}>
                500 linhas
              </option>
            </select>
          </div>

          <div
            ref={containerRef}
            className="logs-terminal"
          >
            {filteredLines.length >
            0 ? (
              filteredLines.map(
                (line, index) => {
                  const level =
                    getLogLevel(
                      line,
                    )

                  return (
                    <div
                      key={`${index}-${line}`}
                      className={`logs-line logs-line-${level}`}
                    >
                      {line}
                    </div>
                  )
                },
              )
            ) : (
              <div className="logs-no-results">
                Nenhuma linha para este filtro.
              </div>
            )}
          </div>

          <div className="logs-footer">
            <span>
              {
                filteredLines.length
              }{' '}
              de {logs.lineCount}{' '}
              linhas
            </span>

            <span>
              Atualizado às{' '}
              {formatUpdatedAt(
                logs.updatedAt,
              )}
            </span>
          </div>

          {error && (
            <div className="logs-error">
              {error}
            </div>
          )}
        </>
      ) : null}
    </article>
  )
}