import { useState } from 'react';
import { BootScreen } from '@/components/linux/BootScreen';
import { Desktop } from '@/components/linux/Desktop';

const Index = () => {
  const [isBooted, setIsBooted] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden">
      {!isBooted ? (
        <BootScreen onBootComplete={() => setIsBooted(true)} />
      ) : (
        <Desktop />
      )}
    </div>
  );
};

export default Index;
