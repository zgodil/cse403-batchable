import {useEffect, useState, type Dispatch, type SetStateAction} from 'react';
import type {MenuItem} from '../../domain/objects';
import {useModal} from '../Modal';
import AddMenuItemModal from './AddMenuItemModal';
import Button from '../Button';

type MenuItemsSectionProps = {
  menuItems: MenuItem[];
  setMenuItems: Dispatch<SetStateAction<MenuItem[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

function MenuItemsSection({
  menuItems,
  setMenuItems,
  isEditing,
  setIsEditing,
}: MenuItemsSectionProps) {
  const addMenuItemModal = useModal();
  const [editingMenuItemId, setEditingMenuItemId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!isEditing) {
      setEditingMenuItemId(null);
    }
  }, [isEditing]);

  const toggleSectionEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Menu Items</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => addMenuItemModal.setOpen(true)} style="amber">
            + Add Menu Item
          </Button>
          <Button onClick={toggleSectionEditing} style="orange">
            {isEditing ? 'Done Editing' : 'Edit Menu'}
          </Button>
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
            {menuItems.map(item => {
              const isEditingMenuItem = editingMenuItemId === item.id.id;

              return (
                <tr
                  key={item.id.id}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="px-3 py-3">
                    {isEditing && isEditingMenuItem ? (
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
                      <div className="flex items-center gap-2">
                        <Button
                          style={isEditingMenuItem ? 'orange' : 'amber'}
                          small
                          onClick={() =>
                            setEditingMenuItemId(
                              isEditingMenuItem ? null : item.id.id,
                            )
                          }
                        >
                          {isEditingMenuItem ? 'Done' : 'Edit'}
                        </Button>
                        <Button
                          style="red"
                          small
                          onClick={() => {
                            setMenuItems(current =>
                              current.filter(
                                currentItem => currentItem.id.id !== item.id.id,
                              ),
                            );
                            if (isEditingMenuItem) {
                              setEditingMenuItemId(null);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddMenuItemModal state={addMenuItemModal} />
    </section>
  );
}

export default MenuItemsSection;
