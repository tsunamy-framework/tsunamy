import 'reflect-metadata';
import { Type } from '../types/Type';

export type ClassDecoratorGeneric<T> = (target: T) => void;

export const Injectable = (): ClassDecoratorGeneric<Type<any>> => {
  return (target: Type<any>) => {
  };
};
