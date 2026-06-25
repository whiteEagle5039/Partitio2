# AlertCard Component

Un composant réutilisable pour afficher des notifications, alertes, messages de confirmation et autres messages à l'utilisateur, basé sur le style de la notification "Hors connexion" de la homescreen.

## Caractéristiques

- ✅ 4 types d'alertes prédéfinis : `info`, `warning`, `error`, `success`
- ✅ Couleurs adaptées au thème intelligemment
- ✅ Support des icônes Lucide
- ✅ Actions personnalisables
- ✅ Flexibilité maximale avec `customColor`
- ✅ Espacement et styles cohérents

## Installation

Le composant est déjà disponible dans `components/uxComponents/AlertCard.tsx`.

## Usage basique

### Alert Info (défaut)

```tsx
import { InfoAlert } from '@/components/uxComponents/AlertCard';
import { WifiOff } from 'lucide-react-native';

export function MyComponent() {
  return (
    <InfoAlert
      icon={WifiOff}
      title="Hors connexion"
      message="Vous êtes actuellement hors ligne."
      actionText="Réessayer"
      onAction={() => console.log('Retry')}
    />
  );
}
```

### Alert Warning

```tsx
import { WarningAlert } from '@/components/uxComponents/AlertCard';
import { AlertCircle } from 'lucide-react-native';

<WarningAlert
  icon={AlertCircle}
  title="Attention"
  message="Assurez-vous que votre composition contient au moins une section."
  actionText="Corriger"
  onAction={handleCorrection}
/>
```

### Alert Error

```tsx
import { ErrorAlert } from '@/components/uxComponents/AlertCard';
import { AlertCircle } from 'lucide-react-native';

<ErrorAlert
  icon={AlertCircle}
  title="Erreur"
  message="Une erreur est survenue lors de la sauvegarde."
  actionText="Réessayer"
  onAction={handleRetry}
/>
```

### Alert Success

```tsx
import { SuccessAlert } from '@/components/uxComponents/AlertCard';
import { CheckCircle } from 'lucide-react-native';

<SuccessAlert
  icon={CheckCircle}
  title="Succès"
  message="Votre composition a été sauvegardée."
  actionText="Voir"
  onAction={handleView}
/>
```

## Props

```typescript
interface AlertCardProps {
  type?: AlertType;                  // 'info' | 'warning' | 'error' | 'success' (défaut: 'info')
  icon?: LucideIcon;                 // Icône Lucide (ex: WifiOff, AlertCircle, CheckCircle)
  title?: string;                    // Titre du message
  message?: string;                  // Message détaillé
  actionText?: string;               // Texte du bouton d'action
  onAction?: () => void;             // Fonction appelée au clic du bouton
  onClose?: () => void;              // Fonction appelée à la fermeture
  visible?: boolean;                 // Affichage conditionnel (défaut: true)
  containerStyle?: ViewStyle;        // Style personnalisé du container
  customColor?: string;              // Couleur personnalisée (ex: '#8B5CF6')
}
```

## Types d'alertes prédéfinis

Le composant exporte 4 variantes prédéfinies :

- `InfoAlert` - Pour les messages informatifs (couleur bleue)
- `WarningAlert` - Pour les avertissements (couleur orange)
- `ErrorAlert` - Pour les erreurs (couleur rouge)
- `SuccessAlert` - Pour les succès (couleur verte)

Utiliser le composant générique `AlertCard` avec la prop `type` pour plus de flexibilité.

## Exemples avancés

### Affichage conditionnel

```tsx
const [showAlert, setShowAlert] = useState(true);

<InfoAlert
  visible={showAlert}
  title="Message"
  message="Ceci peut être masqué."
  actionText="Fermer"
  onAction={() => setShowAlert(false)}
/>
```

### Couleur personnalisée

```tsx
<AlertCard
  type="info"
  icon={Info}
  title="Message personnalisé"
  message="Avec une couleur unique."
  customColor="#8B5CF6" // Purple
  actionText="OK"
  onAction={() => console.log('ok')}
/>
```

### Sans actionText

```tsx
<InfoAlert
  icon={WifiOff}
  title="Hors connexion"
  message="Vous êtes hors ligne. Les fonctionnalités seront limitées."
/>
```

### Titre uniquement

```tsx
<SuccessAlert
  icon={CheckCircle}
  title="Opération complétée"
/>
```

### Dans une ScrollView

```tsx
<ScrollView>
  <InfoAlert
    icon={WifiOff}
    title="Hors connexion"
    message="Certaines fonctionnalités ne sont pas disponibles."
  />
  
  <View style={{ marginTop: 20 }}>
    {/* Votre contenu */}
  </View>
</ScrollView>
```

## Intégration dans homescreen

Pour remplacer le composant `ConnectionStatus` par `AlertCard` dans `homescreen.tsx` :

**Avant** :
```tsx
const ConnectionStatus = ({ isOnline, colors }: any) => {
  if (isOnline) return null;
  return (
    <View style={[styles.connectionStatus, { ... }]}>
      <WifiOff size={16} color={colors.blueSingle} />
      <TextComponent variante="body4" color={colors.blueSingle}>
        Hors connexion
      </TextComponent>
    </View>
  );
};
```

**Après** :
```tsx
import { InfoAlert } from '@/components/uxComponents/AlertCard';

// Dans le rendu :
<InfoAlert
  visible={!isOnline}
  icon={WifiOff}
  title="Hors connexion"
  message="Certaines fonctionnalités ne sont pas disponibles."
  actionText="Réessayer"
  onAction={() => setOnline(true)}
/>
```

## Cas d'usage courants

1. **Notification de connexion**
   ```tsx
   <InfoAlert
     icon={WifiOff}
     title="Hors connexion"
     message="Les tendances ne sont disponibles qu'en ligne."
   />
   ```

2. **Alerte de validation**
   ```tsx
   <WarningAlert
     icon={AlertCircle}
     title="Composition vide"
     message="Ajoutez au moins une section avant de sauvegarder."
     actionText="Ajouter"
     onAction={addSection}
   />
   ```

3. **Confirmation de suppression**
   ```tsx
   <ErrorAlert
     icon={Trash2}
     title="Supprimer la composition?"
     message="Cette action est irréversible."
     actionText="Supprimer"
     onAction={handleDelete}
   />
   ```

4. **Message de succès**
   ```tsx
   <SuccessAlert
     icon={CheckCircle}
     title="Succès"
     message="Votre profil a été mis à jour."
     actionText="Fermer"
     onAction={closeAlert}
   />
   ```

## Styles appliqués

- **Fond semi-transparent** : `${color}15` (15% d'opacité)
- **Bordure** : 1px avec la couleur du type
- **Arrondissement** : 12px
- **Padding** : 12px vertical, 16px horizontal
- **Icône** : 20px de large
- **Spacing** : 12px entre éléments

## Notes

- Le composant utilise automatiquement le thème clair/sombre via `useThemeColors`
- Les couleurs des types (`info`, `warning`, `error`, `success`) s'adaptent au thème courant
- Vous pouvez toujours override des styles avec `containerStyle`
- Les icônes viennent de `lucide-react-native`

## Fichiers

- `components/uxComponents/AlertCard.tsx` - Composant principal
- `components/uxComponents/AlertCardExamples.tsx` - Exemples d'utilisation
