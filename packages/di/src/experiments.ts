import '@abraham/reflection';

import { ObjectType, set } from './di';

interface MetadataParams {
  index: number;
  handler: ObjectType<unknown>;
}
const metadataSymbol = Symbol('descriptor:metadata:symbol');

export function Reader<T>(...arg: ObjectType<T>[]): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const method = descriptor.value;
    descriptor.value = function(args: unknown[]) {
      args = args || [];
      const requiredParameters =
        (Reflect.getOwnMetadata(
          metadataSymbol,
          target,
          propertyKey
        ) as MetadataParams[]) || [];
      requiredParameters.push(
        ...arg.map((handler, index) => ({ handler, index }))
      );
      requiredParameters.forEach(
        param => (args[param.index] = set(param.handler))
      );
      return method.apply(this, args);
    };
  };
}

export function Injector<T>(handler: ObjectType<T>): ParameterDecorator {
  return (target: object, propertyKey: string | symbol, index: number) => {
    const params =
      (Reflect.getOwnMetadata(metadataSymbol, target, propertyKey) as Array<
        MetadataParams
      >) || [];
    params.push({ index, handler });
    Reflect.defineMetadata(metadataSymbol, params, target, propertyKey);
  };
}

// function Compact<T extends new (...args: any[]) => {}>(constructor: T) {
//   console.log('-- decorator function invoked --');
//   return class extends constructor {
//     gears = 5;
//     wheels = 3;
//   };
// }
