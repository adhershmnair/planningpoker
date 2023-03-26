import { Grow, Chip } from '@material-ui/core';
import React from 'react';
import { Game } from '../../types/game';
import { Ticket } from '../../types/ticket';
import './Tickets.css';

interface TicketsProps {
  game: Game;
  tickets: Ticket[];
  currentPlayerId: string;
}

export const Tickets: React.FC<TicketsProps> = ({ game, tickets, currentPlayerId }) => {

  const handleClick = ( item: string | undefined) => {
    if (typeof item !== 'undefined') {
      const url = `https://vu-pmo.atlassian.net/browse/${item}`; // create URL by combining fixed string and item variable
      window.open(url, "_blank"); // open URL in a new browser tab
    }
  };
  

  return (
    <Grow in={true} timeout={800}>
      <div className='TicketsContainer'>
        {tickets.map((ticket: Ticket, index) => (
          <Chip
            key={index}
            size="medium"
            label={ticket.value}
            onClick={()=>handleClick(ticket.value)}
          />
        ))}
      </div>
    </Grow>
  );
};
