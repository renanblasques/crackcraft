import {
  CircleDollarSign,
  RefreshCw,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import type {
  CostData,
} from '../types/dashboard'

type Props = {
  cost: CostData | null
  loading: boolean
  error: string | null

  onRefresh: () =>
    void | Promise<unknown>
}

function formatUsd(
  value: number,
) {
  return new Intl.NumberFormat(
    'pt-BR',
    {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    },
  ).format(value)
}

function formatMonth(
  month: string,
) {
  const [year, monthNumber] =
    month
      .split('-')
      .map(Number)

  if (
    !year ||
    !monthNumber
  ) {
    return month
  }

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      month: 'long',
      year: 'numeric',
    },
  ).format(
    new Date(
      year,
      monthNumber - 1,
      1,
    ),
  )
}

function formatRefreshTime(
  date: string,
) {
  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(
    new Date(date),
  )
}

function getServiceName(
  name: string,
) {
  const names:
    Record<string, string> = {
      'Amazon Elastic Compute Cloud - Compute':
        'EC2',

      'EC2 - Other':
        'EC2 - outros',

      'Amazon Simple Storage Service':
        'S3',

      'Amazon Virtual Private Cloud':
        'Amazon VPC',

      'Amazon API Gateway':
        'API Gateway',

      'AWS Lambda':
        'Lambda',

      'Amazon Cognito':
        'Cognito',

      AmazonCloudWatch:
        'CloudWatch',
    }

  return names[name] ?? name
}

export function CostPanel({
  cost,
  loading,
  error,
  onRefresh,
}: Props) {
  const services =
    cost?.services.filter(
      (service) =>
        Math.abs(
          service.amount,
        ) > 0.000001,
    ) ?? []

  const nextRefreshAt =
    cost?.cache?.nextRefreshAt
      ? new Date(
          cost.cache.nextRefreshAt,
        ).getTime()
      : null

  const [
    reachedRefreshAt,
    setReachedRefreshAt,
  ] = useState<number | null>(null)

  useEffect(() => {
    if (nextRefreshAt === null) {
      return
    }

    const delay =
      Math.max(
        0,
        nextRefreshAt - Date.now(),
      )

    const timeout =
      window.setTimeout(() => {
        setReachedRefreshAt(
          nextRefreshAt,
        )
      }, delay)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [nextRefreshAt])

  const canRefresh =
    !loading &&
    (
      nextRefreshAt === null ||
      reachedRefreshAt ===
        nextRefreshAt
    )

  return (
    <article className="panel">
      <div className="panel-title">
        <div>
          <h2>
            Custo do mês
          </h2>

          <p>
            AWS Cost Explorer
          </p>
        </div>

        <button
          type="button"
          className="cost-refresh"
          disabled={!canRefresh}
          onClick={() =>
            void onRefresh()
          }
          title={
            canRefresh
              ? 'Atualizar custos'
              : 'Os custos ainda estão em cache'
          }
          aria-label="Atualizar custos"
        >
          <RefreshCw
            size={17}
          />
        </button>
      </div>

      {loading && !cost ? (
        <div className="cost-placeholder">
          <CircleDollarSign
            size={30}
          />

          <strong>
            Carregando custos...
          </strong>
        </div>
      ) : error && !cost ? (
        <div className="cost-placeholder">
          <strong>
            Não foi possível carregar
          </strong>

          <span>
            {error}
          </span>
        </div>
      ) : cost ? (
        <div className="cost-content">
          <div className="cost-total">
            <span>
              {formatMonth(
                cost.month,
              )}
            </span>

            <strong>
              {formatUsd(
                cost.totalUsd,
              )}
            </strong>

            <small>
              {cost.estimated
                ? 'Valor parcial / estimado'
                : 'Valor consolidado'}
            </small>
          </div>

          {services.length > 0 ? (
            <div className="cost-services">
              {services.map(
                (service) => (
                  <div
                    className="cost-service-row"
                    key={service.name}
                  >
                    <span>
                      {getServiceName(
                        service.name,
                      )}
                    </span>

                    <strong>
                      {formatUsd(
                        service.amount,
                      )}
                    </strong>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="cost-zero">
              <span>
                Ainda não há custos
                contabilizados pelo
                Cost Explorer.
              </span>
            </div>
          )}

          <div className="cost-footer">
            <span>
              Região: {cost.region}
            </span>

            {cost.cache?.nextRefreshAt && (
              <span>
                Próxima atualização:{' '}
                {formatRefreshTime(
                  cost.cache.nextRefreshAt,
                )}
              </span>
            )}
          </div>
        </div>
      ) : null}
    </article>
  )
}
