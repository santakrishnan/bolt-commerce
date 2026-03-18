import { useEffect, useMemo, useState } from "react";
import type { DealerInfo, DealerNotes } from "~/lib/data/dealer/dealer-data";
import { sampleDealerNotes } from "~/lib/data/dealer/dealer-data";
import { getDealerDetailsFromApi } from "~/services/vdp-api";

/**
 * useDealerData
 *
 * Fetches dealer details from the Search API dealer endpoint using VIN.
 * Falls back to `sampleDealerNotes` if the request fails.
 */
export function useDealerData(vin: string): {
  dealerInfo: DealerInfo;
  dealerNotes: DealerNotes;
  isLoading: boolean;
} {
  const [dealerNotes, setDealerNotes] = useState<DealerNotes>(sampleDealerNotes);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!vin) {
      setDealerNotes(sampleDealerNotes);
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);
    getDealerDetailsFromApi(vin)
      .then((data) => {
        if (!cancelled) {
          setDealerNotes(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDealerNotes(sampleDealerNotes);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [vin]);

  return useMemo(
    () => ({ dealerInfo: dealerNotes.dealer, dealerNotes, isLoading }),
    [dealerNotes, isLoading]
  );
}
