import { PlayerGame } from '../types/player';
import { TicketGame } from '../types/ticket';

const playerGamesStoreName = 'playerGames';
const ticketGamesStoreName = 'ticketGames';

export const getPlayerGamesFromCache = (): PlayerGame[] => {
  let playerGames: PlayerGame[] = [];

  const store = localStorage.getItem(playerGamesStoreName);
  if (store) {
    playerGames = JSON.parse(store);
  }
  return playerGames;
};

export const getTicketGamesFromCache = (): TicketGame[] => {
  let ticektGames: TicketGame[] = [];

  const store = localStorage.getItem(ticketGamesStoreName);
  if (store) {
    ticektGames = JSON.parse(store);
  }
  return ticektGames;
};

export const isGameInPlayerCache = (gameId: string): boolean => {
  const playerGames = getPlayerGamesFromCache();
  const found = playerGames.find((playerGames) => playerGames.gameId === gameId);
  if (found) {
    return true;
  }
  return found ? true : false;
};

export const isGameInTicketCache = (gameId: string): boolean => {
  const ticketGames = getTicketGamesFromCache();
  const found = ticketGames.find((ticketGames) => ticketGames.gameId === gameId);
  if (found) {
    return true;
  }
  return found ? true : false;
};

export const updatePlayerGamesInCache = (playerGames: PlayerGame[]) => {
  localStorage.setItem(playerGamesStoreName, JSON.stringify(playerGames));
};

export const updateTicketGamesInCache = (ticketGames: TicketGame[]) => {
  localStorage.setItem(ticketGamesStoreName, JSON.stringify(ticketGames));
};
