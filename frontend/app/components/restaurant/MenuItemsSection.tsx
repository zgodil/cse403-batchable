import {useState} from 'react';
import type {Dispatch, FormEvent, SetStateAction} from 'react';
import type {MenuItem, Restaurant} from '../../domain/objects';

type MenuItemsSectionProps = {
  menuItems: MenuItem[];
  setMenuItems: Dispatch<SetStateAction<MenuItem[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  restaurantId: Restaurant['id'];
};

function MenuItemsSection({
  menuItems,
  setMenuItems,
  isEditing,
  setIsEditing,
  restaurantId,
}: MenuItemsSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMenuItemName, setNewMenuItemName] = useState('');

  const submitNewMenuItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextId =
      menuItems.length === 0
        ? 1
        : Math.max(...menuItems.map(item => item.id.id)) + 1;
    setMenuItems(current => [
      ...current,
      {
        id: {type: 'MenuItem', id: nextId},
        restaurant: restaurantId,
        name: newMenuItemName.trim(),
      },
    ]);
    setIsAddModalOpen(false);
    setNewMenuItemName('');
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Menu Items</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white transition hover:bg-amber-700"
          >
            + Add Menu Item
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
          >
            {isEditing ? 'Done Editing' : 'Edit Menu'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300">
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Menu Item ID</th>
              {isEditing && (
                <th className="px-3 py-2 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr
                key={item.id.id}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <td className="px-3 py-3">
                  {isEditing ? (
                    <input
                      value={item.name}
                      onChange={event =>
                        setMenuItems(current =>
                          current.map(currentItem =>
                            currentItem.id.id === item.id.id
                              ? {...currentItem, name: event.target.value}
                              : currentItem,
                          ),
                        )
                      }
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-1"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-3 py-3">{item.id.id}</td>
                {isEditing && (
                  <td className="px-3 py-3">
                    <button
                      onClick={() =>
                        setMenuItems(current =>
                          current.filter(
                            currentItem => currentItem.id.id !== item.id.id,
                          ),
                        )
                      }
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Add Menu Item
            </h3>
            <form onSubmit={submitNewMenuItem} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Item Name
                </label>
                <input
                  value={newMenuItemName}
                  onChange={event => setNewMenuItemName(event.target.value)}
                  className="w-full rounded border border-gray-300 bg-transparent p-2 dark:border-gray-700"
                  placeholder="Enter menu item name"
                  required
                />
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded-lg py-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-amber-600 py-2 text-white transition hover:bg-amber-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MenuItemsSection;
