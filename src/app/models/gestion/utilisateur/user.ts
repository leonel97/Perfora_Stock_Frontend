import {ExerciceFonction} from "./exercice-fonction";

export class User {
  id: number;
  login: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  genre: string;
  civiliteId: number;
  imageUrl: string;
  langKey: string;
  activated: boolean;
  corpsId: number;
  fonctionId: number;
  servicesId: number[];
  groupesId: number[];
  authorities: string[];
  exercicefonctions: ExerciceFonction[];
  defaultExerciceFonction:ExerciceFonction;
  currentExerciceFonction:ExerciceFonction;
  token?: string;
}


