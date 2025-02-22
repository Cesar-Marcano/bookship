/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class Service {
  private static instances: Map<new (...args: any[]) => Service, Service> =
    new Map();

  protected constructor() {}

  public static getInstance<T extends Service>(
    this: new (...args: any[]) => T,
    ...args: any[]
  ): T {
    if (!Service.instances.has(this)) {
      Service.instances.set(this, new this(...args));
    }
    return Service.instances.get(this) as T;
  }
}
