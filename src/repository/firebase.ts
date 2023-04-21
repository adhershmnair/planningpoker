import 'firebase/analytics';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Game } from '../types/game';
import { Player } from '../types/player';
import { Ticket } from '../types/ticket';
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const gamesCollectionName = 'games';
const playersCollectionName = 'players';
const ticketsCollectionName = 'tickets';
const db = firebase.firestore();

export const addGameToStore = async (gameId: string, data: any) => {
  await db.collection(gamesCollectionName).doc(gameId).set(data);
  return true;
};

export const getGameFromStore = async (id: string): Promise<Game | undefined> => {
  const response = db.collection(gamesCollectionName).doc(id);
  const result = await response.get();
  let game = undefined;
  if (result.exists) {
    game = result.data();
  }
  return game as Game;
};

export const getPlayersFromStore = async (gameId: string): Promise<Player[]> => {
  const db = firebase.firestore();
  const response = db.collection(gamesCollectionName).doc(gameId).collection(playersCollectionName);
  const results = await response.get();
  let players: Player[] = [];
  results.forEach((result) => players.push(result.data() as Player));
  return players;
};

export const getTicketsFromStore = async (gameId: string): Promise<Ticket[]> => {
  const db = firebase.firestore();
  const response = db.collection(gamesCollectionName).doc(gameId).collection(ticketsCollectionName);
  const results = await response.get();
  let tickets: Ticket[] = [];
  results.forEach((result) => tickets.push(result.data() as Ticket));
  return tickets;
};

export const getPlayerFromStore = async (gameId: string, playerId: string): Promise<Player | undefined> => {
  const db = firebase.firestore();
  const response = db.collection(gamesCollectionName).doc(gameId).collection(playersCollectionName).doc(playerId);
  const result = await response.get();
  let player = undefined;
  if (result.exists) {
    player = result.data();
  }
  return player as Player;
};


export const getTicketFromStore = async (gameId: string, ticketId: string): Promise<Ticket | undefined> => {
  const db = firebase.firestore();
  const response = db.collection(gamesCollectionName).doc(gameId).collection(ticketsCollectionName).doc(ticketId);
  const result = await response.get();
  let ticket = undefined;
  if (result.exists) {
    ticket = result.data();
  }
  return ticket as Ticket;
};

export const streamData = (id: string) => {
  return db.collection(gamesCollectionName).doc(id);
};
export const streamPlayersFromStore = (id: string) => {
  return db.collection(gamesCollectionName).doc(id).collection(playersCollectionName);
};
export const streamTicketsFromStore = (id: string) => {
  return db.collection(gamesCollectionName).doc(id).collection(ticketsCollectionName);
};

export const updateGameDataInStore = async (gameId: string, data: any): Promise<boolean> => {
  const db = firebase.firestore();
  await db.collection(gamesCollectionName).doc(gameId).update(data);
  return true;
};

export const addPlayerToGameInStore = async (gameId: string, player: Player) => {
  await db.collection(gamesCollectionName).doc(gameId).collection(playersCollectionName).doc(player.id).set(player);
  return true;
};

export const addTicketToGameInStore = async (gameId: string, ticket: Ticket) => {
  await db.collection(gamesCollectionName).doc(gameId).collection(ticketsCollectionName).doc(ticket.id).set(ticket);
  return true;
};

export const removePlayerFromGameInStore = async (gameId: string, playerId: string) => {
  await db.collection(gamesCollectionName).doc(gameId).collection(playersCollectionName).doc(playerId).delete();
  return true;
};

export const removeTicketFromGameInStore = async (gameId: string, ticketId: string) => {
  await db.collection(gamesCollectionName).doc(gameId).collection(ticketsCollectionName).doc(ticketId).delete();
  return true;
};

export const updatePlayerInStore = async (gameId: string, player: Player) => {
  await db.collection(gamesCollectionName).doc(gameId).collection(playersCollectionName).doc(player.id).update(player);
  return true;
};

export const updateTicketInStore = async (gameId: string, ticket: Ticket) => {
  await db.collection(gamesCollectionName).doc(gameId).collection(ticketsCollectionName).doc(ticket.id).update(ticket);
  return true;
};

export const removeGameFromStore = async (gameId: string) => {
  await db.collection(gamesCollectionName).doc(gameId).delete();
  await db.collection(gamesCollectionName).doc(gameId).collection(playersCollectionName).get().then(res => {
    res.forEach(element => {
      element.ref.delete();
    });
  });
  return true;
};

export const getAllGameFromStore = async () => {
  const db = firebase.firestore();
  const response = db.collection(gamesCollectionName);
  const results = await response.get();
  let games: Game[] = [];
  results.forEach((result) => games.push(result.data() as Game));
  return games;
}
