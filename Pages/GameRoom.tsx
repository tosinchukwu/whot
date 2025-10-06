import React, { useState, useEffect } from "react";
import { Game } from "@/entities/Game";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GameBoard from "../components/game/GameBoard";
import PlayerHand from "../components/game/PlayerHand";
import PlayersList from "../components/game/PlayersList";
import WaitingRoom from "../components/game/WaitingRoom";
import GameOver from "../components/game/GameOver";

export default function GameRoom() {
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get("gameId");

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user && gameId) {
      loadGame();
      const interval = setInterval(loadGame, 2000);
      return () => clearInterval(interval);
    }
  }, [user, gameId]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      navigate(createPageUrl("Home"));
    }
  };

  const loadGame = async () => {
    const gameData = await Game.get(gameId);
    if (!gameData) {
      navigate(createPageUrl("Home"));
      return;
    }
    setGame(gameData);
    setIsLoading(false);
  };

  const initializeDeck = () => {
    const shapes = ["circle", "triangle", "cross", "square", "star"];
    const deck = [];

    shapes.forEach(shape => {
      for (let num = 1; num <= 14; num++) {
        if (num === 8) continue;
        deck.push({ shape, number: num });
      }
    });

    for (let i = 0; i < 5; i++) {
      deck.push({ shape: "whot", number: 20 });
    }

    return deck.sort(() => Math.random() - 0.5);
  };

  const dealCards = (deck, numPlayers) => {
    const hands = {};
    game.players.forEach(email => {
      hands[email] = [];
    });

    for (let i = 0; i < 6; i++) {
      game.players.forEach(email => {
        if (deck.length > 0) {
          hands[email].push(deck.pop());
        }
      });
    }

    return { hands, remainingDeck: deck };
  };

  const startGame = async () => {
    if (game.host_email !== user.email) return;

    const deck = initializeDeck();
    const { hands, remainingDeck } = dealCards(deck, game.players.length);
    const firstCard = remainingDeck.pop();

    await Game.update(game.id, {
      status: "in_progress",
      deck: remainingDeck,
      player_hands: hands,
      last_played_card: firstCard,
      discard_pile: [firstCard],
      current_turn_email: game.players[0]
    });
  };

  const playCard = async (card) => {
    if (game.current_turn_email !== user.email) return;
    if (!canPlayCard(card)) return;

    const myHand = game.player_hands[user.email];
    const updatedHand = myHand.filter(c => !(c.shape === card.shape && c.number === card.number));

    if (updatedHand.length === 0) {
      await Game.update(game.id, {
        status: "finished",
        winner_email: user.email,
        player_hands: { ...game.player_hands, [user.email]: updatedHand },
        last_played_card: card,
        discard_pile: [...game.discard_pile, card]
      });
      return;
    }

    const currentIndex = game.players.indexOf(user.email);
    const nextIndex = (currentIndex + 1) % game.players.length;
    const nextPlayer = game.players[nextIndex];

    const effect = getCardEffect(card);

    await Game.update(game.id, {
      player_hands: { ...game.player_hands, [user.email]: updatedHand },
      last_played_card: card,
      discard_pile: [...game.discard_pile, card],
      current_turn_email: nextPlayer,
      active_effect: effect
    });
  };

  const drawCard = async () => {
    if (game.current_turn_email !== user.email) return;

    let deck = [...game.deck];
    if (deck.length === 0) {
      const discardPile = [...game.discard_pile];
      const lastCard = discardPile.pop();
      deck = discardPile.sort(() => Math.random() - 0.5);
      await Game.update(game.id, {
        deck: deck,
        discard_pile: [lastCard]
      });
    }

    const drawnCard = deck.pop();
    const myHand = [...game.player_hands[user.email], drawnCard];

    const currentIndex = game.players.indexOf(user.email);
    const nextIndex = (currentIndex + 1) % game.players.length;
    const nextPlayer = game.players[nextIndex];

    await Game.update(game.id, {
      deck: deck,
      player_hands: { ...game.player_hands, [user.email]: myHand },
      current_turn_email: nextPlayer,
      active_effect: null
    });
  };

  const canPlayCard = (card) => {
    if (!game.last_played_card) return true;
    if (card.shape === "whot") return true;
    if (game.last_played_card.shape === "whot") return true;
    return card.shape === game.last_played_card.shape || card.number === game.last_played_card.number;
  };

  const getCardEffect = (card) => {
    if (card.number === 2) return { type: "pick", value: 2 };
    if (card.number === 5 && card.shape === "star") return { type: "pick", value: 3 };
    if (card.number === 1) return { type: "hold", value: 1 };
    if (card.number === 14) return { type: "general_market", value: 1 };
    return null;
  };

  if (isLoading || !game || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (game.status === "finished") {
    return <GameOver game={game} user={user} />;
  }

  if (game.status === "waiting") {
    return <WaitingRoom game={game} user={user} onStartGame={startGame} />;
  }

  return (
    <div className="pb-24 md:pb-8">
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PlayersList game={game} currentUser={user} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <GameBoard game={game} onDrawCard={drawCard} />
          <PlayerHand
            cards={game.player_hands[user.email] || []}
            onPlayCard={playCard}
            canPlayCard={canPlayCard}
            isMyTurn={game.current_turn_email === user.email}
          />
        </div>
      </div>
    </div>
  );
}
