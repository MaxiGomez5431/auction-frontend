import { auctionService } from '@/services/auction.service';
import { AuctionList } from '../components/AuctionList';
import { Suspense } from 'react';

export const revalidate = 60;

async function getAuctions() {
  try {
    // En servidor, podemos llamar directamente al backend
    const auctions = await auctionService.getAll();
    return auctions;
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return []; // Devolver array vacío en caso de error
  }
}

function LoadingComponent() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default async function HomePage() {
  const auctions = await getAuctions();

  return (
    <div className="space-y-8">
      {/* Título principal */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🎨 Subastas de Arte
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre y puja por obras de arte únicas de artistas emergentes y establecidos
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Subastas Disponibles
        </h2>
        
        <Suspense fallback={<LoadingComponent />}>
          <AuctionList auctions={auctions} />
        </Suspense>
      </section>
    </div>
  );
}