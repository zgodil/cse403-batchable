import 'test/mocks/link';
import {mockFailure, mockSuccess} from 'test/mocks/query';
import {describe, it, expect} from 'vitest';
import {screen, render} from '@testing-library/react';
import {checkedCreate, getFakeRestaurant} from 'test/mocks/domain_objects';
import {restaurantApi} from '~/api/endpoints/restaurant';
import {RestaurantContext} from '~/components/RestaurantProvider';
import UnconfiguredRestaurantModal from '~/components/dashboard/UnconfiguredRestaurantModal';

describe('<UnconfiguredRestaurantModal>', () => {
  it('appears when there is an unconfigured address', async () => {
    mockSuccess();
    const restaurant = await checkedCreate(restaurantApi, {
      ...getFakeRestaurant(),
      location: {address: 'Address not set'},
    });

    render(
      <RestaurantContext value={restaurant}>
        <UnconfiguredRestaurantModal />
      </RestaurantContext>,
    );

    expect(
      await screen.findByText(/welcome to batchable/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', {name: /configure my restaurant/i}),
    ).toBeInTheDocument();
  });

  it('does not appear when there is a configured address', async () => {
    mockSuccess();
    const restaurant = await checkedCreate(restaurantApi, {
      ...getFakeRestaurant(),
    });

    render(
      <RestaurantContext value={restaurant}>
        <UnconfiguredRestaurantModal />
      </RestaurantContext>,
    );

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(
      screen.queryByRole('button', {name: /configure my restaurant/i}),
    ).not.toBeInTheDocument();
  });

  it('does not appear when there is no restaurant', async () => {
    mockFailure();
    render(<UnconfiguredRestaurantModal />);

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(
      screen.queryByRole('button', {name: /configure my restaurant/i}),
    ).not.toBeInTheDocument();
  });
});
