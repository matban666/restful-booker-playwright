export interface Room {
    forEach(arg0: (currentRoom: Room) => void): unknown;
    roomName: string;
    type: string;
    accessible: boolean;
    description: string;
    image: string;
    roomPrice: number;
    features: string[];
  }