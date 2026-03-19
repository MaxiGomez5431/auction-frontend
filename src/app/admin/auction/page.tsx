'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Auction } from '@/types/types';
import Link from 'next/link';
import { Plus } from 'lucide-react';

// Componentes
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/admin/auction/EmptyState';
import { AuctionCard } from '@/components/admin/auction/AuctionCard';

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finishingId, setFinishingId] = useState<number | null>(null);

  useEffect(() => {
    loadAuctions();
  }, []);
  
  const loadAuctions = async () => {
    try {
      const data = await adminService.getAuctions();
      setAuctions(data);
    } catch (err) {
      setError('Error al cargar las subastas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const finishAuction = async (auctionId: number) => {
    setFinishingId(auctionId);
    try {
      await adminService.finishAuction(auctionId);
      setAuctions(auctions.map(auction =>
        auction.id === auctionId
          ? { ...auction, status: 'FINISHED' as const }
          : auction
      ));
    } catch (err) {
      console.error('Error finishing auction:', err);
    } finally {
      setFinishingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header con título y botón */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subastas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona las subastas activas y programadas
          </p>
        </div>
        <Link
          href="/admin/auction/new"
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Subasta
        </Link>
      </div>

      <ErrorMessage message={error} />

      {auctions.length === 0 ? (
        <EmptyState
          title="No hay subastas registradas"
          description="Comienza creando la primera subasta"
          buttonText="Crear Primera Subasta"
          buttonLink="/admin/auctions/new"
        />
      ) : (
        <div className="space-y-4">
          {auctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onFinish={finishAuction}
              isFinishing={finishingId === auction.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}