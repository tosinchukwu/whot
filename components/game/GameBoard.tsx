import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, ArrowDown } from "lucide-react";
import WhotCard from "./WhotCard";

export default function GameBoard({ game, onDrawCard }) {
  return (
    <Card className="border-2 border-gray-300 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-100 to-yellow-100 border-b-2 border-green-300">
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Game Board
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex items-center justify-center gap-12">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-gray-600">Deck</p>
            <div className="relative">
              <div className="w-24 h-36 bg-gradient-to-br from-green-700 to-green-900 rounded-xl shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform">
                <Layers className="w-12 h-12 text-white opacity-50" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white font-bold text-xs px-2 py-1 rounded-full shadow-lg">
                {game.deck?.length || 0}
              </div>
            </div>
            <Button
              onClick={onDrawCard}
              disabled={game.current_turn_email !== game.players?.find(p => p)}
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <ArrowDown className="w-4 h-4 mr-1" />
              Draw
            </Button>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-gray-600">Last Played</p>
            {game.last_played_card ? (
              <div className="transform hover:scale-110 transition-transform">
                <WhotCard card={game.last_played_card} size="large" />
              </div>
            ) : (
              <div className="w-24 h-36 bg-gray-200 rounded-xl shadow-xl flex items-center justify-center">
                <p className="text-gray-400 text-xs">No card</p>
              </div>
            )}
          </div>
        </div>

        {game.active_effect && (
          <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-center">
            <p className="font-bold text-red-700">
              {game.active_effect.type === "pick" && `Pick ${game.active_effect.value}!`}
              {game.active_effect.type === "hold" && "Hold On!"}
              {game.active_effect.type === "general_market" && "General Market!"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
