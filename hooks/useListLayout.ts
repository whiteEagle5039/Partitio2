import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { useResponsive } from './useResponsive';

export type ListLayout = {
  /** Style à passer à `contentContainerStyle` d'une FlatList / ScrollView. */
  contentContainerStyle: ViewStyle;
  /** Espace vertical entre deux éléments (via `gap`). */
  gap: number;
};

/**
 * Mise en page commune des listes : marges latérales adaptées à l'écran,
 * largeur bornée et centrée sur tablette, respiration en bas de liste.
 */
export function useListLayout(width: 'narrow' | 'wide' = 'narrow'): ListLayout {
  const { gutter, spacing, maxContentWidth, maxWideWidth } = useResponsive();

  return useMemo(
    () => ({
      gap: spacing.sm,
      contentContainerStyle: {
        width: '100%',
        alignSelf: 'center',
        maxWidth: width === 'wide' ? maxWideWidth : maxContentWidth,
        paddingHorizontal: gutter,
        paddingTop: spacing.sm,
        paddingBottom: spacing.xxxl,
        gap: spacing.sm,
      },
    }),
    [gutter, maxContentWidth, maxWideWidth, spacing, width],
  );
}
