import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Newsletter, Language } from '../backend';

export function useNewsletters() {
  const { actor, isFetching } = useActor();

  return useQuery<Newsletter[]>({
    queryKey: ['newsletters'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllNewsletters();
      } catch (error) {
        console.error('Error fetching newsletters:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useNewsletter(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Newsletter>({
    queryKey: ['newsletter', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.getNewsletter(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTranslation(language: Language, key: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['translation', language, key],
    queryFn: async () => {
      if (!actor) return '';
      try {
        return await actor.getTranslation(language, key);
      } catch (error) {
        console.error('Error fetching translation:', error);
        return '';
      }
    },
    enabled: !!actor && !isFetching && !!key,
    staleTime: 1000 * 60 * 10, // 10 minutes for translations
  });
}
