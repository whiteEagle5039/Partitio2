import { useFonts } from 'expo-font';

/**
 * Polices de l'application, déclarées une seule fois.
 *
 * `useFonts` met en cache le chargement : appeler ce hook depuis la racine
 * précharge tout, et les appels suivants (dans `TextComponent`) sont immédiats.
 */
export const appFonts = {
  'Styrene-Regular': require('../assets/fonts/StyreneB-Regular-Trial-BF63f6cbe9db1d5.otf'),
  'Styrene-Medium': require('../assets/fonts/StyreneB-Medium-Trial-BF63f6cc85760c2.otf'),
  'Styrene-Bold': require('../assets/fonts/StyreneB-Bold-Trial-BF63f6cbe9f13bb.otf'),
  'Tiempos-Regular': require('../assets/fonts/TestTiemposText-Regular-BF66457a50cd521.otf'),
  'Tiempos-Medium': require('../assets/fonts/TestTiemposText-Medium-BF66457a508489a.otf'),
  'Tiempos-Bold': require('../assets/fonts/TestTiemposText-Bold-BF66457a4f03c40.otf'),
};

export function useAppFonts(): boolean {
  const [loaded] = useFonts(appFonts);
  return loaded;
}
