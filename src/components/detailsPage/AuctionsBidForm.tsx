'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { auctionService } from '@/services/auction.service';
import { Auction } from '../../types/types';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { AxiosError } from 'axios';

interface AuctionBidFormProps {
  auction: Auction;
}

export function AuctionBidForm({ auction }: AuctionBidFormProps) {
  const { user, isAuthenticated, isVerified } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentPrice = auction.currentBid?.amount || auction.startingPrice;
  const minNextBid = currentPrice + auction.minimumIncrement;

  // Verificar si la subasta está activa
  const isActive = auction.status === 'ACTIVE';
  const now = new Date();
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);
  const isWithinTime = now >= startTime && now <= endTime;
  const canBid = isActive && isWithinTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isVerified) return;

    setLoading(true);
    setError('');

    try {
      const result = await auctionService.createBid({
        amount: Number(amount),
        auctionId: auction.id,
      });

      if (result) {
        router.refresh(); // Refrescar la página para mostrar la nueva puja
        setAmount('');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Error al realizar la puja');
      } else {
        setError('Error al realizar la puja');
      }
    } finally {
      setLoading(false);
    }
  };

  // Si la subasta no está activa
  if (!canBid) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {auction.status === 'FINISHED' ? 'Subasta finalizada' : 'Subasta no disponible'}
        </h3>
        <p className="text-gray-600">
          {auction.status === 'FINISHED' 
            ? 'Esta subasta ya ha finalizado.' 
            : 'Esta subasta aún no está activa o ha expirado.'}
        </p>
      </div>
    );
  }

  // Si el usuario no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Inicia sesión para pujar
        </h3>
        <p className="text-gray-600 mb-4">
          Necesitas estar autenticado para participar en esta subasta.
        </p>
        <Link
          href="/login"
          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  // Si el usuario no está verificado
  if (!isVerified) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cuenta no verificada
        </h3>
        <p className="text-gray-600">
          Necesitas verificar tu cuenta para poder pujar. 
          Contacta con un administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Realizar una puja
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad a pujar
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={minNextBid}
              step={auction.minimumIncrement}
              className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={minNextBid.toString()}
              required
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Mínimo requerido: ${minNextBid}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !amount || Number(amount) < minNextBid}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <LoaderCircle className="animate-spin" />
              Procesando...
            </span>
          ) : (
            'Realizar Puja'
          )}
        </button>
      </form>
    </div>
  );
}