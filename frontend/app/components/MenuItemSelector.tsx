import type {Dispatch, SetStateAction} from 'react';
import type {MenuItem} from '~/domain/objects';
import FormField from './FormField';
import LoadError from './LoadError';
import Loading from './Loading';

interface Props {
  menuItems: MenuItem[];
  selectedItemNames: string[];
  setSelectedItemNames: Dispatch<SetStateAction<string[]>>;
  loadingMenuItems: boolean;
  menuItemsLoadFailed: boolean;
  label?: string;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
}

export default function MenuItemSelector({
  menuItems,
  selectedItemNames,
  setSelectedItemNames,
  loadingMenuItems,
  menuItemsLoadFailed,
  label = 'Menu Items',
  loadingMessage = 'Loading menu items...',
  errorMessage = 'Could not load menu items. Try opening the modal again.',
  emptyMessage = 'No menu items available yet. Add items from Restaurant Page first.',
}: Props) {
  return (
    <div className="space-y-2">
      <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </p>
      {loadingMenuItems ? (
        <Loading>{loadingMessage}</Loading>
      ) : menuItemsLoadFailed ? (
        <LoadError>{errorMessage}</LoadError>
      ) : menuItems.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      ) : (
        <div className="max-h-40 space-y-2 overflow-y-auto rounded border border-gray-300 p-3 dark:border-gray-700">
          {menuItems.map(menuItem => {
            const checked = selectedItemNames.includes(menuItem.name);
            return (
              <FormField
                key={menuItem.id.id}
                label={menuItem.name}
                type="checkbox"
                name={`menu-item-${menuItem.id.id}`}
                value={menuItem.name}
                checked={checked}
                required={selectedItemNames.length === 0}
                onChange={event => {
                  setSelectedItemNames(current =>
                    event.target.checked
                      ? current.includes(menuItem.name)
                        ? current
                        : [...current, menuItem.name]
                      : current.filter(name => name !== menuItem.name),
                  );
                }}
              />
            );
          })}
        </div>
      )}
      {selectedItemNames.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Selected: {selectedItemNames.join(', ')}
        </p>
      )}
    </div>
  );
}
