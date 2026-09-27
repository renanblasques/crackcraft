import {
  RefreshCw,
  RotateCcw,
  Save,
  Settings2,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import type {
  MinecraftDifficulty,
  MinecraftGameMode,
  ServerSettings,
} from '../types/dashboard'

type Props = {
  settings: ServerSettings | null
  loading: boolean
  saving: boolean
  error: string | null

  onRefresh: () =>
    void | Promise<unknown>

  onSave: (
    changes: Partial<ServerSettings>,
  ) => Promise<unknown>
}

export function SettingsPanel({
  settings,
  loading,
  saving,
  error,
  onRefresh,
  onSave,
}: Props) {
  const [
    form,
    setForm,
  ] =
    useState<ServerSettings | null>(settings)

  const [
    formSource,
    setFormSource,
  ] =
    useState<ServerSettings | null>(settings)

  const [
    savedMessage,
    setSavedMessage,
  ] = useState(false)

  if (settings !== formSource) {
    setFormSource(settings)
    setForm(settings)
  }

  const changes =
    useMemo(() => {
      if (
        !settings ||
        !form
      ) {
        return {}
      }

      const result:
        Partial<ServerSettings> = {}

      if (
        form.difficulty !==
        settings.difficulty
      ) {
        result.difficulty =
          form.difficulty
      }

      if (
        form.gameMode !==
        settings.gameMode
      ) {
        result.gameMode =
          form.gameMode
      }

      if (
        form.maxPlayers !==
        settings.maxPlayers
      ) {
        result.maxPlayers =
          form.maxPlayers
      }

      if (
        form.motd !==
        settings.motd
      ) {
        result.motd =
          form.motd
      }

      if (
        form.viewDistance !==
        settings.viewDistance
      ) {
        result.viewDistance =
          form.viewDistance
      }

      if (
        form.simulationDistance !==
        settings.simulationDistance
      ) {
        result.simulationDistance =
          form.simulationDistance
      }

      if (
        form.spawnProtectionRadius !==
        settings.spawnProtectionRadius
      ) {
        result.spawnProtectionRadius =
          form.spawnProtectionRadius
      }

      if (
        form.pauseWhenEmptySeconds !==
        settings.pauseWhenEmptySeconds
      ) {
        result.pauseWhenEmptySeconds =
          form.pauseWhenEmptySeconds
      }

      if (
        form.playerIdleTimeout !==
        settings.playerIdleTimeout
      ) {
        result.playerIdleTimeout =
          form.playerIdleTimeout
      }

      if (
        form.allowFlight !==
        settings.allowFlight
      ) {
        result.allowFlight =
          form.allowFlight
      }

      if (
        form.forceGameMode !==
        settings.forceGameMode
      ) {
        result.forceGameMode =
          form.forceGameMode
      }

      if (
        form.operatorPermissionLevel !==
        settings.operatorPermissionLevel
      ) {
        result.operatorPermissionLevel =
          form.operatorPermissionLevel
      }

      return result
    }, [
      settings,
      form,
    ])

  const hasChanges =
    Object.keys(
      changes,
    ).length > 0

  const updateField =
    <K extends keyof ServerSettings>(
      key: K,
      value: ServerSettings[K],
    ) => {
      setSavedMessage(false)

      setForm(
        (current) => {
          if (!current) {
            return current
          }

          return {
            ...current,
            [key]: value,
          }
        },
      )
    }

  const handleSave =
    async () => {
      if (!hasChanges) {
        return
      }

      try {
        await onSave(changes)

        setSavedMessage(true)

        window.setTimeout(
          () => {
            setSavedMessage(
              false,
            )
          },
          2500,
        )
      } catch {
        // O erro já é tratado
        // pelo hook.
      }
    }

  const handleReset =
    () => {
      if (settings) {
        setForm(settings)
      }

      setSavedMessage(false)
    }

  return (
    <article className="panel settings-panel">
      <div className="panel-title">
        <div>
          <h2>
            Configurações
          </h2>

          <p>
            Minecraft Server
          </p>
        </div>

        <button
          type="button"
          className="settings-refresh"
          disabled={
            loading ||
            saving
          }
          onClick={() =>
            void onRefresh()
          }
          title="Atualizar configurações"
          aria-label="Atualizar configurações"
        >
          <RefreshCw
            size={17}
          />
        </button>
      </div>

      {loading &&
      !form ? (
        <div className="settings-empty">
          <Settings2
            size={30}
          />

          <strong>
            Carregando configurações...
          </strong>
        </div>
      ) : error &&
        !form ? (
        <div className="settings-empty">
          <strong>
            Não foi possível carregar
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            className="settings-retry"
            onClick={() =>
              void onRefresh()
            }
          >
            Tentar novamente
          </button>
        </div>
      ) : form ? (
        <>
          <div className="settings-section">
            <h3>
              Geral
            </h3>

            <div className="settings-grid">
              <label className="settings-field">
                <span>
                  MOTD
                </span>

                <input
                  type="text"
                  value={
                    form.motd
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'motd',
                      event.target
                        .value,
                    )
                  }
                />
              </label>

              <label className="settings-field">
                <span>
                  Máx. jogadores
                </span>

                <input
                  type="number"
                  min={1}
                  value={
                    form.maxPlayers
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'maxPlayers',
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                />
              </label>

              <label className="settings-field">
                <span>
                  Dificuldade
                </span>

                <select
                  value={
                    form.difficulty
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'difficulty',
                      event.target
                        .value as MinecraftDifficulty,
                    )
                  }
                >
                  <option value="peaceful">
                    Pacífico
                  </option>

                  <option value="easy">
                    Fácil
                  </option>

                  <option value="normal">
                    Normal
                  </option>

                  <option value="hard">
                    Difícil
                  </option>
                </select>
              </label>

              <label className="settings-field">
                <span>
                  Modo de jogo
                </span>

                <select
                  value={
                    form.gameMode
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'gameMode',
                      event.target
                        .value as MinecraftGameMode,
                    )
                  }
                >
                  <option value="survival">
                    Survival
                  </option>

                  <option value="creative">
                    Creative
                  </option>

                  <option value="adventure">
                    Adventure
                  </option>

                  <option value="spectator">
                    Spectator
                  </option>
                </select>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>
              Mundo e desempenho
            </h3>

            <div className="settings-grid">
              <label className="settings-field">
                <span>
                  Distância de visão
                </span>

                <input
                  type="number"
                  min={1}
                  value={
                    form.viewDistance
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'viewDistance',
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                />
              </label>

              <label className="settings-field">
                <span>
                  Distância de simulação
                </span>

                <input
                  type="number"
                  min={1}
                  value={
                    form.simulationDistance
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'simulationDistance',
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                />
              </label>

              <label className="settings-field">
                <span>
                  Proteção do spawn
                </span>

                <input
                  type="number"
                  min={0}
                  value={
                    form.spawnProtectionRadius
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'spawnProtectionRadius',
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                />
              </label>

              <label className="settings-field">
                <span>
                  Pausar quando vazio
                </span>

                <input
                  type="number"
                  min={0}
                  value={
                    form.pauseWhenEmptySeconds
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'pauseWhenEmptySeconds',
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                />

                <small>
                  segundos
                </small>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>
              Jogadores e permissões
            </h3>

            <div className="settings-grid">
              <label className="settings-field">
                <span>
                  Timeout por inatividade
                </span>

                <input
                  type="number"
                  min={0}
                  value={
                    form.playerIdleTimeout
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'playerIdleTimeout',
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                />

                <small>
                  0 = desativado
                </small>
              </label>

              <label className="settings-field">
                <span>
                  Nível OP padrão
                </span>

                <select
                  value={
                    form.operatorPermissionLevel
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'operatorPermissionLevel',
                      Number(
                        event.target
                          .value,
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
              </label>
            </div>

            <div className="settings-toggles">
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={
                    form.allowFlight
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'allowFlight',
                      event.target
                        .checked,
                    )
                  }
                />

                <div>
                  <strong>
                    Permitir voo
                  </strong>

                  <span>
                    Permite voo em
                    Survival quando
                    suportado pelo
                    cliente/mod.
                  </span>
                </div>
              </label>

              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={
                    form.forceGameMode
                  }
                  disabled={
                    saving
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'forceGameMode',
                      event.target
                        .checked,
                    )
                  }
                />

                <div>
                  <strong>
                    Forçar modo de jogo
                  </strong>

                  <span>
                    Jogadores entram no
                    modo padrão definido
                    acima.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="settings-error">
              {error}
            </div>
          )}

          <div className="settings-footer">
            <div className="settings-state">
              {savedMessage ? (
                <span className="settings-saved">
                  Alterações salvas.
                </span>
              ) : hasChanges ? (
                <span>
                  Existem alterações
                  não salvas.
                </span>
              ) : (
                <span>
                  Configurações atualizadas.
                </span>
              )}
            </div>

            <div className="settings-actions">
              <button
                type="button"
                className="settings-reset"
                disabled={
                  saving ||
                  !hasChanges
                }
                onClick={
                  handleReset
                }
              >
                <RotateCcw
                  size={15}
                />

                Descartar
              </button>

              <button
                type="button"
                className="settings-save"
                disabled={
                  saving ||
                  !hasChanges
                }
                onClick={() =>
                  void handleSave()
                }
              >
                <Save
                  size={15}
                />

                {saving
                  ? 'Salvando...'
                  : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </article>
  )
}
