'use client';

export default function GlobalError() {
  return (
    <main className="container-base py-12">
      <div className="surface p-8">
        <h2 className="font-display text-3xl font-semibold text-text">Bir hata oluştu</h2>
        <p className="mt-3 text-muted">Lütfen sayfayı yenileyip tekrar deneyin.</p>
      </div>
    </main>
  );
}
