export default function AboutPage() {
  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface relative overflow-hidden p-8 sm:p-12">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%),radial-gradient(circle_at_top_right,rgba(143,107,59,0.16),transparent_32%)]" />

        <div className="relative">
          <p className="eyebrow text-accent">Hakkımızda</p>
          <h1 className="page-title mt-5 max-w-4xl">
            Bozlak ve halk müziği birikimini dijitalde daha erişilebilir kılmak için kurulan bir
            çalışma alanı.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-200">
            BozlakLab; repertuvarı, sanatçı hafızasını ve çalışma disiplinini aynı yerde buluşturan
            yaşayan bir arşiv fikriyle ilerliyor. Amaç, hem düzenli çalışan müzisyenler için sade
            bir başvuru alanı sunmak hem de kültürel belleğin güncel araçlarla korunmasına katkı
            sağlamak.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        <article className="surface p-6">
          <p className="eyebrow">Amaç</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text">Sitenin odağı</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Platform; bozlak geleneği ve halk müziği repertuvarı etrafında dağınık duran bilgiyi
            daha düzenli, daha takip edilebilir ve daha çalışılabilir bir yapıya taşımayı hedefler.
          </p>
        </article>

        <article className="surface p-6">
          <p className="eyebrow">Erişilebilirlik</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text">Dijital katkı</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Kültürel mirasın devam etmesi için dijital arşivleme ve erişilebilirlik kritik görülür.
            Sanatçıları, türküleri ve çalışma akışlarını daha görünür kılan yapı bu devamlılığa
            küçük ama kalıcı bir katkı sunmayı amaçlar.
          </p>
        </article>

        <article className="surface p-6">
          <p className="eyebrow">Süreklilik</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text">
            Gelişmeye devam ediyor
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            BozlakLab tamamlanmış bir vitrin değil; repertuvarın genişlediği, içeriklerin
            derinleştiği ve çalışma araçlarının adım adım iyileştirildiği bir platform olarak
            geliştirilmeye devam ediyor.
          </p>
        </article>
      </section>

      <section className="surface-alt mt-10 grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)]">
        <div>
          <p className="eyebrow text-accent">Kurucu notu</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text">Neden bu alan var?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">
            Geleneksel müzik üretimi yalnızca kayıtlarla değil, tekrar eden çalışma, aktarım ve
            hafıza ile yaşıyor. Bu nedenle platform; sadece bir listeleme yüzeyi değil, zamanla
            büyüyen bir referans ve çalışma zemini olarak düşünülüyor.
          </p>
        </div>

        <aside className="rounded-2xl border border-border bg-surface px-5 py-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">Not</p>
          <p className="mt-4 font-display text-3xl font-semibold text-text">BT tarafından kurulmuştur.</p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Platform, kültürel belleği daha erişilebilir bir dijital zeminde sürdürme niyetiyle
            şekillenmektedir.
          </p>
        </aside>
      </section>
    </main>
  );
}
