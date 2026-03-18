import { Suspense } from 'react';
import { auctionService } from '../../../services/auction.service';
import { AuctionDetails } from '../../../components/detailsPage/AuctionDetails';
import { AuctionBidForm } from '../../../components/detailsPage/AuctionsBidForm';
import { AuctionBidsList } from '../../../components/detailsPage/AuctionBidsList';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AuctionPage({ params }: PageProps) {

    const { id } = await params;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return <div>ID inválido</div>;
    }

    const auction = await auctionService.getById(parsedId);
    console.log('Datos de la subasta:', auction);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<div>Cargando detalles...</div>}>
              <AuctionDetails auction={auction} />
            </Suspense>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Suspense fallback={<div>Cargando formulario...</div>}>
              <AuctionBidForm auction={auction} />
            </Suspense>
            
            <Suspense fallback={<div>Cargando pujas...</div>}>
              <AuctionBidsList auction={auction} />
            </Suspense>
          </div>
        </div>
      </div>
    );
}