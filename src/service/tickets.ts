import { ulid } from 'ulid';
import {
  addTicketToGameInStore,
  getGameFromStore,
  getTicketFromStore,
  getTicketsFromStore,
  removeTicketFromGameInStore,
  updateTicketInStore,
} from '../repository/firebase';
import { getTicketGamesFromCache, updateTicketGamesInCache } from '../repository/localStorage';
import { Game } from '../types/game';
import { Ticket, TicketGame } from '../types/ticket';
import { Status } from '../types/status';
import { updateGameStatus } from './games';

export const addTicket = async (gameId: string, ticket: Ticket) => {
  const game = await getGameFromStore(gameId);
  if (game) {
    addTicketToGameInStore(gameId, ticket);
  }
};

export const removeTicket = async (gameId: string, ticketId: string) => {
  const game = await getGameFromStore(gameId);
  if (game) {
    removeTicketFromGameInStore(gameId, ticketId);
  }
};
export const updateTicketValue = async (gameId: string, ticketId: string, value: string) => {
  const ticket = await getTicketFromStore(gameId, ticketId);

  if (ticket) {
    const updatedTicket = {
      ...ticket,
      value: value,
      status: Status.Finished,
    };
    await updateTicketInStore(gameId, updatedTicket);
    await updateGameStatus(gameId);
    return true;
  }
  return false;
};

export const updateTicketStatus = async (gameId: string, ticketId: string, status: Status) => {
  const ticket = await getTicketFromStore(gameId, ticketId);

  if (ticket) {
    const updatedTicket = {
      ...ticket,
      status: status,
    };
    await updateTicketInStore(gameId, updatedTicket);
    await updateGameStatus(gameId);
    return true;
  }
  return false;
};

export const getTicketRecentGames = async (): Promise<Game[]> => {
  let ticketGames: TicketGame[] = getTicketGamesFromCache();
  let games: Game[] = [];

  await Promise.all(
    ticketGames.map(async (ticketGame: TicketGame) => {
      const game = await getGameFromStore(ticketGame.gameId);

      if (game) {
        const ticket = await getTicketFromStore(game.id, ticketGame.ticketId);
        ticket && games.push(game);
      }
    })
  );

  games.sort((a: Game, b: Game) => +b.createdAt - +a.createdAt);
  return games;
};

export const getCurrentTicketId = (gameId: string): string | undefined => {
  let ticketGames: TicketGame[] = getTicketGamesFromCache();

  const game = ticketGames.find((ticketGame) => ticketGame.gameId === gameId);

  return game && game.ticketId;
};

export const updateTicketGames = (gameId: string, ticketId: string) => {
  let ticketGames: TicketGame[] = getTicketGamesFromCache();

  ticketGames.push({ gameId, ticketId });

  updateTicketGamesInCache(ticketGames);
};

export const isCurrentTicketInGame = async (gameId: string): Promise<boolean> => {
  const ticketGames = getTicketGamesFromCache();
  const found = ticketGames.find((ticketGames) => ticketGames.gameId === gameId);
  if (found) {
    const ticket = await getTicketFromStore(found.gameId, found.ticketId);

    //Remove game from cache is ticket is no longer in the game
    if (!ticket) {
      removeGameFromCache(found.gameId);
      return false;
    }
    return true;
  }
  return false;
};

export const isTicketInGameStore = async (gameId: string, ticketId: string) => {
  const ticket = await getTicketFromStore(gameId, ticketId);
  return ticket ? true : false;
};

export const removeGameFromCache = (gameId: string) => {
  const ticketGames = getTicketGamesFromCache();
  updateTicketGamesInCache(ticketGames.filter((ticketGame) => ticketGame.gameId !== gameId));
};

export const addTicketToGame = async (gameId: string, ticketName: string): Promise<boolean> => {
  const joiningGame = await getGameFromStore(gameId);

  if (!joiningGame) {
    console.log('Game not found');
    return false;
  }
  const newTicket = { name: ticketName, id: ulid(), status: Status.NotStarted };

  updateTicketGames(gameId, newTicket.id);
  await addTicketToGameInStore(gameId, newTicket);

  return true;
};

export const resetTickets = async (gameId: string) => {
  const tickets = await getTicketsFromStore(gameId);

  tickets.forEach(async (ticket) => {
    const updatedTicket: Ticket = {
      ...ticket,
      status: Status.NotStarted,
      value: '',
    };
    await updateTicketInStore(gameId, updatedTicket);
  });
};
