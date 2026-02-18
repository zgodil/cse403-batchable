import {useContext} from 'react';
import FormField from '../FormField';
import FormModal from '../FormModal';
import type {ModalState} from '../Modal';
import RestaurantContext from '../RestaurantContext';
import {fakeId, type MenuItem} from '~/domain/objects';

interface Props {
  state: ModalState;
  onCreate: (menuItem: MenuItem) => Promise<void> | void;
}
export default function AddMenuItemModal({state, onCreate}: Props) {
  const restaurant = useContext(RestaurantContext);
  const submitNewMenuItem = (data: {name: string}) => {
    if (!restaurant) {
      alert("You're not logged in");
      return;
    }

    const newMenuItem: MenuItem = {
      id: fakeId('MenuItem'),
      restaurant,
      name: data.name,
    };

    void onCreate(newMenuItem);
  };

  return (
    <FormModal
      title="Add Menu Item"
      state={state}
      apply={submitNewMenuItem}
      confirm="Add Item"
      style="amber"
    >
      <FormField
        label="Item Name"
        type="text"
        name="name"
        placeholder="Enter menu item name"
      />
    </FormModal>
  );
}
