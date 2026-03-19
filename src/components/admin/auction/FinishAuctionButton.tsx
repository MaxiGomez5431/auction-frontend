// src/components/admin/auctions/FinishAuctionButton.tsx
'use client';

import { XCircle } from 'lucide-react';

interface FinishAuctionButtonProps {
  auctionId: number;
  onFinish: (id: number) => Promise<void>;
  isFinishing: boolean;
}

export function FinishAuctionButton({ auctionId, onFinish, isFinishing }: FinishAuctionButtonProps) {
  return (
    <button
      onClick={() => onFinish(auctionId)}
      disabled={isFinishing}
      className="w-full lg:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium flex items-center justify-center transition-colors shadow-sm hover:shadow"
    >
      {isFinishing ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          Finalizando...
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 mr-2" />
          Marcar como Finalizada
        </>
      )}
    </button>
  );
}