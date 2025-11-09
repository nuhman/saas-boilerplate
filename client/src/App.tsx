import { MovieWatchlist } from "./pages/movies/components/WatchList";
import { useSession, signOut } from "./lib/auth-client";
import { AuthPage } from "./pages/Auth";
import { Button } from "./components/ui/button";
import { LogOut } from "lucide-react";

function App() {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthPage onAuthSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{session.user.name}</p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <MovieWatchlist />
    </div>
  );
}

export default App;
