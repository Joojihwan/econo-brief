import { useQuery } from '@tanstack/react-query';
import { fetchFearGreed } from '../services/fearGreedApi';

export type { FearGreedResult } from '../services/fearGreedApi';

export function useFearGreed() {
  return useQuery({
    queryKey: ['fear-greed'],
    queryFn:  fetchFearGreed,
    staleTime: 1000 * 60 * 60, // 1시간 캐시 (지수 업데이트 주기 고려)
  });
}
