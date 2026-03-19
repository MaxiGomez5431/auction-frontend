// src/components/auctions/AuctionBidsList.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Auction } from '@/types/types';
import { Star, User } from 'lucide-react';

interface AuctionBidsListProps {
  auction: Auction; // El auction ya incluye bids[]
}

export function AuctionBidsList({ auction }: AuctionBidsListProps) {
  const { user } = useAuth();
  const bids = auction.bids || []; // Usar bids del auction directamente

  // Ordenar bids por monto descendente (mayor primero)
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Historial de Pujas
        </h3>
        {bids.length > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {bids.length} puja{bids.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">
            No hay pujas aún
          </p>
          <p className="text-gray-400 text-sm">
            ¡Sé el primero en realizar una oferta!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedBids.map((bid, index) => {
            const isCurrentUser = user?.id === bid.userId;
            const isHighest = index === 0;
            
            return (
              <div
                key={bid.id}
                className={`relative border-b last:border-0 border-gray-500 pb-3 transition-all ${
                  isHighest ? ' bg-yellow-50 -mx-2 px-2' : ''
                }`}
              >
                {/* Indicador de puja más alta */}
                {isHighest && (
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full"></div>
                )}
                
                <div className="flex justify-between items-start ml-1">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <p className={`font-bold ${isHighest ? 'text-yellow-600' : 'text-gray-900'}`}>
                        ${bid.amount.toLocaleString()}
                      </p>
                      {isHighest && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Puja más alta
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          <User className="w-3 h-3 mr-1" />
                          Tú
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(bid.createdAt).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resumen de pujas */}
      {bids.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Puja más alta</p>
              <p className="font-bold text-gray-900">
                ${Math.max(...bids.map(b => b.amount)).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total de pujas</p>
              <p className="font-bold text-gray-900">{bids.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}