# AlertCard Component

Un composant réutilisable pour afficher des notifications, alertes, messages de confirmation et autres messages à l'utilisateur, avec le **même style exact** que la notification "Hors connexion" de la homescreen.

## Caractéristiques

- ✅ Style unifié basé sur la notification "Hors connexion"
- ✅ Utilise la couleur `blueSingle` pour tous les messages
- ✅ Support des icônes Lucide React Native
- ✅ Actions personnalisables
- ✅ Interface simple et cohérente
- ✅ Affichage conditionnel

## Installation

Le composant est déjà disponible dans `components/uxComponents/AlertCard.tsx`.

## Usage basique

```tsx
import { AlertCard } from '@/components/uxComponents/AlertCard';
import { WifiOff } from 'lucide-react-native';

export function MyComponent() {
  return (
    <AlertCard
      icon={WifiOff}
      title="Hors connexion"
      message="Vous êtes actuellement hors ligne."
      actionText="Réessayer"
      onAction={() => console.log('Retry')}
    />
  );
}
```

## Props

```typescript
interface AlertCardProps {
  icon?: LucideIcon;                 // Icône Lucide (ex: WifiOff, AlertCircle, CheckCircle)
  title?: string;                    // Titre du message
  message?: string;                  // Message détaillé
  actionText?: string;               // Texte du bouton d'action
  onAction?: () => void;             // Fonction appelée au clic du bouton
  visible?: boolean;                 // Affichage conditionnel (défaut: true)
  containerStyle?: ViewStyle;        // Style personnalisé du container
}
```

## Exemples

### Notification de connexion

```tsx
import { AlertCard } from '@/components/uxComponents/AlertCard';
import { WifiOff } from 'lucide-react-native';

<AlertCard
  icon={WifiOff}
  title="Hors connexion"
  message="Les tendances ne sont disponibles qu'en ligne."
/>
```

### Alerte de validation

```tsx
import { AlertCard } from '@/components/uxComponents/AlertCard';
import { AlertCircle } from 'lucide-react-native';

<AlertCard
  icon={AlertCircle}
  title="Composition vide"
  message="Ajoutez au moins une section avant de sauvegarder."
  actionText="Ajouter"
  onAction={addSection}
/>
```

### Confirmation de suppression

```tsx
import { AlertCard } from '@/components/uxComponents/AlertCard';
import { Trash2 } from 'lucide-react-native';

<AlertCard
  icon={Trash2}
  title="Supprimer?"
  message="Cette action est irréversible."
  actionText="Supprimer"
  onAction={handleDelete}
/>
```

### Message de succès

```tsx
import { AlertCard } from '@/components/uxComponents/AlertCard';
import { CheckCircle } from 'lucide-react-native';

<AlertCard
  icon={CheckCircle}
  title="Succès"
  message="Votre composition a été sauvegardée."
  actionText="Voir"
  onAction={handleView}
/>
```

## Affichage conditionnel

```tsx
const [showAlert, setShowAlert] = useState(true);

<AlertCard
  visible={showAlert}
  title="Message"
  message="Ceci peut être masqué."
  actionText="Fermer"
  onAction={() => setShowAlert(false)}
/>
```

## Styles appliqués

Le composant utilise **exactement** le même style que "Hors connexion":

- **Couleur** : `colors.blueSingle` (unique pour tous les messages)
- **Fond** : `${colors.blueSingle}20` (20% d'opacité)
- **Bordure** : 1px avec `colors.blueSingle`
- **Arrondissement** : 20px (arrondi complet)
- **Padding** : 6px vertical, 12px horizontal
- **Icône** : 16px de large
- **Spacing** : 8px entre éléments

## Notes

- Le composant utilise automatiquement le thème clair/sombre via `useThemeColors`
- La couleur `blueSingle` s'adapte aux thèmes clair et sombre
- Vous pouvez customiser le style container avec `containerStyle`
- Les icônes viennent de `lucide-react-native`

## Fichiers

- `components/uxComponents/AlertCard.tsx` - Composant principal
- `components/uxComponents/AlertCardExamples.tsx` - Exemples d'utilisation
- `components/uxComponents/ALERTCARD_README.md` - Cette documentation
