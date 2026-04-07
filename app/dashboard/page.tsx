import Link from 'next/link';
import { cookies } from 'next/headers';
import { PracticeBoard } from '@/components/dashboard/PracticeBoard';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockPracticeList } from '@/data/mockData';

export default function DashboardPage() {
  const cookieStore = cookies();
  const hasMockSession = cookieStore.get('mock_session')?.value === '1';

  if (!hasMockSession) {
    return (
      <main className="container-base py-12 sm:py-16">
        <EmptyState
          title="Çalışma alanı için giriş gerekli"
          description="Google ile giriş yaparak kişisel çalışma listenizi görüntüleyebilirsiniz."
        />
        <div className="mt-4">
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-slate-900"
          >
            Giriş Sayfasına Git
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-base py-12 sm:py-16">
      <h1 className="text-3xl font-semibold text-white">Çalışma Listem</h1>
      <p className="mt-3 text-slate-300">Parçaları sırala, durumlarını güncelle, ilerlemeni takip et.</p>

      <div className="mt-8">
        <PracticeBoard initialItems={mockPracticeList} />
      </div>
    </main>
  );
}
