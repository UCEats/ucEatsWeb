import { SignedIn, SignedOut, SignIn, useAuth } from "@clerk/clerk-react";
import ManageMenu from "./components/manage-menu";

export default function App() {
  const { signOut } = useAuth();

  return (
    <main className="min-h-screen bg-background">
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignIn routing="hash" />
        </div>
      </SignedOut>

      <SignedIn>
        <ManageMenu onLogout={signOut} />
      </SignedIn>
    </main>
  );
}
