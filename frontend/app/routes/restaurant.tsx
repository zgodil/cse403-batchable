import DriversSection from '../components/restaurant/DriversSection';
import MenuItemsSection from '../components/restaurant/MenuItemsSection';
import RestaurantDetailsSection from '../components/restaurant/RestaurantDetailsSection';
import RestaurantContext from '~/components/RestaurantContext';
import RestaurantPageHeader from '../components/restaurant/RestaurantPageHeader';
import RestaurantPageLoadStatus from '../components/restaurant/RestaurantPageLoadStatus';
import {useRestaurantAdminState} from '../components/restaurant/useRestaurantAdminState';

function RestaurantPage() {
  const {
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
  } = useRestaurantAdminState();

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <RestaurantContext value={restaurant?.id ?? null}>
        <RestaurantPageHeader />
        <RestaurantPageLoadStatus
          isLoadingData={isLoadingData}
          loadError={loadError}
        />

        {restaurant && (
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
        )}
      </RestaurantContext>
    </div>
  );
}

export default RestaurantPage;
