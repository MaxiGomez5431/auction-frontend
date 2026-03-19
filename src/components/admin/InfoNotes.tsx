// src/components/admin/InfoNotes.tsx
interface InfoNotesProps {
  notes: string[];
  title?: string;
}

export function InfoNotes({ notes, title = '📝 Notas importantes:' }: InfoNotesProps) {
  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
}