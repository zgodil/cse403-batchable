import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {restaurantApi} from '~/api/endpoints/restaurant';
import type {Driver, MenuItem, Restaurant} from '~/domain/objects';

const configuredRestaurantId = Number(import.meta.env.VITE_RESTAURANT_ID);
const DEFAULT_RESTAURANT_ID = Number.isFinite(configuredRestaurantId)
  ? configuredRestaurantId
  : 1;

export function useRestaurantAdminState() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isEditingDrivers, setIsEditingDrivers] = useState(false);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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
        setDrivers([]);
        setRestaurant(null);
        setMenuItems([]);
        setLoadError('Could not load restaurant data from the backend.');
        return;
      }

      setDrivers(driversData);
      setRestaurant(restaurantData);
      setMenuItems(menuItemsData);
    } catch (error) {
      console.error('Failed to load restaurant admin data', error);
      setDrivers([]);
      setRestaurant(null);
      setMenuItems([]);
      setLoadError('Could not load restaurant data from the backend.');
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
