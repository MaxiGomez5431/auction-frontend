'use client';

import Link from 'next/link';
import { Auction } from '../types/types';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  // Determinar el precio actual
  const currentPrice = auction.currentBid?.amount || auction.startingPrice;
  
  // Formatear fechas
  const startDate = new Date(auction.startTime).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const endDate = new Date(auction.endTime).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Determinar color según estado
  const statusColors = {
    SCHEDULED: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    FINISHED: 'bg-gray-100 text-gray-800'
  };

  const statusText = {
    SCHEDULED: 'Programada',
    ACTIVE: 'Activa',
    FINISHED: 'Finalizada'
  };

  return (
    <Link href={`/auction/${auction.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer w-auto">
        {/* Imagen de la obra */}
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          {auction.artwork.imageUrl ? (
            <>
            <Image 
              src={auction.artwork.imageUrl}
              alt=""
              fill
              className="object-cover blur-lg"
            />
            <Image 
              src={auction.artwork.imageUrl}
              alt={auction.artwork.title}
              width={300}
              height={300}
              className="object-contain mx-auto h-full relative z-10"
            />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badge de estado */}
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusColors[auction.status]}`}>
            {statusText[auction.status]}
          </span>
        </div>

        
        <div className="p-4 flex flex-row justify-between items-center">

          {/* Precio actual */}
          <div className="">
            <p className="text-sm text-gray-500">Precio actual</p>
            <p className="text-2xl font-bold text-blue-600">
              ${currentPrice.toLocaleString()}
            </p>

          </div>

          {/* Fechas */}
          <div className="flex justify-center flex-col text-sm text-gray-600 space-y-2 h-full">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span><strong>Inicio:</strong> {startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span><strong>Fin:</strong> {endDate}</span>
            </div>
          </div>


        </div>
      </div>
    </Link>
  );
}