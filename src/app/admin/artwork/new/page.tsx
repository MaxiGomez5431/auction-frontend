// src/app/admin/artworks/new/page.tsx (versión simplificada)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminService } from '@/services/admin.service';
import { Image as ImageIcon } from 'lucide-react';
import { AxiosError } from 'axios';

// Componentes
import { PageHeader } from '../../../../components/admin/PageHeader';
import { FormField } from '../../../../components/admin/FormField';
import { ImagePreview } from '../../../../components/admin/ImagePreview';
import { UrlExamples } from '../../../../components/admin/UrlExamples';
import { FormActions } from '../../../../components/admin/FormActions';
import { InfoNotes } from '../../../../components/admin/InfoNotes';
import { ErrorMessage } from '../../../../components/ui/ErrorMessage';

const artworkSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder los 1000 caracteres'),
  imageUrl: z.string()
    .min(1, 'La URL de la imagen es obligatoria')
    .url('Debe ser una URL válida (http:// o https://)'),
});

type ArtworkForm = z.infer<typeof artworkSchema>;

const IMAGE_EXAMPLES = [
  'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
];

const INFO_NOTES = [
  'Los campos marcados con * son obligatorios',
  'La imagen debe ser accesible públicamente (URL válida)',
  'Una vez creada la obra, podrás asociarla a una subasta',
];

export default function NewArtworkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ArtworkForm>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
    },
  });

  const imageUrl = watch('imageUrl');

  // Actualizar preview cuando cambia la URL
  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
      setImageError(false);
    } else {
      setImagePreview(null);
    }
  }, [imageUrl]);

  const clearImagePreview = () => {
    setValue('imageUrl', '');
    setImagePreview(null);
    setImageError(false);
  };

  const onSubmit = async (data: ArtworkForm) => {
    setLoading(true);
    setError('');

    try {
      await adminService.createArtwork(data);
      router.push('/admin/artwork');
      router.refresh();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Error al crear la obra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <PageHeader
          title="Crear Nueva Obra"
          description="Completa los detalles de la obra de arte para agregarla al catálogo"
          backLink="/admin/artwork"
          backText="Volver a obras"
        />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            
            {imagePreview && !imageError && (
              <ImagePreview
                src={imagePreview}
                onClear={clearImagePreview}
                onError={() => setImageError(true)}
              />
            )}

            <FormField
              label="Título de la obra"
              name="title"
              register={register}
              error={errors.title}
              required
              disabled={loading}
              placeholder="Ej: Noche Estrellada, Los Girasoles, etc."
              helperText="Máximo 100 caracteres"
            />

            <FormField
              label="Descripción"
              name="description"
              register={register}
              error={errors.description}
              required
              disabled={loading}
              placeholder="Describe la obra, técnica, dimensiones, año, etc."
              rows={5}
              helperText="Mínimo 10 caracteres, máximo 1000"
            />

            <FormField
              label="URL de la imagen"
              name="imageUrl"
              register={register}
              error={errors.imageUrl}
              required
              disabled={loading}
              placeholder="https://ejemplo.com/imagen.jpg"
              type="url"
              icon={<ImageIcon className="w-4 h-4 text-gray-400" />}
              helperText="Ingresa una URL válida de una imagen (http:// o https://)"
            />

            <UrlExamples examples={IMAGE_EXAMPLES} />

            <ErrorMessage message={error} />

            <FormActions
              cancelLink="/admin/artwork"
              submitText="Crear Obra"
              loading={loading}
              loadingText="Creando obra..."
            />
          </form>
        </div>

        <InfoNotes notes={INFO_NOTES} />
      </div>
    </div>
  );
}