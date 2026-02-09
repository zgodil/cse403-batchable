import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={() => loginWithRedirect()}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Log In
      </button>
    </div>
  );
}