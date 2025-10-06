import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Gamepad2, Trophy, LogOut } from "lucide-react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <style>{`
        :root {
          --nigerian-green: #008751;
          --nigerian-gold: #FFD700;
          --whot-red: #E63946;
          --whot-blue: #457B9D;
          --whot-yellow: #F4A261;
          --whot-green: #2A9D8F;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-4 border-green-600 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Whot!</h1>
                <p className="text-xs text-green-600 font-medium">Naija Rules</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to={createPageUrl("Home")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === createPageUrl("Home")
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4" />
                Lobby
              </Link>
              <Link 
                to={createPageUrl("Leaderboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === createPageUrl("Leaderboard")
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {user && (
                <>
                  <div className="hidden md:block text-right">
                    <p className="font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLogout}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-green-600 shadow-lg">
        <div className="flex justify-around items-center py-3">
          <Link 
            to={createPageUrl("Home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
              location.pathname === createPageUrl("Home")
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Lobby</span>
          </Link>
          <Link 
            to={createPageUrl("Leaderboard")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
              location.pathname === createPageUrl("Leaderboard")
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-medium">Leaders</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
