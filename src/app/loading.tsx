import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full flex flex-row items-center justify-center flex-1 h-full">
      <Loader2 className="animate-spin mr-2" />
      <p className="text-lg">Loading...</p>
    </div>
  );
}
