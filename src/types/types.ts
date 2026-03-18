export interface User {
  id: number;
  email: string;
  username: string | null;
  isVerified: boolean;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// types/auction.ts
export interface Artwork {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Bid {
  id: number;
  amount: number;
  userId: number;
  auctionId: number;
  createdAt: string;
  user?: User;
}

export interface Auction {
  id: number;
  artworkId: number;
  startingPrice: number;
  minimumIncrement: number;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'FINISHED';
  currentBidId?: number;
  currentBid?: Bid;
  artwork: Artwork;
  bids?: Bid[];
}

export interface CreateBidDto {
  amount: number;
  auctionId: number;
}