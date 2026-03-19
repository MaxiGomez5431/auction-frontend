'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Componentes
import { PageHeader } from '@/components/admin/PageHeader';
import { FormField } from '@/components/admin/FormField';
import { ArtworkSelector } from '@/components/admin/ArtworkSelector';
import { FormActions } from '@/components/admin/FormActions';
import { InfoNotes } from '@/components/admin/InfoNotes';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { adminService } from '@/services/admin.service';

// Schema de validación incluido directamente en el componente
const auctionSchema = z.object({
  artworkId: z.string()
    .min(1, 'Selecciona una obra para subastar')
    .refine((val) => val !== '', {
      message: 'Debes seleccionar una obra',
    }),
  
  startingPrice: z.string()
    .min(1, 'El precio inicial es obligatorio')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El precio debe ser un número mayor a 0',
    }),
  
  minimumIncrement: z.string()
    .min(1, 'El incremento mínimo es obligatorio')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El incremento debe ser un número mayor a 0',
    }),
  
  startTime: z.string()
    .min(1, 'La fecha de inicio es obligatoria')
    .refine((val) => new Date(val) > new Date(), {
      message: 'La fecha de inicio debe ser posterior a ahora',
    }),
  
  endTime: z.string()
    .min(1, 'La fecha de fin es obligatoria')
    .refine((val) => new Date(val) > new Date(), {
      message: 'La fecha de fin debe ser posterior a ahora',
    }),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endTime"],
});

type AuctionFormValues = z.infer<typeof auctionSchema>;

const INFO_NOTES = [
  'Los campos marcados con * son obligatorios',
  'La subasta comenzará automáticamente en la fecha programada',
  'El incremento mínimo es el monto base que deben superar las pujas',
  'Una vez creada, la subasta aparecerá en el listado público',
  'Las fechas deben ser programadas con al menos 1 hora de diferencia',
];

export default function NewAuctionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AuctionFormValues>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      artworkId: '',
      startingPrice: '',
      minimumIncrement: '',
      startTime: '',
      endTime: '',
    },
  });

  const onSubmit = async (data: AuctionFormValues) => {
    setLoading(true);
    setError('');

    try {
      await adminService.createAuction({
        artworkId: parseInt(data.artworkId),
        startingPrice: parseFloat(data.startingPrice),
        minimumIncrement: parseFloat(data.minimumIncrement),
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      });
      
      router.push('/admin/auction');
      router.refresh();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Error al crear la subasta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <PageHeader
          title="Crear Nueva Subasta"
          description="Programa una nueva subasta para una obra de arte existente"
          backLink="/admin/auction"
          backText="Volver a subastas"
        />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            
            {/* Selector de obra - componente personalizado */}
            <ArtworkSelector
              error={errors.artworkId}
              disabled={loading}
              value={watch('artworkId')}
              onChange={(value) => setValue('artworkId', value)}
            />

            {/* Precios en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Precio inicial"
                name="startingPrice"
                register={register}
                error={errors.startingPrice}
                required
                disabled={loading}
                placeholder="1000.00"
                type="number"
                icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                helperText="Precio base de la subasta"
              />

              <FormField
                label="Incremento mínimo"
                name="minimumIncrement"
                register={register}
                error={errors.minimumIncrement}
                required
                disabled={loading}
                placeholder="100.00"
                type="number"
                icon={<TrendingUp className="w-4 h-4 text-gray-400" />}
                helperText="Monto mínimo para superar una puja"
              />
            </div>

            {/* Fechas en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Fecha y hora de inicio"
                name="startTime"
                register={register}
                error={errors.startTime}
                required
                disabled={loading}
                type="datetime-local"
                icon={<Calendar className="w-4 h-4 text-gray-400" />}
                helperText="La subasta comenzará automáticamente a esta hora"
              />

              <FormField
                label="Fecha y hora de fin"
                name="endTime"
                register={register}
                error={errors.endTime}
                required
                disabled={loading}
                type="datetime-local"
                icon={<Calendar className="w-4 h-4 text-gray-400" />}
                helperText="La subasta finalizará a esta hora"
              />
            </div>

            {/* Mensaje de error */}
            <ErrorMessage message={error} />

            {/* Botones de acción */}
            <FormActions
              cancelLink="/admin/auction"
              submitText="Crear Subasta"
              loading={loading}
              loadingText="Creando subasta..."
            />
          </form>
        </div>

        {/* Información adicional */}
        <InfoNotes notes={INFO_NOTES} />

        {/* Enlace rápido para crear obra si no hay */}
        <div className="mt-4 text-center">
          <Link
            href="/admin/artwork/new"
            className="text-sm text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center"
          >
            ¿No encuentras la obra? Crea una nueva obra primero
          </Link>
        </div>
      </div>
    </div>
  );
}