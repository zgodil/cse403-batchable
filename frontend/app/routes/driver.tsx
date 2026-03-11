import OrderRefreshProvider from '~/components/OrderRefreshProvider';
import type {Route} from './+types/driver';
import DriverPage from '~/components/driver/DriverPage';
import {DriverTokenContext} from '~/components/DriverTokenContext';
import {ConfettiProvider} from '~/components/ConfettiProvider';

export default function Route({params: {token}}: Route.ComponentProps) {
  return (
    <DriverTokenContext value={token}>
      <OrderRefreshProvider useDriverToken>
        <ConfettiProvider>
          <div className="p-8 w-full flex flex-col gap-2 max-w-100 mx-auto">
            <DriverPage />
          </div>
        </ConfettiProvider>
      </OrderRefreshProvider>
    </DriverTokenContext>
  );
}
