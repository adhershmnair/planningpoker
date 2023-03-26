import { Status } from './status';

export interface Ticket {
  id: string;
  status: Status;
  value?: number;
}

export interface TicketGame {
  gameId: string;
  ticketId: string;
}
