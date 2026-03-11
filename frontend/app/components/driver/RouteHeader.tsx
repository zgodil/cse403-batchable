import {useEffect} from 'react';
import type {Driver} from '~/domain/objects';
import {formatPhoneNumber} from '~/util/format';

interface Props {
  driver: Driver;
}

export default function RouteHeader({driver}: Props) {
  useEffect(() => {
    document.title = `${driver.name}'s Route`;
  }, []);

  return (
    <header className="text-center mb-5">
      <h1 className="font-bold">Current Route for {driver.name}</h1>
      <p>{formatPhoneNumber(driver.phoneNumber)}</p>
    </header>
  );
}
