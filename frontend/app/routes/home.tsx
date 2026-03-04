import {useAuth0} from '@auth0/auth0-react';
import LoginButton from '../components/LoginButton';
import OrderOverview from '../components/dashboard/OrderOverview';
import DriverOverview from '../components/dashboard/DriverOverview';
import AddOrderModal from '../components/dashboard/AddOrderModal';
import Button from '~/components/Button';
import Loading from '~/components/Loading';
import {useModal} from '~/components/Modal';
import OrderRefreshProvider from '~/components/OrderRefreshProvider';

function Home() {
  const {isAuthenticated, isLoading, user, logout} = useAuth0();
  const addOrderModal = useModal();

  if (isLoading) {
    return <Loading>Loading...</Loading>
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
    <OrderRefreshProvider>
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
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
            )}
            <Button
              onClick={() =>
                logout({logoutParams: {returnTo: window.location.origin}})
              }
              style="dark"
            >
              Log out
            </Button>
            <Button style="purple" to="/restaurant">
              ⚙️ Manage Restaurant
            </Button>
            <Button onClick={() => addOrderModal.setOpen(true)} style="blue">
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
    </OrderRefreshProvider>
  );
}

export default Home;
