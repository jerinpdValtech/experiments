import dynamic from 'next/dynamic';

const CabanaMap = dynamic(() => import('@/components/CabanaMap'), { ssr: false });

export default function CabanaPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Select Your Cabana</h1>
      <CabanaMap />
    </div>
  );
}