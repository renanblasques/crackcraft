import { Users } from 'lucide-react'

import type {
  MinecraftData,
  ServerStatus,
} from '../types/dashboard'

type Props = {
  status: ServerStatus | null
  minecraft: MinecraftData | null
}

export function PlayersPanel({
  status,
  minecraft,
}: Props) {
  return (
    <article className="panel">
      <div className="panel-title">
        <div>
          <h2>
            Jogadores online
          </h2>

          <p>
            Quem está no Crackcraft agora
          </p>
        </div>

        <Users size={20} />
      </div>

      {minecraft?.online &&
      minecraft.players.length > 0 ? (
        <div className="players-list">
          {minecraft.players.map(
            (player) => (
              <div
                className="player-row"
                key={player.id}
              >
                <span className="player-dot" />

                <div>
                  <strong>
                    {player.name}
                  </strong>

                  <span>
                    Online agora
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="empty-state">
          <Users size={32} />

          <strong>
            {minecraft?.online
              ? 'Nenhum jogador online'
              : status?.ec2State ===
                  'running'
                ? 'Minecraft indisponível'
                : 'Servidor offline'}
          </strong>

          <span>
            {minecraft?.online
              ? 'O servidor está pronto para receber jogadores.'
              : status?.ec2State ===
                  'running'
                ? 'O Minecraft ou o agente ainda pode estar iniciando.'
                : 'Ligue o Crackcraft para começar a jogar.'}
          </span>
        </div>
      )}
    </article>
  )
}