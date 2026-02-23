import {createContext, useEffect, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {restaurantApi} from '~/api/endpoints/restaurant';
import type {Restaurant} from '~/domain/objects';

export const RestaurantContext = createContext<Restaurant['id'] | null>(null);

/**
 * Provides the ID of the restaurant associated with the current user (from Auth0 JWT).
 */
export default function RestaurantProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {isAuthenticated} = useAuth0();
  const [restaurant, setRestaurant] = useState<Restaurant['id'] | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setRestaurant(null);
      return;
    }
    let cancelled = false;
    const load = (retries = 2) => {
      restaurantApi
        .getMyRestaurant()
        .then(id => {
          if (!cancelled) setRestaurant(id);
        })
        .catch(err => {
          if (cancelled) return;
          // 401 = token not ready yet or wrong audience; retry once after a short delay
          const is401 =
            String(err?.message || err).includes('401') ||
            String(err?.message || err).toLowerCase().includes('unauthorized');
          if (retries > 0 && is401) {
            setTimeout(() => load(retries - 1), 800);
          }
        });
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <RestaurantContext.Provider value={restaurant}>
      {children}
    </RestaurantContext.Provider>
  );
}
