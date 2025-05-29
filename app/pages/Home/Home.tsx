
import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile'; // Adjust path as needed
import { MobileHome, DesktopHome } from './components'; // Adjust path as needed

export function Home() {
    const isMobile = useIsMobile();

    // Show nothing during initial render to prevent hydration mismatch
    if (isMobile === undefined) {
        return null;
    }

    return isMobile ? <MobileHome /> : <DesktopHome />;
}