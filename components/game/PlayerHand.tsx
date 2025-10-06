import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hand } from "lucide-react";
import WhotCard from "./WhotCard";
import { motion } from "framer-motion";

export default function PlayerHand({ cards, onPlayCard, canPlayCard, isMyTurn }) {
  return (
    <Card className="border-2 border-gray-300 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b-2 border-blue-300">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Hand className="w-5 h-5" />
            Your Hand ({cards.length} cards)
          </span>
          {isMyTurn && (
            <span className="text-sm font-normal bg-green-500 text-white px-3 py-1 rounded-full animate-pulse">
              Your Turn!
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No cards in hand</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => isMyTurn && canPlayCard(card) && onPlayCard(card)}
                className={`cursor-pointer ${
                  isMyTurn && canPlayCard(card)
                    ? "hover:scale-110 hover:-translate-y-2"
                    : "opacity-50 cursor-not-allowed"
                } transition-all duration-200`}
              >
                <WhotCard card={card} />
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
