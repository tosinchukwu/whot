import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, Play } from "lucide-react";

export default function PlayersList({ game, currentUser }) {
  return (
    <Card className="border-2 border-gray-300 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-300">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Players
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {game.players?.map((playerEmail) => (
            <div
              key={playerEmail}
              className={`p-3 rounded-lg border-2 transition-all ${
                game.current_turn_email === playerEmail
                  ? "bg-green-100 border-green-400 shadow-md"
                  : "bg-white border-gray-200"
              } ${
                playerEmail === currentUser.email
                  ? "ring-2 ring-blue-400"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                    {playerEmail[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {playerEmail.split('@')[0]}
                      {playerEmail === currentUser.email && (
                        <span className="text-blue-600 ml-1">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {game.player_hands?.[playerEmail]?.length || 0} cards
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {game.host_email === playerEmail && (
                    <Crown className="w-4 h-4 text-yellow-600" />
                  )}
                  {game.current_turn_email === playerEmail && (
                    <Play className="w-4 h-4 text-green-600 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
