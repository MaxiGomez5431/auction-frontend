import api from '../lib/axios';
import { Auction, Bid, CreateBidDto } from '../types/types';

export const auctionService = {
  // Obtener todas las subastas
  async getAll(): Promise<Auction[]> {
    const { data } = await api.get('/auction');
    return data;
  },

  // Obtener una subasta por ID
  async getById(id: number): Promise<Auction> {
    const { data } = await api.get(`/auction/${id}`);
    return data;
  },

  // Obtener subastas activas
  async getActive(): Promise<Auction[]> {
    const { data } = await api.get('/auction/active');
    return data;
  },

  // Crear una puja
  async createBid(bidData: CreateBidDto): Promise<Bid> {
    const { data } = await api.post('/bid', bidData);
    return data;
  },

  // Obtener pujas de una subasta
  async getBids(auctionId: number): Promise<Bid[]> {
    const { data } = await api.get(`/auction/${auctionId}/bid`);
    return data;
  },
};
