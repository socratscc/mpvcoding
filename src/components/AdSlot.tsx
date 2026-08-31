import { ADS_ENABLED } from '@/config';

export interface AdSlotProps {
  /** Logical slot id, used in the data attribute for future wiring. */
  slot: string;
  className?: string;
}

/**
 * Ad placeholder. Renders nothing while ADS_ENABLED is false so there is no
 * layout shift when ads are off. When enabled it renders a container a real
 * ad script could target (script loading still handled outside this component).
 */
export default function AdSlot({ slot, className }: AdSlotProps) {
  if (!ADS_ENABLED) return null;
  return (
    <div className={className} data-ad-slot={slot} aria-hidden="true">
      {/* TODO: AdSense unit for slot: {slot} */}
    </div>
  );
}
