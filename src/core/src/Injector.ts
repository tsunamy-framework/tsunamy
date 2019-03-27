import 'reflect-metadata';
import { Type } from './types/Type';

export interface OnDestroy {
    release(): void;
}
export class Injector {
  private map = new Map();

  resolve<T>(target: Type<any>): T {
    let tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    let injections = tokens.map((token: any) => this.resolve<any>(token));
    const classInstance = this.map.get(target);
    if (classInstance) {
      return classInstance;
    }
    const newInstance = new target(...injections);
    this.map.set(target, newInstance);
    return newInstance;
  }

};
