import {createContext, useEffect, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {getToken} from '~/api/auth_token';
import {restaurantApi} from '~/api/endpoints/restaurant';
import type {Restaurant} from '~/domain/objects';

/**
 * Represents the ID of the restaurant associated with the current user. This should not be used as a standalone context tag, but rather used via `useContext(RestaurantContext)` in combination with `<RestaurantProvider>`.
 */
export const RestaurantContext = createContext<Restaurant['id'] | null>(null);

/**
 * Provides the current user's restaurant id (from GET /restaurant/me).
 */
export default function RestaurantProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {isAuthenticated} = useAuth0();
  const [restaurantId, setRestaurantId] = useState<Restaurant['id'] | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setRestaurantId(null);
      return;
    }
    let cancelled = false;
    const load = async (tokenRetries = 25) => {
      const token = await getToken();
      if (cancelled) return;
      if (!token) {
        if (tokenRetries > 0) {
          setTimeout(() => void load(tokenRetries - 1), 400);
        } else {
          // Auth may still be initializing after redirect; try once more after a delay
          setTimeout(() => {
            if (!cancelled) void load(15);
          }, 2000);
        }
        return;
      }
      void restaurantApi
        .getMyRestaurantId()
        .then(id => {
          if (!cancelled) setRestaurantId(id ?? null);
        })
        .catch(err => {
          if (cancelled) return;
          const is401 = /401|unauthorized/i.test(String(err?.message || err));
          if (is401) setTimeout(() => void load(10), 800);
        });
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return <RestaurantContext value={restaurantId}>{children}</RestaurantContext>;
}
