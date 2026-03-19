// src/components/admin/auctions/AuctionCard.tsx
'use client';

import { Auction } from '@/types/types';
import { Gavel } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriceCard } from './PriceCard';
import { DateDisplay } from './DateDisplay';
import { FinishAuctionButton } from './FinishAuctionButton';
import { DeleteButton } from '../../ui/DeleteButton';

interface AuctionCardProps {
  auction: Auction;
  onFinish: (id: number) => Promise<void>;
  isFinishing: boolean;
  onDelete: (id: number) => Promise<void>;
}

export function AuctionCard({ auction, onFinish, isFinishing, onDelete }: AuctionCardProps) {
  const currentPrice = auction.currentBid?.amount || auction.startingPrice;

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header de la card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Gavel className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {auction.artwork.title}
            </h3>
            <p className="text-sm text-gray-500">
              ID: {auction.id} • Obra #{auction.artworkId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={auction.status} />
          <DeleteButton 
            id={auction.id} 
            type="auction"
            onDelete={onDelete} 
          />
        </div>
      </div>

      {/* Grid de precios */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 text-sm sm:text-base">
        <PriceCard label="Precio inicial" value={auction.startingPrice} />
        <PriceCard label="Precio actual" value={currentPrice} variant="current" />
        <PriceCard label="Incremento" value={auction.minimumIncrement} />
        <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Pujas</p>
          <p className="font-semibold text-gray-900 text-sm sm:text-base">
            {auction.bids?.length || 0}
          </p>
        </div>
      </div>

      {/* Botón de finalizar (solo para no finalizadas) */}
      {auction.status !== 'FINISHED' && (
        <div className="mt-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Fechas */}
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 text-xs lg:text-sm text-gray-500 w-full">
            <DateDisplay label="Inicio" date={auction.startTime} />
            <DateDisplay label="Fin" date={auction.endTime} />
          </div>

          {/* Botón */}
          <FinishAuctionButton
            auctionId={auction.id}
            onFinish={onFinish}
            isFinishing={isFinishing}
          />
        </div>
      )}
    </div>
  );
}