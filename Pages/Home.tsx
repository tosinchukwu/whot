import React, { useState, useEffect } from "react";
import { Game } from "@/entities/Game";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Play, Clock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CreateGameModal from "../components/game/CreateGameModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadGames();
      const interval = setInterval(loadGames, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      await User.login();
    }
  };

  const loadGames = async () => {
    const allGames = await Game.filter({ status: ["waiting", "in_progress"] }, "-created_date");
    setGames(allGames);
    setIsLoading(false);
  };

  const joinGame = async (game) => {
    if (game.players.includes(user.email)) {
      navigate(createPageUrl("GameRoom") + `?gameId=${game.id}`);
      return;
    }

    if (game.players.length >= game.max_players) {
      alert("Game is full!");
      return;
    }

    const updatedPlayers = [...game.players, user.email];
    await Game.update(game.id, { players: updatedPlayers });
    navigate(createPageUrl("GameRoom") + `?gameId=${game.id}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      waiting: { text: "Waiting", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      in_progress: { text: "In Progress", color: "bg-green-100 text-green-700 border-green-300" },
    };
    return badges[status] || badges.waiting;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome to Whot!
          </h2>
          <p className="text-gray-600 text-lg">Naija's favorite card game, now online</p>
        </motion.div>

        <div className="flex justify-center">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Game
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Play className="w-6 h-6 text-green-600" />
          Active Games
        </h3>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-gray-100" />
              </Card>
            ))}
          </div>
        ) : games.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No active games. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-400">
                    <CardHeader className="bg-gradient-to-br from-green-50 to-yellow-50 border-b-2 border-green-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{game.room_name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Crown className="w-4 h-4 text-yellow-600" />
                            <span>Host: {game.host_email.split('@')[0]}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(game.status).color}`}>
                          {getStatusBadge(game.status).text}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Players
                          </span>
                          <span className="font-bold text-green-600">
                            {game.players.length} / {game.max_players}
                          </span>
                        </div>
                        {game.status === "in_progress" && game.current_turn_email && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Current Turn
                            </span>
                            <span className="font-medium text-blue-600">
                              {game.current_turn_email.split('@')[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => joinGame(game)}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={game.players.length >= game.max_players && !game.players.includes(user.email)}
                      >
                        {game.players.includes(user.email) ? "Continue Playing" : "Join Game"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <CreateGameModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        user={user}
        onGameCreated={(gameId) => {
          setShowCreateModal(false);
          navigate(createPageUrl("GameRoom") + `?gameId=${gameId}`);
        }}
      />
    </div>
  );
}
