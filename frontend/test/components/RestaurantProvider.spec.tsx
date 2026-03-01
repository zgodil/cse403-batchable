import {describe, it, expect} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {useContext} from 'react';
import RestaurantProvider, {
  RestaurantContext,
} from '~/components/RestaurantProvider';
import {restaurantApi} from '~/api/endpoints/restaurant';
import type {Restaurant} from '~/domain/objects';
import {checkedCreate, getFakeRestaurant} from 'test/mocks/domain_objects';
import {db} from 'test/mocks/api/common';

// fake component to extract context value
function RestaurantId() {
  const ctx = useContext(RestaurantContext);
  return <p>{ctx?.restaurant?.id?.id ?? 'null'}</p>;
}

function renderProvider() {
  render(
    <RestaurantProvider>
      <RestaurantId />
    </RestaurantProvider>,
  );
}

const restaurantId: Restaurant['id'] = {
  type: 'Restaurant',
  id: 1,
};

describe('<RestaurantProvider>', () => {
  it("creates restaurant 1 if there isn't one", async () => {
    const initiallyExists = await restaurantApi.exists(restaurantId);
    expect(initiallyExists).toBe(false);

    renderProvider();

    await waitFor(async () => {
      const exists = await restaurantApi.exists(restaurantId);
      expect(exists).toBe(true);
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it("doesn't create a restaurant 1 if there is one", async () => {
    const id = await checkedCreate(restaurantApi, getFakeRestaurant());
    expect(id).toEqual(restaurantId);

    renderProvider();

    await waitFor(async () => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(db.restaurants.findAll().length).toBe(1);
    });
  });
});
