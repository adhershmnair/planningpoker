import React from 'react';
import { Grow } from '@material-ui/core';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { Ticket } from '../../../types/ticket';
import { CardPicker } from '../../Players/CardPicker/CardPicker';
import { Players } from '../../Players/Players';
import { Tickets } from '../../Players/Tickets';
import { GameController } from '../GameController/GameController';
import './GameArea.css';

interface GameAreaProps {
  game: Game;
  tickets: Ticket[];
  players: Player[];
  currentPlayerId: string;
}
export const GameArea: React.FC<GameAreaProps> = ({ game, players, tickets, currentPlayerId }) => {
  return (
    <>
      <div className='ContentArea'>
        <Players game={game} players={players} currentPlayerId={currentPlayerId} />
        <Grow in={true} timeout={800}>
          <div className="ControllerTicket">
            <GameController game={game} currentPlayerId={currentPlayerId} />
            <Tickets game={game} tickets={tickets} currentPlayerId={currentPlayerId} />
          </div>
        </Grow>
      </div>
      <div className='Footer'>
        <CardPicker game={game} players={players} currentPlayerId={currentPlayerId} />
      </div>
    </>
  );
};

export default GameArea;
