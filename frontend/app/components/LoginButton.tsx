import {useAuth0} from '@auth0/auth0-react';
import Button from './Button';

/**
 * Represents a button which redirects to the Auth0 authorization flow, and then back to the main page.
 */
export default function LoginButton() {
  const {loginWithRedirect} = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
}
