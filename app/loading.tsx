import { BaglamaStringLoader } from '@/components/ui/BaglamaStringLoader';

export default function GlobalLoading() {
  return (
    <main className="container-base py-12">
      <div className="surface flex justify-center p-8">
        <BaglamaStringLoader />
      </div>
    </main>
  );
}
