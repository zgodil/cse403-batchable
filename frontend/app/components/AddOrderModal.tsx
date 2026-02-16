import {fakeId, type Order} from '~/domain/objects';
import * as json from '~/domain/json';
import Modal, {type ModalState} from './Modal';
import {useContext} from 'react';
import RestaurantContext from './RestaurantContext';
import EditControls from './EditControls';

type FieldProps = {
  type: string;
  name: string;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function FormField(props: FieldProps) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <input
        className="w-full p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700"
        {...props}
      />
    </div>
  );
}

interface ModalProps {
  modal: ModalState;
}

export default function AddOrderModal({modal}: ModalProps) {
  const restaurant = useContext(RestaurantContext);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    if (!restaurant) {
      alert("You aren't logged in");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      address: string;
      items: string;
      cookTime: string;
      deliverTime: string;
    };

    const MS_PER_MINUTE = 60 * 1000;

    const initialTime = new Date();
    const cookedTime = new Date(
      initialTime.getTime() + MS_PER_MINUTE * Number(data.cookTime),
    );
    const deliveryTime = new Date(
      cookedTime.getTime() + MS_PER_MINUTE * Number(data.deliverTime),
    );

    const order: Order = {
      id: fakeId('Order'),
      restaurant,
      destination: {
        address: data.address,
      },
      initialTime,
      cookedTime,
      deliveryTime,
      currentBatch: null,
      highPriority: false,
      itemNames: data.items.split(',').map(name => name.trim()),
      state: 'cooking',
    };

    console.log('New Order Data:', json.order.unparse(order));
    // call Backend Web Server API
  };

  return (
    <Modal title="Create New Order" state={modal}>
      <form onSubmit={handleSubmit} className="space-y-4" method="dialog">
        <FormField
          type="text"
          name="address"
          label="Customer Address"
          placeholder="123 Batch St"
          required
        />
        <FormField
          type="text"
          name="items"
          label="Item Name(s)"
          placeholder="Tiramisu, Shrimp Fried Rice, ..."
          required
        />
        <FormField
          type="number"
          name="cookTime"
          label="Prep Time (min)"
          defaultValue="15"
          required
        />
        <FormField
          type="number"
          name="deliverTime"
          label="Delivery Time (min)"
          defaultValue="30"
          required
        />
        <EditControls confirm="Submit Order" state={modal} />
      </form>
    </Modal>
  );
}
