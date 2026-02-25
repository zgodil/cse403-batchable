import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it} from 'vitest';
import DriverCard from '~/components/dashboard/DriverCard';
import * as json from '~/domain/json';
import type {Batch, Driver, Order, Restaurant} from '~/domain/objects';
import {db} from '../../mocks/api/common';

const restaurantId: Restaurant['id'] = {type: 'Restaurant', id: 1};
const driverId: Driver['id'] = {type: 'Driver', id: 1};
const batchId: Batch['id'] = {type: 'Batch', id: 1};

const testRestaurant: Restaurant = {
  id: restaurantId,
  name: 'Batchable Restaurant',
  location: {address: '123 Test Ave, Seattle, WA'},
};

const testDriver: Driver = {
  id: driverId,
  restaurant: restaurantId,
  name: 'Ben',
  phoneNumber: {compact: '2061112222'},
  onShift: true,
};

const testBatch: Batch = {
  id: batchId,
  driver: driverId,
  route: {encoded: 'iziaHtvkiVwKbS}O`G'},
  dispatchTime: new Date('2026-01-01T00:00:00.000Z'),
  expectedCompletionTime: new Date('2026-01-01T01:00:00.000Z'),
};

function makeOrder(id: number, state: Order['state'] = 'driving'): Order {
  return {
    id: {type: 'Order', id},
    restaurant: restaurantId,
    destination: {address: `${id} Test St, Seattle, WA`},
    itemNames: ['Mochi'],
    initialTime: new Date('2026-01-01T00:00:00.000Z'),
    cookedTime: new Date('2026-01-01T00:10:00.000Z'),
    deliveryTime: new Date('2026-01-01T00:30:00.000Z'),
    state,
    highPriority: false,
    currentBatch: batchId,
  };
}

describe('DriverCard', () => {
  beforeEach(() => {
    db.restaurants.insert(json.restaurant.unparse(testRestaurant));
    db.drivers.insert(json.driver.unparse(testDriver));
  });

  it('shows assigned batch orders as circular route steps', async () => {
    db.batches.insert(json.batch.unparse(testBatch));
    db.orders.insert(json.order.unparse(makeOrder(1, 'driving')));
    db.orders.insert(json.order.unparse(makeOrder(2, 'delivered')));

    render(<DriverCard driver={testDriver} />);

    expect(await screen.findByText('1')).toHaveClass('bg-emerald-100');
    expect(await screen.findByText('2')).toHaveClass('bg-gray-200');
  });

  it('shows no assigned orders when driver has no active batch', async () => {
    render(<DriverCard driver={testDriver} />);

    expect(await screen.findByText('No assigned orders')).toBeTruthy();
  });
});
