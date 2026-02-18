import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import DriversSection from '../components/restaurant/DriversSection';
import MenuItemsSection from '../components/restaurant/MenuItemsSection';
import RestaurantDetailsSection from '../components/restaurant/RestaurantDetailsSection';
import {
  initialDrivers,
  initialMenuItems,
  initialRestaurant,
} from '../components/restaurant/mockData';
import Button from '~/components/Button';
import RestaurantContext from '~/components/RestaurantContext';
import {restaurantApi} from '~/api/endpoints/restaurant';

const configuredRestaurantId = Number(import.meta.env.VITE_RESTAURANT_ID);
const DEFAULT_RESTAURANT_ID = Number.isFinite(configuredRestaurantId)
  ? configuredRestaurantId
  : 1;

function RestaurantPage() {
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

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <RestaurantContext value={restaurant.id}>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Restaurant Admin
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Manage restaurant profile, drivers, and menu items in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button to="/" style="dark">
              Back to Dashboard
            </Button>
          </div>
        </div>

        {isLoadingData && (
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Loading restaurant data...
          </p>
        )}
        {loadError && (
          <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
            {loadError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6">
          <DriversSection
            drivers={drivers}
            setDrivers={setDrivers}
            isEditing={isEditingDrivers}
            setIsEditing={setIsEditingDriversExclusive}
            refreshRestaurantData={loadRestaurantData}
          />

          <RestaurantDetailsSection
            restaurant={restaurant}
            setRestaurant={setRestaurant}
            isEditing={isEditingRestaurant}
            setIsEditing={setIsEditingRestaurant}
            refreshRestaurantData={loadRestaurantData}
          />

          <MenuItemsSection
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            isEditing={isEditingMenu}
            setIsEditing={setIsEditingMenuExclusive}
            refreshRestaurantData={loadRestaurantData}
          />
        </div>
      </RestaurantContext>
    </div>
  );
}

export default RestaurantPage;
