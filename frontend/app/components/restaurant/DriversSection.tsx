import {useState} from 'react';
import type {Dispatch, FormEvent, SetStateAction} from 'react';
import type {Driver, Restaurant} from '../../domain/objects';

type DriversSectionProps = {
  drivers: Driver[];
  setDrivers: Dispatch<SetStateAction<Driver[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  restaurantId: Restaurant['id'];
};

function DriversSection({
  drivers,
  setDrivers,
  isEditing,
  setIsEditing,
  restaurantId,
}: DriversSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverOnShift, setNewDriverOnShift] = useState(false);

  const submitNewDriver = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextId =
      drivers.length === 0
        ? 1
        : Math.max(...drivers.map(driver => driver.id.id)) + 1;
    setDrivers(current => [
      ...current,
      {
        id: {type: 'Driver', id: nextId},
        name: newDriverName.trim(),
        phoneNumber: newDriverPhone.trim(),
        restaurant: restaurantId,
        onShift: newDriverOnShift,
      },
    ]);
    setIsAddModalOpen(false);
    setNewDriverName('');
    setNewDriverPhone('');
    setNewDriverOnShift(false);
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Drivers</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
          >
            + Add Driver
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            {isEditing ? 'Done Editing' : 'Edit Drivers'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300">
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Phone</th>
              <th className="px-3 py-2 font-semibold">Shift</th>
              {isEditing && (
                <th className="px-3 py-2 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr
                key={driver.id.id}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <td className="px-3 py-3">
                  {isEditing ? (
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
                  {isEditing ? (
                    <input
                      value={driver.phoneNumber}
                      onChange={event =>
                        setDrivers(current =>
                          current.map(item =>
                            item.id.id === driver.id.id
                              ? {...item, phoneNumber: event.target.value}
                              : item,
                          ),
                        )
                      }
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-1"
                    />
                  ) : (
                    driver.phoneNumber
                  )}
                </td>
                <td className="px-3 py-3">
                  {isEditing ? (
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
                {isEditing && (
                  <td className="px-3 py-3">
                    <button
                      onClick={() =>
                        setDrivers(current =>
                          current.filter(item => item.id.id !== driver.id.id),
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
              Add Driver
            </h3>
            <form onSubmit={submitNewDriver} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Driver Name
                </label>
                <input
                  value={newDriverName}
                  onChange={event => setNewDriverName(event.target.value)}
                  className="w-full rounded border border-gray-300 bg-transparent p-2 dark:border-gray-700"
                  placeholder="Enter driver name"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  value={newDriverPhone}
                  onChange={event => setNewDriverPhone(event.target.value)}
                  className="w-full rounded border border-gray-300 bg-transparent p-2 dark:border-gray-700"
                  placeholder="(206) 555-1234"
                  required
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={newDriverOnShift}
                  onChange={event => setNewDriverOnShift(event.target.checked)}
                />
                On Shift
              </label>
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
                  className="flex-1 rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default DriversSection;
