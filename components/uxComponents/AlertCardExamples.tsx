/**
 * Exemples d'utilisation du composant AlertCard
 * 
 * Style unique inspiré de la notification "Hors connexion" de homescreen
 * Utilise la couleur blueSingle pour tous les messages
 */

import { AlertCard } from '@/components/uxComponents/AlertCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { AlertCircle, CheckCircle, Info, Trash2, WifiOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function AlertCardExamples() {
  const colors = useThemeColors();
  const [visibleAlerts, setVisibleAlerts] = useState({
    offline: true,
    validation: true,
    deletion: true,
    success: true,
    info: true,
    simple: true,
  });

  const toggleAlert = (key: keyof typeof visibleAlerts) => {
    setVisibleAlerts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background, paddingVertical: 20 }}>
      
      {/* 1. Notification Hors connexion (style original) */}
      <AlertCard
        visible={visibleAlerts.offline}
        icon={WifiOff}
        title="Hors connexion"
        message="Vous êtes actuellement hors ligne. Certaines fonctionnalités seront limitées."
        actionText="Réessayer"
        onAction={() => {
          console.log('Retry connection');
          toggleAlert('offline');
        }}
      />

      {/* 2. Alerte de validation */}
      <AlertCard
        visible={visibleAlerts.validation}
        icon={AlertCircle}
        title="Composition vide"
        message="Ajoutez au moins une section avant de sauvegarder."
        actionText="Ajouter"
        onAction={() => console.log('Add section')}
      />

      {/* 3. Confirmation de suppression */}
      <AlertCard
        visible={visibleAlerts.deletion}
        icon={Trash2}
        title="Supprimer?"
        message="Cette action est irréversible et supprimera définitivement la composition."
        actionText="Supprimer"
        onAction={() => {
          console.log('Delete confirmed');
          toggleAlert('deletion');
        }}
      />

      {/* 4. Message de succès */}
      <AlertCard
        visible={visibleAlerts.success}
        icon={CheckCircle}
        title="Succès"
        message="Votre composition a été sauvegardée avec succès."
        actionText="Voir"
        onAction={() => console.log('View composition')}
      />

      {/* 5. Message informatif */}
      <AlertCard
        visible={visibleAlerts.info}
        icon={Info}
        title="Information"
        message="Les mises à jour de la bibliothèque sont disponibles. Vérifiez la qualité du contenu."
        actionText="Fermer"
        onAction={() => toggleAlert('info')}
      />

      {/* 6. Alerte sans icon */}
      <AlertCard
        visible={visibleAlerts.simple}
        title="Attention"
        message="Vous avez des changements non sauvegardés."
        actionText="OK"
        onAction={() => toggleAlert('simple')}
      />

    </ScrollView>
  );
}

/**
 * Cas d'usage courants:
 * 
 * 1. Notification de connexion:
 * <AlertCard
 *   icon={WifiOff}
 *   title="Hors connexion"
 *   message="Les tendances ne sont disponibles qu'en ligne."
 * />
 * 
 * 2. Alerte de suppression:
 * <AlertCard
 *   icon={Trash2}
 *   title="Supprimer?"
 *   message="Cette action est irréversible."
 *   actionText="Supprimer"
 *   onAction={handleDelete}
 * />
 * 
 * 3. Message de succès:
 * <AlertCard
 *   icon={CheckCircle}
 *   title="Succès"
 *   message="Votre profil a été mis à jour."
 *   actionText="Fermer"
 *   onAction={closeAlert}
 * />
 * 
 * 4. Validation ou question:
 * <AlertCard
 *   icon={AlertCircle}
 *   title="Composition vide"
 *   message="Ajoutez au moins une section avant de sauvegarder."
 *   actionText="Ajouter"
 *   onAction={addSection}
 * />
 */
