# StatusAlert Component

Un composant d'alerte flexible et réutilisable qui combine les styles d'AlertCard avec une version centrée de la card "Connexion requise" de la page de recherche.

## Caractéristiques

- **Mode Inline** : Style compact comme AlertCard (défaut)
- **Mode Centré** : Style de card centrée comme "Connexion requise" (avec `centered={true}`)
- **Personnalisable** : Couleur d'icône, transparence du fond
- **Composants d'alias** : `CenteredStatusAlert` et `InlineStatusAlert` pour utilisation simplifiée
- **TypeScript** : Typé complètement

## Utilisation

### Mode Inline (par défaut)

```tsx
import { StatusAlert } from '@/components/uxComponents/StatusAlert';
import { WifiOff } from 'lucide-react-native';

<StatusAlert 
  icon={WifiOff}
  title="Hors ligne"
  message="Vérifiez votre connexion"
  actionText="Réessayer"
  onAction={() => console.log('Action')}
  visible={true}
/>
```

### Mode Centré

```tsx
import { StatusAlert } from '@/components/uxComponents/StatusAlert';
import { WifiOff } from 'lucide-react-native';

<StatusAlert 
  icon={WifiOff}
  title="Connexion requise"
  message="La recherche n'est disponible qu'en ligne. Vérifiez votre connexion internet."
  actionText="Réessayer"
  onAction={() => setOnline(true)}
  centered={true}
  visible={true}
/>
```

### Utiliser les alias

```tsx
import { CenteredStatusAlert, InlineStatusAlert } from '@/components/uxComponents/StatusAlert';
import { Heart } from 'lucide-react-native';

// Mode centré
<CenteredStatusAlert 
  icon={Heart}
  title="Aucun favori"
  message="Vous n'avez pas encore d'articles favoris."
  actionText="Explorer"
  onAction={() => router.push('/search')}
/>

// Mode inline
<InlineStatusAlert 
  icon={Heart}
  title="Stock faible"
  message="Articles limitées disponibles"
/>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| icon | LucideIcon | undefined | Icône Lucide à afficher |
| title | string | undefined | Titre principal |
| message | string | undefined | Message descriptif |
| actionText | string | undefined | Texte du bouton d'action |
| onAction | () => void | undefined | Fonction appelée quand on appuie sur le bouton |
| visible | boolean | true | Afficher ou masquer l'alerte |
| centered | boolean | false | Utiliser le mode centré (true) ou inline (false) |
| containerStyle | ViewStyle | undefined | Styles personnalisés supplémentaires |
| iconColor | string | blueSingle | Couleur de l'icône |
| iconBackgroundAlpha | number | 0.1 | Opacité du fond d'icône (0-1) |

## Exemples de couleurs d'icône

```tsx
import { useThemeColors } from '@/hooks/useThemeColors';

const colors = useThemeColors();

// Utiliser différentes couleurs
<StatusAlert 
  icon={AlertCircle} 
  iconColor={colors.destructive}
  title="Erreur"
  message="Une erreur est survenue"
  centered
/>

<StatusAlert 
  icon={CheckCircle} 
  iconColor={colors.success}
  title="Succès"
  message="Action complétée"
  centered
/>
```

## Styles

- **Mode Inline** : Border, padding compact, disposition horizontale
- **Mode Centré** : Card centrée, icône en cercle, disposition verticale, bouton prominent

## Comparaison avec AlertCard

| Aspect | AlertCard | StatusAlert |
|--------|-----------|------------|
| Mode disposition | Inline seulement | Inline + Centré |
| Taille | Compacte | Adaptée au mode |
| Icône | Petite (16px) | 16px (inline), 40px (centré) |
| Utilité | Alertes rapides | Alertes + États importants |
