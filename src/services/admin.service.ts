import api from "../lib/axios";
import { Auction, CreateArtworkDto, CreateAuctionDto, User } from "../types/types";


export const adminService = {
  // Obras
  async createArtwork(data: CreateArtworkDto) {
    const { data: response } = await api.post('/artwork', data);
    return response;
  },

  async getArtworks() {
    const { data } = await api.get('/artwork');
    return data;
  },

  async deleteArtwork(artworkId: number) {
    const { data } = await api.delete(`/artwork/${artworkId}`);
    return data;
  },

  // Subastas
  async getAuctions(): Promise<Auction[]> {
    const { data } = await api.get('/auction');
    return data;
  },

  async createAuction(data: CreateAuctionDto) {
    const { data: response } = await api.post('/auction', data);
    return response;
  },

  async finishAuction(auctionId: number) {
    const { data } = await api.patch(`/auction/${auctionId}/finish`);
    return data;
  },

  async deleteAuction(auctionId: number) {
    const { data } = await api.delete(`/auction/${auctionId}`);
    return data;
  },

  // Usuarios
  async getAllUsers(): Promise<User[]> {
    const { data } = await api.get('/auth/user');
    return data;
  },

  async updateUserVerification(
    userId: number,
    verificationData: { isVerified: boolean }
  ) {
    const { data: response } = await api.patch(
      `/auth/admin/verify-user/${userId}`,
      verificationData
    );
    return response;
  },

    async deleteUser(id: number) {
    const { data } = await api.delete(`auth/user/${id}`);
    return data;
  },
};