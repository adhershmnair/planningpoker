import { Grow, Chip, Typography } from '@material-ui/core';
import React from 'react';
import { Game } from '../../types/game';
import { Ticket } from '../../types/ticket';
import { isModerator } from '../../utils/isModerator';
import DoneCircleIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { updateTicketStatus } from '../../service/tickets';
import { Status } from '../../types/status';

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
  
  const handleActive = ( item: string | undefined) => {
    const ticket = tickets.find((obj) => obj.value === item);
    let status = Status.NotStarted;
    if (ticket) {
      if (ticket.status === Status.NotStarted) {
        status = Status.Started
      }
      if (ticket.status === Status.Started) {
        status = Status.InProgress
      }
      if (ticket.status === Status.InProgress) {
        status = Status.Finished
      }
      updateTicketStatus(game.id, ticket.id, status);
    }
  };


  return (
    <Grow in={true} timeout={800}>
      <>
      {isModerator(game.createdById, currentPlayerId) && (
        <Typography align='center'>Change the status of ticket by clicking the checkbox.</Typography>
      )}
      <div className={`TicketsContainer ${isModerator(game.createdById, currentPlayerId) ? 'isModerator' : 'isUser'}`}>
        {tickets.map((ticket: Ticket, index) => (
          <div
          className={`TicketIconText ${ticket.status.replace(/ /g, "")} `}
          key={index}
          >
          <Chip
            size="medium"
            variant="outlined"
            label={ticket.value}
            onClick={()=>handleClick(ticket.value)}
          />
            {isModerator(game.createdById, currentPlayerId) && (
            <div
              className="TicketIcon DoneCircleIcon"
              onClick={()=>handleActive(ticket.value)}
            >
              <DoneCircleIcon
                fontSize="small"
              />
            </div>
            )}
          </div>
        ))}
      </div>
      </>
    </Grow>
  );
};
