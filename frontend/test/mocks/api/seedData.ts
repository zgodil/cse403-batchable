import type {
  Batch,
  Driver,
  MenuItem,
  Order,
  Restaurant,
} from '~/domain/objects';

const restaurantId = {type: 'Restaurant' as const, id: 1};
const now = Date.now();

const minutesFromNow = (minutes: number) => new Date(now + minutes * 60 * 1000);

export const initialDrivers: Driver[] = [
  {
    id: {type: 'Driver', id: 1},
    name: 'Ben',
    phoneNumber: {compact: '2061234567'},
    restaurant: restaurantId,
    onShift: true,
  },
  {
    id: {type: 'Driver', id: 2},
    name: 'Delano',
    phoneNumber: {compact: '2067891234'},
    restaurant: restaurantId,
    onShift: true,
  },
  {
    id: {type: 'Driver', id: 3},
    name: 'H',
    phoneNumber: {compact: '2061231234'},
    restaurant: restaurantId,
    onShift: false,
  },
];

export const initialRestaurant: Restaurant = {
  id: restaurantId,
  name: 'Batchable Kitchen',
  location: {
    address: '3820 Rainier Ave S, Seattle, WA 98118',
  },
};

export const initialMenuItems: MenuItem[] = [
  {
    id: {type: 'MenuItem', id: 1},
    restaurant: restaurantId,
    name: 'Burger',
  },
  {
    id: {type: 'MenuItem', id: 2},
    restaurant: restaurantId,
    name: 'Pizza',
  },
  {
    id: {type: 'MenuItem', id: 3},
    restaurant: restaurantId,
    name: 'Sandwich',
  },
];

export const initialBatches: Batch[] = [
  {
    id: {type: 'Batch', id: 1},
    driver: initialDrivers[0].id,
    route: {encoded: 'iziaHtvkiVwKbS}O`G'},
    dispatchTime: minutesFromNow(-5),
    expectedCompletionTime: minutesFromNow(25),
  },
];

export const initialOrders: Order[] = [
  {
    id: {type: 'Order', id: 1},
    restaurant: restaurantId,
    destination: {address: '3513 Rainier Ave S, Seattle, WA 98144'},
    itemNames: ['Burger'],
    initialTime: minutesFromNow(-30),
    cookedTime: minutesFromNow(-20),
    deliveryTime: minutesFromNow(-5),
    state: 'delivered',
    highPriority: false,
    currentBatch: initialBatches[0].id,
  },
  {
    id: {type: 'Order', id: 2},
    restaurant: restaurantId,
    destination: {address: '3300 Rainier Ave S, Seattle, WA 98144'},
    itemNames: ['Pizza'],
    initialTime: minutesFromNow(-20),
    cookedTime: minutesFromNow(-10),
    deliveryTime: minutesFromNow(5),
    state: 'driving',
    highPriority: true,
    currentBatch: initialBatches[0].id,
  },
  {
    id: {type: 'Order', id: 3},
    restaurant: restaurantId,
    destination: {address: '3201 Hunter Blvd S, Seattle, WA 98144'},
    itemNames: ['Sandwich'],
    initialTime: minutesFromNow(-4),
    cookedTime: minutesFromNow(11),
    deliveryTime: minutesFromNow(35),
    state: 'cooking',
    highPriority: false,
    currentBatch: null,
  },
];
