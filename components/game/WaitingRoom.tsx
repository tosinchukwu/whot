import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Play, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function WaitingRoom({ game, user, onStartGame }) {
  const isHost = game.host_email === user.email;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-2 border-gray-300 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-100 to-green-100 border-b-2 border-yellow-300">
            <CardTitle className="text-2xl text-center">Waiting for Players...</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">{game.room_name}</h3>
              <p className="text-gray-600">
                {game.players.length} / {game.max_players} players joined
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {game.players.map((playerEmail, index) => (
                <motion.div
                  key={playerEmail}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                    {playerEmail[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {playerEmail.split('@')[0]}
                      {playerEmail === user.email && (
                        <span className="text-blue-600 ml-2">(You)</span>
                      )}
                      {playerEmail === game.host_email && (
                        <span className="text-yellow-600 ml-2">(Host)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">Ready to play</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {isHost ? (
              <Button
                onClick={onStartGame}
                disabled={game.players.length < 2}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            ) : (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-900 font-medium">
                  Waiting for host to start the game...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
