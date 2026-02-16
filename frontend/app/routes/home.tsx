import {useAuth0} from '@auth0/auth0-react';
import {Link} from 'react-router';
import LoginButton from '../components/LoginButton';
import OrderOverview from '../components/OrderOverview';
import DriverOverview from '../components/DriverOverview';
import AddOrderModal from '../components/AddOrderModal';
import Button from '~/components/Button';
import {useModal} from '~/components/Modal';

function Home() {
  const {isAuthenticated, isLoading} = useAuth0();
  const addOrderModal = useModal();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <p className="text-gray-900 dark:text-gray-100">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Welcome to Batchable
        </h1>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Batchable Dashboard
          </h1>
          <p className="text-xs italic">
            Adaptive Real-Time Delivery Batching System
          </p>
        </div>
        <div className="flex gap-3">
          <Button style="secondary" to="/restaurant">
            ⚙️ Manage Restaurant
          </Button>
          <Button onClick={() => addOrderModal.setOpen(true)} style="primary">
            + Add New Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrderOverview />
        <DriverOverview />
      </div>

      <AddOrderModal modal={addOrderModal} />
    </div>
  );
}

export default Home;
