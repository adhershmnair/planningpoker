import { Status } from './status';

export interface Game {
  id: string;
  name: string;
  average: number;
  gameStatus: Status;
  gameType?: GameType | GameType.Normal;
  tickets?: string | Object;
  createdBy: string;
  createdById: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface NewGame {
  name: string;
  gameType: string;
  createdBy: string;
  tickets: string | Object;
  createdAt: Date;
  role: string;
}

export enum GameType {
  Normal = 'Normal',
  Fibonacci = 'Fibonacci',
  ShortFibonacci = 'ShortFibonacci',
  TShirt = 'TShirt',
}
