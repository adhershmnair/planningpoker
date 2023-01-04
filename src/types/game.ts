import { Status } from './status';

export interface Game {
  id: string;
  name: string;
  average: number;
  gameStatus: Status;
  gameType?: GameType | GameType.Normal;
  createdBy: string;
  createdById: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface NewGame {
  name: string;
  gameType: string;
  createdBy: string;
  createdAt: Date;
}

export enum GameType {
  Normal = 'Normal',
  Fibonacci = 'Fibonacci',
  ShortFibonacci = 'ShortFibonacci',
  TShirt = 'TShirt',
}
