// The type parameter indicates the type it identifies, to avoid mix-ups
export interface Id<T extends string> {
  type: T;
  id: number;
}

/**
 * Represents a domain object stored by the back-end, with a unique id. Each kind of domain object has a string token associated with it (e.g. `'Order'` for {@link Order}, `'MenuItem'` for {@link MenuItem} and so on). This is what the type parameter `T` represents. `T`'s value should only be explicitly specified in this file. Otherwise, just use the specific domain object subclass, like {@link Restaurant}.
 */
export interface DomainObject<T extends string = string> {
  id: Id<T>;
}

/**
 * Creates a negative-valued id for use in the `.id` field of DomainObjects which will be passed to creation APIs. Since the objects are not yet associated with the back-end, they have no meaningful id, but still need one to meet their schema. This also helps the back-end verify that no objects are created twice.
 * @param type The string token of the type of domain object to create an id for
 */
export function fakeId<I extends string>(type: I) {
  return {type, id: -3141592653};
}

/**
 * Represents the union of every key of a given domain object type where the value associated with the key is the id of a domain object (itself or another). This is always of the form `'id' | ...`.
 */
export type IdKey<T extends DomainObject> = {
  [K in keyof T]: T[K] extends Id<string> ? K : never;
}[keyof T];

/** Represents a physical location */
export interface WorldLocation {
  address: string;
}

/** Represents a sequence of physical locations connected by lines */
export interface Polyline {
  encoded: string;
}

/** Represents a phone number as an un-delimited sequence of digits */
export interface PhoneNumber {
  compact: string;
}

// domain object schemas
export interface Restaurant extends DomainObject<'Restaurant'> {
  location: WorldLocation;
  name: string;
}

export interface Driver extends DomainObject<'Driver'> {
  phoneNumber: PhoneNumber;
  restaurant: Restaurant['id'];
  name: string;
  onShift: boolean;
}

/** Represents the states an order can be in, in the order they are permitted to occur */
export const ORDER_STATES = [
  'cooking',
  'cooked',
  'driving',
  'delivered',
] as const;

export interface Order extends DomainObject<'Order'> {
  restaurant: Restaurant['id'];
  destination: WorldLocation;
  itemNames: string[];
  initialTime: Date;
  deliveryTime: Date; // estimated promised time (changes when state >= delivered)
  cookedTime: Date; // estimated prep time (changes when state >= cooked)
  state: (typeof ORDER_STATES)[number];
  highPriority: boolean;
  currentBatch: Batch['id'] | null;
}

type OrderStateBefore<
  T extends Order['state'],
  S = typeof ORDER_STATES,
> = S extends readonly [...infer Head, infer Tail]
  ? T extends Tail
    ? Head[number]
    : OrderStateBefore<T, Head>
  : never;

/**
 * Defines a total order on the order states.
 * @param a The first state
 * @param b The second state
 * @returns true if `a` is the same as `b`, or if `a` occurs before `b` in an Order's lifecycle
 */
export function isStateBefore(
  a: Order['state'],
  b: Order['state'],
): a is OrderStateBefore<typeof b> {
  return ORDER_STATES.indexOf(a) < ORDER_STATES.indexOf(b);
}

/**
 * Returns the next order state after a given state.
 * @param current An order state with a subsequent state
 * @returns The subsequent state, i.e., the state which an Order would advance into.
 */
export function nextStateAfter(
  current: OrderStateBefore<'delivered'>,
): Order['state'] {
  return ORDER_STATES[ORDER_STATES.indexOf(current) + 1];
}

export interface Batch extends DomainObject<'Batch'> {
  driver: Driver['id'];
  route: Polyline;
  dispatchTime: Date;
  expectedCompletionTime: Date;
}

export interface MenuItem extends DomainObject<'MenuItem'> {
  restaurant: Restaurant['id'];
  name: string;
}
