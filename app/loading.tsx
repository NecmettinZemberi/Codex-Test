import { BaglamaStringLoader } from '@/components/ui/BaglamaStringLoader';

export default function GlobalLoading() {
  return (
    <main className="flex min-h-[42vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full">
        <BaglamaStringLoader />
      </div>
    </main>
  );
}
