import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {initialDrivers, initialMenuItems, initialRestaurant} from './mockData';
import {restaurantApi} from '~/api/endpoints/restaurant';

const configuredRestaurantId = Number(import.meta.env.VITE_RESTAURANT_ID);
const DEFAULT_RESTAURANT_ID = Number.isFinite(configuredRestaurantId)
  ? configuredRestaurantId
  : 1;

export function useRestaurantAdminState() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [isEditingDrivers, setIsEditingDrivers] = useState(false);

  const [restaurant, setRestaurant] = useState(initialRestaurant);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);

  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadRestaurantData = useCallback(async () => {
    setIsLoadingData(true);
    setLoadError(null);
    try {
      const restaurantId = {
        type: 'Restaurant' as const,
        id: DEFAULT_RESTAURANT_ID,
      };
      const [restaurantData, driversData, menuItemsData] = await Promise.all([
        restaurantApi.read(restaurantId),
        restaurantApi.getDrivers(restaurantId),
        restaurantApi.getMenuItems(restaurantId),
      ]);

      if (!restaurantData || !driversData || !menuItemsData) {
        setLoadError(
          'Could not load restaurant data from the backend. Showing local fallback data.',
        );
        return;
      }

      setDrivers(driversData);
      setRestaurant(restaurantData);
      setMenuItems(menuItemsData);
    } catch (error) {
      console.error('Failed to load restaurant admin data', error);
      setLoadError(
        'Could not load restaurant data from the backend. Showing local fallback data.',
      );
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    void loadRestaurantData();
  }, [loadRestaurantData]);

  const setIsEditingDriversExclusive: Dispatch<
    SetStateAction<boolean>
  > = value => {
    setIsEditingDrivers(current => {
      const nextValue = typeof value === 'function' ? value(current) : value;
      if (nextValue) {
        setIsEditingMenu(false);
      }
      return nextValue;
    });
  };

  const setIsEditingMenuExclusive: Dispatch<
    SetStateAction<boolean>
  > = value => {
    setIsEditingMenu(current => {
      const nextValue = typeof value === 'function' ? value(current) : value;
      if (nextValue) {
        setIsEditingDrivers(false);
      }
      return nextValue;
    });
  };

  return {
    drivers,
    setDrivers,
    isEditingDrivers,
    setIsEditingDriversExclusive,
    restaurant,
    setRestaurant,
    isEditingRestaurant,
    setIsEditingRestaurant,
    menuItems,
    setMenuItems,
    isEditingMenu,
    setIsEditingMenuExclusive,
    isLoadingData,
    loadError,
    loadRestaurantData,
  };
}
