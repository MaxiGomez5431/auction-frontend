// src/components/auctions/AuctionDetails.tsx
'use client';

import Image from 'next/image';
import { Auction } from '@/types/types';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface AuctionDetailsProps {
  auction: Auction;
}

export function AuctionDetails({ auction }: AuctionDetailsProps) {
  const [imageError, setImageError] = useState(false);
  
  const currentPrice = auction.currentBid?.amount || auction.startingPrice;
  const startDate = new Date(auction.startTime).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const endDate = new Date(auction.endTime).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Configuración de estados con colores más visibles
  const statusConfig = {
    SCHEDULED: {
      bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      text: 'text-white',
      label: 'Programada',
      description: 'Esta subasta comenzará próximamente'
    },
    ACTIVE: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      text: 'text-white',
      label: 'Activa',
      description: 'Disponible para pujar'
    },
    FINISHED: {
      bg: 'bg-gradient-to-r from-gray-600 to-gray-700',
      text: 'text-white',
      label: 'Finalizada',
      description: 'Esta subasta ha finalizado'
    }
  };

  const currentStatus = statusConfig[auction.status];

  const timeRemaining = () => {
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} días ${hours} horas`;
    if (hours > 0) return `${hours} horas ${minutes} minutos`;
    return `${minutes} minutos`;
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header con estado visible - Banner superior */}
      <div className={`${currentStatus.bg} ${currentStatus.text} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-bold">{currentStatus.label}</h2>
              <p className="text-sm opacity-90">{currentStatus.description}</p>
            </div>
          </div>
          
          {/* Tiempo restante (solo para activas) */}
          {auction.status === 'ACTIVE' && (
            <div className="text-right">
              <p className="text-sm opacity-90">Tiempo restante</p>
              <p className="text-2xl font-bold">{timeRemaining()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Imagen y título */}
          <div>
            {/* Imagen de la obra */}
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
              {auction.artwork.imageUrl && !imageError ? (
                <Image
                  src={auction.artwork.imageUrl}
                  alt={auction.artwork.title}
                  fill
                  className="object-contain p-4"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-24 h-24 text-gray-400" strokeWidth={1} />
                </div>
              )}
            </div>

            {/* Título y descripción */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {auction.artwork.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {auction.artwork.description}
            </p>
          </div>

          {/* Columna derecha - Precios y detalles */}
          <div className="space-y-6">
            {/* Tarjetas de precios */}
            <div className="grid grid-cols-2 gap-4">
              {/* Precio base */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  Precio base
                </p>
                <p className="text-3xl font-bold text-gray-700">
                  ${auction.startingPrice.toLocaleString()}
                </p>
              </div>

              {/* Precio actual */}
              <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-blue-600 mb-1 flex items-center">
                  Precio actual
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  ${currentPrice.toLocaleString()}
                </p>
                {auction.currentBid && (
                  <p className="text-xs text-blue-500 mt-1">
                    {auction.bids?.length} puja{auction.bids?.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Incremento mínimo */}
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-600 mb-1 flex items-center">
                    Incremento mínimo
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${auction.minimumIncrement.toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">Próxima oferta mínima</p>
                  <p className="text-xl font-semibold text-purple-700">
                    ${(currentPrice + auction.minimumIncrement).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                Fechas de la subasta
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">▶</span>
                  <div>
                    <p className="text-sm text-gray-500">Inicio</p>
                    <p className="font-medium text-gray-900">{startDate}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2">◼</span>
                  <div>
                    <p className="text-sm text-gray-500">Fin</p>
                    <p className="font-medium text-gray-900">{endDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional de estado */}
            {auction.status === 'SCHEDULED' && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-700 text-sm">
                  Esta subasta comenzará el {new Date(auction.startTime).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {auction.status === 'FINISHED' && auction.currentBid && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-700 text-sm flex items-center">
                  Subasta finalizada - Ganador con puja de ${auction.currentBid.amount}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}