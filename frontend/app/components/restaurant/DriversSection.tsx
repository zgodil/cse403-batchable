import {useEffect, useState, type Dispatch, type SetStateAction} from 'react';
import type {Driver} from '../../domain/objects';
import {useModal} from '../Modal';
import AddDriverModal from './AddDriverModal';
import Button from '../Button';

type DriversSectionProps = {
  drivers: Driver[];
  setDrivers: Dispatch<SetStateAction<Driver[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

function DriversSection({
  drivers,
  setDrivers,
  isEditing,
  setIsEditing,
}: DriversSectionProps) {
  const addDriverModal = useModal();
  const [editingDriverId, setEditingDriverId] = useState<number | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setEditingDriverId(null);
    }
  }, [isEditing]);

  const toggleSectionEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Drivers</h2>
        <div className="flex items-center gap-2">
          <Button style="indigo" onClick={() => addDriverModal.setOpen(true)}>
            + Add Driver
          </Button>
          <Button style="blue" onClick={toggleSectionEditing}>
            {isEditing ? 'Done Editing' : 'Edit Drivers'}
          </Button>
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
            {drivers.map(driver => {
              const isEditingDriver = editingDriverId === driver.id.id;

              return (
                <tr
                  key={driver.id.id}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="px-3 py-3">
                    {isEditing && isEditingDriver ? (
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
                    {isEditing && isEditingDriver ? (
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
                    {isEditing && isEditingDriver ? (
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
                      <div className="flex items-center gap-2">
                        <Button
                          style={isEditingDriver ? 'blue' : 'indigo'}
                          small
                          onClick={() =>
                            setEditingDriverId(
                              isEditingDriver ? null : driver.id.id,
                            )
                          }
                        >
                          {isEditingDriver ? 'Done' : 'Edit'}
                        </Button>
                        <Button
                          style="red"
                          small
                          onClick={() => {
                            setDrivers(current =>
                              current.filter(
                                item => item.id.id !== driver.id.id,
                              ),
                            );
                            if (isEditingDriver) {
                              setEditingDriverId(null);
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

      <AddDriverModal state={addDriverModal} />
    </section>
  );
}

export default DriversSection;
