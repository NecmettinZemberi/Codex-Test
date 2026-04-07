'use client';

export default function GlobalError() {
  return (
    <main className="container-base py-12">
      <div className="surface p-8">
        <h2 className="text-xl font-semibold text-white">Bir hata oluştu</h2>
        <p className="mt-2 text-slate-300">Lütfen sayfayı yenileyip tekrar deneyin.</p>
      </div>
    </main>
  );
}
