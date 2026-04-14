import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tavrın Temelleri | BozlakLab',
  description:
    'Neşet Ertaş tavrıyla saz çalışmak için söz, sağ el, sol el, saz seçimi ve akort prensipleri.',
};

const principleCards = [
  {
    title: 'Sözden Çalmak',
    body:
      'Neşet Ertaş tavrında saz, parçanın sözünü takip eder. Bu yüzden her parçaya başlamadan önce en azından ilk kıtayı bilmek, vurguları ve nefes yerlerini anlamak gerekir.',
  },
  {
    title: 'İki Elin Gücü',
    body:
      'Sol elde sap üzerinde giden gelen baskı kuvvetli olmalı; sağ elde mızrap kısa tutulmalı. Bu sayede plastik sesi azalır ve telden net, tok bir tını alınır.',
  },
  {
    title: 'Söyleyerek Çalışmak',
    body:
      'Sadece icra yeterli değildir. Çalan kişinin bir yandan söylemesi tavra hakim olmasını, sözdeki detayları yakalamasını ve saz cümlesini doğru yere oturtmasını kolaylaştırır.',
  },
  {
    title: 'Özü Korumak',
    body:
      'Bu tavır kısa sürede oturmayabilir; uzun yıllar sürmesi normaldir. Parçalar kolaylaştırılırken bile özü bozulmadan, Neşet Ertaş tavrını koruma hedefiyle çalışılmalıdır.',
  },
];

const tunings = ['LA(A) - RE(D) - SOL(G)', 'SOL(G) - DO(C) - FA(F)', 'FA#(F#) - Sİ(B) - Mİ(E)'];

export default function TavrinTemelleriPage() {
  return (
    <main className="container-base py-12 sm:py-16">
      <section className="surface relative overflow-hidden p-8 sm:p-12">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%),radial-gradient(circle_at_top_right,rgba(143,107,59,0.18),transparent_34%)]" />
        <div className="relative max-w-4xl">
          <p className="eyebrow text-accent">Neşet Ertaş tavrı</p>
          <h1 className="page-title mt-5">Tavrın Temelleri</h1>
          <p className="mt-6 text-base leading-8 text-stone-200">
            Bu sayfa, bozlak tavrıyla saz çalışırken önce neye dikkat edileceğini toparlar:
            sözün anlamı, iki elin gücü, doğru tını, uygun saz seçimi ve parçanın özünü koruma.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/yeni-baslayanlar" className="button-primary">
              Yeni Başlayanlar rotasına git
            </Link>
            <Link href="/turkuler" className="button-secondary">
              Türkü arşivini aç
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {principleCards.map((card) => (
          <article key={card.title} className="surface-alt p-6">
            <h2 className="font-display text-3xl font-semibold text-text">{card.title}</h2>
            <p className="mt-4 text-sm leading-7 text-stone-300">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <article className="surface p-6 sm:p-8">
          <p className="eyebrow text-accent">Saz seçimi</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text">Tekne, kapak ve tını</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-300">
            <p>
              Tavra en uygun sazlar genellikle 44-47 tekne ölçülerindedir. Bu aralık hem tok tını
              hem de bozlak tavrındaki güçlü baskı için dengeli bir zemin verir.
            </p>
            <p>
              Kapak köknar olduğunda daha tok ve oturaklı bir ses alınır. Bu tavırda köknar kapak,
              tınıyı daha iyi taşıdığı için güçlü bir tercihtir.
            </p>
            <p>
              Teknenin yaprak ya da oyma olması belirleyici değildir; önemli olan sazın tel boyu,
              kapak tepkisi ve icracının ses aralığıyla uyumlu olmasıdır.
            </p>
          </div>
        </article>

        <article className="surface-alt p-6 sm:p-8">
          <p className="eyebrow text-accent">Akort</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text">Alttan üste düzen</h2>
          <div className="mt-5 grid gap-3">
            {tunings.map((tuning) => (
              <p
                key={tuning}
                className="rounded-lg border border-border bg-surface px-4 py-3 font-medium text-stone-100"
              >
                {tuning}
              </p>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-stone-300">
            Akort önce tel boyuna, eşik ile üst eşik arasındaki uzunluğa ve tekne ölçüsüne göre
            düşünülmeli; sonrasında icracının ses aralığına göre oturtulmalıdır.
          </p>
        </article>
      </section>
    </main>
  );
}
