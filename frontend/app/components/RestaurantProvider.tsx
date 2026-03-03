import {createContext, useEffect, useState} from 'react';
import {restaurantApi} from '~/api/endpoints/restaurant';
import {fakeId, type Restaurant} from '~/domain/objects';

export const RestaurantContext = createContext<
  Restaurant['id'] | null | undefined
>(null);

const DEFAULT_RESTAURANT_ID: Restaurant['id'] = {
  type: 'Restaurant',
  id: 1,
};

/**
 * Provides the ID of the restaurant associated with the current user.
 */
export default function RestaurantProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [restaurant, setRestaurant] = useState<
    Restaurant['id'] | null | undefined
  >(undefined);

  // TODO: replace this with something that actually depends on auth
  useEffect(() => {
    let cancelled = false;

    async function guaranteeRestaurant() {
      try {
        const exists = await restaurantApi.exists(DEFAULT_RESTAURANT_ID);
        if (exists) {
          return DEFAULT_RESTAURANT_ID;
        }

        return restaurantApi.create({
          id: fakeId('Restaurant'),
          location: {address: '1234 Batch St NE, Seattle WA 98105'},
          name: 'Batchable Kitchen',
        });
      } catch (error) {
        console.error('Failed to determine restaurant for current user', error);
        return null;
      }
    }

    void guaranteeRestaurant().then(id => {
      if (!cancelled) {
        setRestaurant(id);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <RestaurantContext value={restaurant}>{children}</RestaurantContext>;
}
