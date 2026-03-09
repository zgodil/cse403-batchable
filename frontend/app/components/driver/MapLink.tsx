interface Props {
  link: string;
}

/**
 * Represents the Google Maps link sent to the driver, allowing them to view their route geographically.
 * @param link The link address for the route
 */
export default function MapLink({link}: Props) {
  return (
    <p>
      Click{' '}
      <a href={link} className="text-blue-500 underline">
        here
      </a>{' '}
      to view your route.
    </p>
  );
}
