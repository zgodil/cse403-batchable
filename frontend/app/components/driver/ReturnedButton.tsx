import {driverApi} from '~/api/endpoints/driver';
import Button from '../Button';
import {useContext} from 'react';
import {DriverTokenContext} from '../DriverTokenContext';
import type {Order} from '~/domain/objects';

interface Props {
  orders: Order[];
}

export default function ReturnedButton({orders}: Props) {
  const token = useContext(DriverTokenContext);
  const allDelivered = orders.every(order => order.state === 'delivered');

  const completeRoute = async () => {
    if (!token || !(await driverApi.markReturned(token))) {
      alert('Failed to complete route');
    }
  };

  return (
    <Button style="emerald" onClick={allDelivered ? completeRoute : undefined}>
      Complete Route
    </Button>
  );
}
