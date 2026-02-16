import {useState} from 'react';
import {Link} from 'react-router';
import DriversSection from '../components/restaurant/DriversSection';
import MenuItemsSection from '../components/restaurant/MenuItemsSection';
import RestaurantDetailsSection from '../components/restaurant/RestaurantDetailsSection';
import {
  initialDrivers,
  initialMenuItems,
  initialRestaurant,
} from '../components/restaurant/mockData';

function RestaurantPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [isEditingDrivers, setIsEditingDrivers] = useState(false);

  const [restaurant, setRestaurant] = useState(initialRestaurant);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);

  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [isEditingMenu, setIsEditingMenu] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Restaurant Admin
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Manage restaurant profile, drivers, and menu items in one place.
            </p>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <DriversSection
            drivers={drivers}
            setDrivers={setDrivers}
            isEditing={isEditingDrivers}
            setIsEditing={setIsEditingDrivers}
            restaurantId={restaurant.id}
          />

          <RestaurantDetailsSection
            restaurant={restaurant}
            setRestaurant={setRestaurant}
            isEditing={isEditingRestaurant}
            setIsEditing={setIsEditingRestaurant}
          />

          <MenuItemsSection
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            isEditing={isEditingMenu}
            setIsEditing={setIsEditingMenu}
            restaurantId={restaurant.id}
          />
        </div>
      </div>
    </div>
  );
}

export default RestaurantPage;
