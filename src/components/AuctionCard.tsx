'use client';

import Link from 'next/link';
import { Auction } from '../types/types';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
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
          {auction.artwork.imageUrl && (
            <Image
              src={auction.artwork.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover blur-lg scale-110"
              aria-hidden="true"
            />
          )}

          {/* Imagen principal */}
          {auction.artwork.imageUrl ? (
            <Image
              src={auction.artwork.imageUrl}
              alt={auction.artwork.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain relative z-10"
              priority={true}
              loading="eager"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon />
            </div>
          )}
          
          {/* Badge de estado */}
          <span className={`absolute z-50 top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusColors[auction.status]}`}>
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