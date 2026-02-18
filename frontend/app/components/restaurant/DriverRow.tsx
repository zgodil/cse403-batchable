import type {Dispatch, SetStateAction} from 'react';
import type {Driver} from '~/domain/objects';
import Button from '../Button';

type DriverRowProps = {
  driver: Driver;
  isEditingSection: boolean;
  isEditingDriver: boolean;
  setDrivers: Dispatch<SetStateAction<Driver[]>>;
  onToggleEdit: () => void;
  onDelete: () => void;
};

export default function DriverRow({
  driver,
  isEditingSection,
  isEditingDriver,
  setDrivers,
  onToggleEdit,
  onDelete,
}: DriverRowProps) {
  return (
    <tr
      key={driver.id.id}
      className="border-b border-gray-100 dark:border-gray-800"
    >
      <td className="px-3 py-3">
        {isEditingSection && isEditingDriver ? (
          <input
            value={driver.name}
            onChange={event =>
              setDrivers(current =>
                current.map(item =>
                  item.id.id === driver.id.id
                    ? {...item, name: event.target.value}
                    : item,
                ),
              )
            }
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-1"
          />
        ) : (
          driver.name
        )}
      </td>
      <td className="px-3 py-3">
        {isEditingSection && isEditingDriver ? (
          <input
            value={driver.phoneNumber.compact}
            onChange={event =>
              setDrivers(current =>
                current.map(item =>
                  item.id.id === driver.id.id
                    ? {
                        ...item,
                        phoneNumber: {compact: event.target.value},
                      }
                    : item,
                ),
              )
            }
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-1"
          />
        ) : (
          driver.phoneNumber.compact
        )}
      </td>
      <td className="px-3 py-3">
        {isEditingSection && isEditingDriver ? (
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={driver.onShift}
              onChange={event =>
                setDrivers(current =>
                  current.map(item =>
                    item.id.id === driver.id.id
                      ? {
                          ...item,
                          onShift: event.target.checked,
                        }
                      : item,
                  ),
                )
              }
            />
            <span>On Shift</span>
          </label>
        ) : (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              driver.onShift
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            {driver.onShift ? 'On Shift' : 'Off Shift'}
          </span>
        )}
      </td>
      {isEditingSection && (
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <Button
              style={isEditingDriver ? 'blue' : 'indigo'}
              small
              onClick={onToggleEdit}
            >
              {isEditingDriver ? 'Done' : 'Edit'}
            </Button>
            <Button style="red" small onClick={onDelete}>
              Delete
            </Button>
          </div>
        </td>
      )}
    </tr>
  );
}
