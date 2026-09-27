import { Users } from 'lucide-react'

import { FeedbackState } from './ui/FeedbackState'
import { PanelHeader } from './ui/PanelHeader'

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
      <PanelHeader
        title="Jogadores online"
        subtitle="Quem está no Crackcraft agora"
        action={<Users size={20} />}
      />

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
        <FeedbackState
          icon={<Users size={32} />}
          title={
            minecraft?.online
              ? 'Nenhum jogador online'
              : status?.ec2State === 'running'
                ? 'Minecraft indisponível'
                : 'Servidor offline'
          }
          description={
            minecraft?.online
              ? 'O servidor está pronto para receber jogadores.'
              : status?.ec2State === 'running'
                ? 'O Minecraft ou o agente ainda pode estar iniciando.'
                : 'Ligue o Crackcraft para começar a jogar.'
          }
        />
      )}
    </article>
  )
}
