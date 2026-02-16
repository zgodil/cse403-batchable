import type {Dispatch, SetStateAction} from 'react';
import type {Restaurant} from '../../domain/objects';

type RestaurantDetailsSectionProps = {
  restaurant: Restaurant;
  setRestaurant: Dispatch<SetStateAction<Restaurant>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

function RestaurantDetailsSection({
  restaurant,
  setRestaurant,
  isEditing,
  setIsEditing,
}: RestaurantDetailsSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Restaurant Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
        >
          {isEditing ? 'Done Editing' : 'Edit Restaurant'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Restaurant Name
          <input
            value={restaurant.name}
            disabled={!isEditing}
            onChange={event =>
              setRestaurant(current => ({
                ...current,
                name: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </label>

        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 md:col-span-2">
          Address
          <input
            value={restaurant.location.address}
            disabled={!isEditing}
            onChange={event =>
              setRestaurant(current => ({
                ...current,
                location: {
                  ...current.location,
                  address: event.target.value,
                },
              }))
            }
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </label>
      </div>
    </section>
  );
}

export default RestaurantDetailsSection;
