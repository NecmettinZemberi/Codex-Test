type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="surface-alt p-8 text-center">
      <h3 className="font-display text-3xl font-semibold text-text">{title}</h3>
      <p className="mt-3 text-muted">{description}</p>
    </div>
  );
}
