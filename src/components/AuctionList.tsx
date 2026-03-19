// src/components/auctions/AuctionList.tsx
'use client';

import { useState, useMemo } from 'react';
import { Layers } from 'lucide-react';
import { Auction } from '../types/types';
import { AuctionCard } from './AuctionCard';
import { AuctionFilters } from './AuctionFilters';

interface AuctionListProps {
  auctions: Auction[];
}

export function AuctionList({ auctions }: AuctionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filtrar subastas según búsqueda y estado
  const filteredAuctions = useMemo(() => {
    return auctions.filter((auction) => {
      // Filtro por nombre de obra
      const matchesSearch = auction.artwork.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filtro por estado
      const matchesStatus = statusFilter === 'ALL' || auction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [auctions, searchTerm, statusFilter]);

  // Contar resultados para mostrar
  const resultsCount = filteredAuctions.length;
  const totalCount = auctions.length;

  if (!auctions || auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <Layers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay subastas disponibles
        </h3>
        <p className="text-gray-600">
          Vuelve más tarde para ver nuevas obras de arte.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros */}
      <AuctionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Contador de resultados (solo si hay filtros activos) */}
      {(searchTerm || statusFilter !== 'ALL') && (
        <div className="mb-4 text-sm text-gray-500">
          Mostrando {resultsCount} de {totalCount} subastas
          {searchTerm && ` que contienen "${searchTerm}"`}
          {statusFilter !== 'ALL' && ` con estado ${statusFilter.toLowerCase()}`}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
            className="ml-2 text-purple-600 hover:text-purple-700 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grid de subastas */}
      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Layers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron subastas
          </h3>
          <p className="text-gray-600">
            Intenta con otros términos de búsqueda o filtros
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}