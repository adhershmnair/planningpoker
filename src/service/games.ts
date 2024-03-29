import { ulid } from 'ulid';
import {
  addGameToStore,
  addPlayerToGameInStore,
  addTicketToGameInStore,
  getGameFromStore,
  getPlayersFromStore,
  streamData,
  streamPlayersFromStore,
  streamTicketsFromStore,
  updateGameDataInStore,
  removeGameFromStore
} from '../repository/firebase';
import { NewGame } from '../types/game';
import { Player } from '../types/player';
import { Ticket } from '../types/ticket';
import { Status } from '../types/status';
import { resetPlayers, updatePlayerGames } from './players';

export const addNewGame = async (newGame: NewGame): Promise<string> => {
  const player = {
    name: newGame.createdBy,
    id: ulid(),
    status: Status.NotStarted,
    role: newGame.role
  };

  const gameData = {
    ...newGame,
    id: ulid(),
    average: 0,
    devAverage: 0,
    createdById: player.id,
    gameStatus: Status.Started,
  };
  await addGameToStore(gameData.id, gameData);
  await addPlayerToGameInStore(gameData.id, player);
  updatePlayerGames(gameData.id, player.id);

  return gameData.id;
};

export const addNewTicket = async (gameId: string, ticket: string): Promise<string> => {
    const ticketValue: Ticket= {
      id: ulid(),
      value: ticket,
      status: Status.NotStarted
    }
    await addTicketToGameInStore(gameId, ticketValue);
    return gameId;
};

export const streamGame = (id: string) => {
  return streamData(id);
};

export const streamPlayers = (id: string) => {
  return streamPlayersFromStore(id);
};

export const streamTickets = (id: string) => {
  return streamTicketsFromStore(id);
};

export const getGame = (id: string) => {
  return getGameFromStore(id);
};

export const updateGame = async (gameId: string, updatedGame: any): Promise<boolean> => {
  await updateGameDataInStore(gameId, updatedGame);
  return true;
};

export const resetGame = async (gameId: string) => {
  const game = await getGameFromStore(gameId);
  if (game) {
    const updatedGame = {
      average: 0,
      devAverage: 0,
      gameStatus: Status.Started,
    };
    updateGame(gameId, updatedGame);
    await resetPlayers(gameId);
  }
};

export const finishGame = async (gameId: string) => {
  const game = await getGameFromStore(gameId);
  const players = await getPlayersFromStore(gameId);

  if (game && players) {
    const updatedGame = {
      average: getAverage(players),
      devAverage: getDevAverage(players),
      gameStatus: Status.Finished,
    };
    updateGame(gameId, updatedGame);
  }
};

export const getAverage = (players: Player[]): number => {
  let values = 0;
  let numberOfPlayersPlayed = 0;
  players.forEach((player) => {
    if (player.status === Status.Finished && player.value && player.value >= 0) {
      values = values + player.value;
      numberOfPlayersPlayed++;
    }
  });
  return Math.round(values / numberOfPlayersPlayed);
};

export const getDevAverage = (players: Player[]): number => {
  let values = 0;
  let numberOfPlayersPlayed = 0;
  players.forEach((player) => {
    if (player.status === Status.Finished && player.value && player.value >= 0 && player.role === 'Developer') {
      values = values + player.value;
      numberOfPlayersPlayed++;
    }
  });
  return Math.round(values / numberOfPlayersPlayed);
};

export const getGameStatus = (players: Player[]): Status => {
  let numberOfPlayersPlayed = 0;
  players.forEach((player: Player) => {
    if (player.status === Status.Finished) {
      numberOfPlayersPlayed++;
    }
  });
  if (numberOfPlayersPlayed === 0) {
    return Status.Started;
  }
  return Status.InProgress;
};

export const updateGameStatus = async (gameId: string): Promise<boolean> => {
  const game = await getGame(gameId);
  if (!game) {
    console.log('Game not found');
    return false;
  }
  const players = await getPlayersFromStore(gameId);
  if (players) {
    const status = getGameStatus(players);
    const dataToUpdate = {
      gameStatus: status,
    };
    const result = await updateGameDataInStore(gameId, dataToUpdate);
    return result;
  }
  return false;
};

export const removeGame = async (gameId: string) => {
  await removeGameFromStore(gameId);
};