// src/components/admin/FormActions.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface FormActionsProps {
  cancelLink: string;
  cancelText?: string;
  submitText?: string;
  loading?: boolean;
  loadingText?: string;
  onSubmit?: () => void;
  children?: ReactNode;
}

export function FormActions({
  cancelLink,
  cancelText = 'Cancelar',
  submitText = 'Guardar',
  loading = false,
  loadingText = 'Guardando...',
  onSubmit,
  children
}: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
      {children ? children : (
        <>
          <Link
            href={cancelLink}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            {cancelText}
          </Link>
          <button
            type="submit"
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                {loadingText}
              </>
            ) : (
              submitText
            )}
          </button>
        </>
      )}
    </div>
  );
}