import { useQuery } from '@tanstack/react-query';
import { auditService } from '@/services';
import type { Audit, ScanId } from '@/types';

export function useAudit(scanId: ScanId | undefined) {
  return useQuery<Audit, Error>({
    queryKey: ['audit', 'byScan', scanId],
    queryFn: async () => {
      if (!scanId) throw new Error('scanId required');
      const result = await auditService.getAuditByScan(scanId);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    enabled: Boolean(scanId),
  });
}
