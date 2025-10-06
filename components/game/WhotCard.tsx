import React from "react";
import { Circle, Triangle, X, Square, Star, Zap } from "lucide-react";

export default function WhotCard({ card, size = "normal" }) {
  const getShapeIcon = (shape) => {
    const iconProps = { className: "w-full h-full" };
    switch (shape) {
      case "circle": return <Circle {...iconProps} />;
      case "triangle": return <Triangle {...iconProps} />;
      case "cross": return <X {...iconProps} />;
      case "square": return <Square {...iconProps} />;
      case "star": return <Star {...iconProps} />;
      case "whot": return <Zap {...iconProps} />;
      default: return <Circle {...iconProps} />;
    }
  };

  const getShapeColor = (shape) => {
    switch (shape) {
      case "circle": return "text-red-600";
      case "triangle": return "text-blue-600";
      case "cross": return "text-yellow-600";
      case "square": return "text-green-600";
      case "star": return "text-purple-600";
      case "whot": return "text-gray-800";
      default: return "text-gray-800";
    }
  };

  const dimensions = size === "large" ? "w-28 h-40" : "w-20 h-28";
  const iconSize = size === "large" ? "w-14 h-14" : "w-10 h-10";
  const numberSize = size === "large" ? "text-3xl" : "text-2xl";

  return (
    <div className={`${dimensions} bg-white rounded-xl shadow-lg border-4 border-gray-800 flex flex-col items-center justify-center p-2 relative`}>
      <div className={`absolute top-1 left-2 font-bold ${numberSize} ${getShapeColor(card.shape)}`}>
        {card.number}
      </div>
      <div className={`${iconSize} ${getShapeColor(card.shape)}`}>
        {getShapeIcon(card.shape)}
      </div>
      <div className={`absolute bottom-1 right-2 font-bold ${numberSize} ${getShapeColor(card.shape)} rotate-180`}>
        {card.number}
      </div>
    </div>
  );
}
