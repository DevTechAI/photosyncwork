
interface EmptyStateProps {
  type: 'selected' | 'favorites';
}

export function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <p className="text-muted-foreground">
        {type === 'selected' ? 'No photos selected yet.' : 'No favorites added yet.'}
      </p>
      <p className="text-sm">
        {type === 'selected' 
          ? 'View all photos and click to select images for final delivery.' 
          : 'Click the heart icon on any photo to add it to your favorites.'}
      </p>
    </div>
  );
}
