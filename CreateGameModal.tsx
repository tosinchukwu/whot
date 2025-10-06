import React, { useState } from "react";
import { Game } from "@/entities/Game";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateGameModal({ open, onClose, user, onGameCreated }) {
  const [roomName, setRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("4");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name");
      return;
    }

    setIsCreating(true);
    const newGame = await Game.create({
      room_name: roomName,
      host_email: user.email,
      status: "waiting",
      players: [user.email],
      max_players: parseInt(maxPlayers),
      deck: [],
      discard_pile: [],
      player_hands: {}
    });

    setIsCreating(false);
    onGameCreated(newGame.id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Game</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Maximum Players</Label>
            <Select value={maxPlayers} onValueChange={setMaxPlayers}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="3">3 Players</SelectItem>
                <SelectItem value="4">4 Players</SelectItem>
                <SelectItem value="5">5 Players</SelectItem>
                <SelectItem value="6">6 Players</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCreating ? "Creating..." : "Create Game"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
