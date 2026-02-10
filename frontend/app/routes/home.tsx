import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();

  return (
    <div className="container mx-auto p-4">
      <h1>Welcome to Batchable</h1>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>
          Log In
        </button>
      ) : (
        <p>Hello, {user?.name}!</p>
      )}
    </div>
  );
}
