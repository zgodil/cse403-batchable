import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import DriverCard from '~/components/dashboard/DriverCard';
import {driverApi} from '~/api/endpoints/driver';
import {orderApi} from '~/api/endpoints/order';
import {restaurantApi} from '~/api/endpoints/restaurant';
import type {Driver} from '~/domain/objects';
import {
  checkedCreate,
  checkedCreateBatch,
  getFakeDriver,
  getFakeOrder,
  getFakeRestaurant,
} from 'test/mocks/domain_objects';

async function createDriver(driverConfig: Partial<Driver> = {}) {
  const restaurant = await checkedCreate(restaurantApi, getFakeRestaurant());
  const driver = await checkedCreate(driverApi, {
    ...getFakeDriver(restaurant),
    ...driverConfig,
  });
  const driverData = await driverApi.read(driver);
  if (driverData === null) {
    expect.fail('driver data must not be null');
  }
  return {driver: driverData, restaurant};
}

describe('<DriverCard>', () => {
  it("shows the driver's name", async () => {
    const name = 'Xyzw';
    const {driver} = await createDriver({name});
    render(<DriverCard driver={driver} />);

    expect(screen.getByText(name, {exact: false})).toBeInTheDocument();
  });

  it("shows the driver's phone number", async () => {
    const {driver} = await createDriver({
      phoneNumber: {
        compact: '1928731872',
      },
    });
    render(<DriverCard driver={driver} />);

    expect(screen.getByText('(192) 873-1872')).toBeInTheDocument();
  });

  it('shows assigned batch orders as circular route steps', async () => {
    const {driver, restaurant} = await createDriver();
    const batch = await checkedCreateBatch(driver.id);
    await checkedCreate(orderApi, {
      ...getFakeOrder(restaurant),
      state: 'driving',
      currentBatch: batch,
    });
    await checkedCreate(orderApi, {
      ...getFakeOrder(restaurant),
      state: 'delivered',
      currentBatch: batch,
    });

    render(<DriverCard driver={driver} />);

    expect(await screen.findByText('1')).toHaveClass('bg-emerald-100');
    expect(await screen.findByText('2')).toHaveClass('bg-gray-200');
  });

  it('shows no assigned orders when driver has no active batch', async () => {
    const {driver} = await createDriver();
    render(<DriverCard driver={driver} />);

    expect(await screen.findByText('No assigned orders')).toBeInTheDocument();
  });
});
