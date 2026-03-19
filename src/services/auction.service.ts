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

  // Crear una puja
  async createBid(bidData: CreateBidDto): Promise<Bid> {
    const { data } = await api.post('/bid', bidData);
    return data;
  },
};
