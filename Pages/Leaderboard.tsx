import React, { useState, useEffect } from "react";
import { Game } from "@/entities/Game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const finishedGames = await Game.filter({ status: "finished" }, "-created_date", 100);
    
    const playerStats = {};
    finishedGames.forEach(game => {
      if (game.winner_email) {
        if (!playerStats[game.winner_email]) {
          playerStats[game.winner_email] = {
            email: game.winner_email,
            wins: 0,
            gamesPlayed: 0
          };
        }
        playerStats[game.winner_email].wins++;
      }
      
      game.players?.forEach(email => {
        if (!playerStats[email]) {
          playerStats[email] = {
            email: email,
            wins: 0,
            gamesPlayed: 0
          };
        }
        playerStats[email].gamesPlayed++;
      });
    });

    const sorted = Object.values(playerStats)
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 10);

    setLeaderboard(sorted);
    setIsLoading(false);
  };

  const getMedalIcon = (index) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-700" />;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h2>
        <p className="text-gray-600">Top Whot Champions</p>
      </motion.div>

      <Card className="border-2 border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-yellow-50 border-b-2 border-green-200">
          <CardTitle>Top Players</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No games completed yet. Be the first to win!
            </div>
          ) : (
            <div className="divide-y">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    index < 3 ? "bg-gradient-to-r from-yellow-50 to-transparent" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                      {index < 3 ? getMedalIcon(index) : index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">
                        {player.email.split('@')[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {player.gamesPlayed} games played
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">{player.wins}</p>
                    <p className="text-xs text-gray-500">Wins</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
