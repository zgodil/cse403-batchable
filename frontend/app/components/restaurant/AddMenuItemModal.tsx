import {useContext} from 'react';
import FormField from '../FormField';
import FormModal from '../FormModal';
import type {ModalState} from '../Modal';
import RestaurantContext from '../RestaurantContext';
import {fakeId, type MenuItem} from '~/domain/objects';

interface Props {
  state: ModalState;
}
export default function AddMenuItemModal({state}: Props) {
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

    console.log('Added Menu Item:', newMenuItem);
    // back-end API call
  };

  return (
    <FormModal
      title="Add Menu Item"
      state={state}
      apply={submitNewMenuItem}
      confirm="Add Item"
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
