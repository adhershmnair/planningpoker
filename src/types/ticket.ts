import { Status } from './status';

export interface Ticket {
  id: string;
  value?: string;
  status: Status;
}

export interface TicketGame {
  gameId: string;
  ticketId: string;
}
