import {useEffect, useState, type Dispatch, type SetStateAction} from 'react';
import type {Driver} from '../../domain/objects';
import {useModal} from '../Modal';
import AddDriverModal from './AddDriverModal';
import Button from '../Button';
import {driverApi} from '~/api/endpoints/driver';
import DriverRow from './DriverRow';

type DriversSectionProps = {
  drivers: Driver[];
  setDrivers: Dispatch<SetStateAction<Driver[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  refreshRestaurantData: () => Promise<void> | void;
};

function DriversSection({
  drivers,
  setDrivers,
  isEditing,
  setIsEditing,
  refreshRestaurantData,
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

  const createDriver = async (driver: Driver) => {
    const createdId = await driverApi.create(driver);
    if (!createdId) {
      alert('Failed to create driver.');
      return;
    }
    await refreshRestaurantData();
  };

  const saveDriver = async (driver: Driver) => {
    const updated = await driverApi.update(driver);
    if (!updated) {
      alert('Failed to update driver.');
      await refreshRestaurantData();
      return;
    }
    setEditingDriverId(null);
    await refreshRestaurantData();
  };

  const deleteDriver = async (driver: Driver) => {
    const deleted = await driverApi.delete(driver.id);
    if (!deleted) {
      alert('Failed to delete driver.');
      return;
    }
    if (editingDriverId === driver.id.id) {
      setEditingDriverId(null);
    }
    await refreshRestaurantData();
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
                <DriverRow
                  key={driver.id.id}
                  driver={driver}
                  isEditingSection={isEditing}
                  isEditingDriver={isEditingDriver}
                  setDrivers={setDrivers}
                  onToggleEdit={() => {
                    if (!isEditingDriver) {
                      setEditingDriverId(driver.id.id);
                      return;
                    }
                    void saveDriver(driver);
                  }}
                  onDelete={() => void deleteDriver(driver)}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <AddDriverModal state={addDriverModal} onCreate={createDriver} />
    </section>
  );
}

export default DriversSection;
