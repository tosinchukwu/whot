import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function GameOver({ game, user }) {
  const navigate = useNavigate();
  const isWinner = game.winner_email === user.email;

  return (
    <div className="max-w-2xl mx-auto">
      {isWinner && <Confetti numberOfPieces={200} recycle={false} />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <Card className="border-4 border-yellow-400 shadow-2xl">
          <CardHeader className={`${
            isWinner 
              ? "bg-gradient-to-r from-yellow-200 to-yellow-300" 
              : "bg-gradient-to-r from-gray-200 to-gray-300"
          } border-b-4 border-yellow-400`}>
            <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
              <Trophy className={`w-10 h-10 ${isWinner ? "text-yellow-600" : "text-gray-600"}`} />
              Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12 text-center">
            {isWinner ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="mb-6">
                  <h2 className="text-5xl font-bold text-yellow-600 mb-2">
                    🎉 YOU WIN! 🎉
                  </h2>
                  <p className="text-xl text-gray-700">
                    Congratulations! You are the Whot champion!
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="mb-6">
                <h2 className="text-4xl font-bold text-gray-700 mb-2">
                  Game Ended
                </h2>
                <p className="text-xl text-gray-600">
                  Winner: {game.winner_email?.split('@')[0]}
                </p>
                <p className="text-gray-500 mt-2">Better luck next time!</p>
              </div>
            )}

            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Lobby
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
