/**
 * Exemples d'utilisation du composant AlertCard
 * 
 * Cet exemple montre comment utiliser le composant réutilisable
 * pour afficher des notifications, alertes, messages d'erreur, etc.
 */

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { WifiOff, AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import { 
  AlertCard, 
  InfoAlert, 
  WarningAlert, 
  ErrorAlert, 
  SuccessAlert 
} from '@/components/uxComponents/AlertCard';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function AlertCardExamples() {
  const colors = useThemeColors();
  const [visibleAlerts, setVisibleAlerts] = useState({
    offline: true,
    warning: true,
    error: true,
    success: true,
    custom: true,
    question: true,
  });

  const toggleAlert = (key: string) => {
    setVisibleAlerts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background, paddingVertical: 20 }}>
      
      {/* 1. Alert Info (Hors connexion - basé sur le style original) */}
      <InfoAlert
        visible={visibleAlerts.offline}
        icon={WifiOff}
        title="Hors connexion"
        message="Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées."
        actionText="Réessayer"
        onAction={() => console.log('Retry')}
        onClose={() => toggleAlert('offline')}
      />

      {/* 2. Alert Warning */}
      <WarningAlert
        visible={visibleAlerts.warning}
        icon={AlertCircle}
        title="Attention"
        message="Assurez-vous que votre composition contient au moins une section avant de sauvegarder."
        actionText="Corriger"
        onAction={() => console.log('Corriger')}
      />

      {/* 3. Alert Error */}
      <ErrorAlert
        visible={visibleAlerts.error}
        icon={AlertCircle}
        title="Erreur de synchronisation"
        message="Impossible de charger les données. Veuillez réessayer plus tard."
        actionText="Réessayer"
        onAction={() => console.log('Réessayer')}
      />

      {/* 4. Alert Success */}
      <SuccessAlert
        visible={visibleAlerts.success}
        icon={CheckCircle}
        title="Succès"
        message="Votre composition a été sauvegardée avec succès."
        actionText="Voir"
        onAction={() => console.log('Voir')}
      />

      {/* 5. Custom Alert avec couleur personnalisée */}
      <AlertCard
        visible={visibleAlerts.custom}
        icon={Info}
        title="Information personnalisée"
        message="Ceci est un message avec une couleur personnalisée."
        customColor="#8B5CF6" // Purple
        actionText="OK"
        onAction={() => console.log('Custom action')}
      />

      {/* 6. Question/Confirmation Alert */}
      <AlertCard
        visible={visibleAlerts.question}
        icon={AlertCircle}
        title="Confirmation requise"
        message="Êtes-vous sûr de vouloir supprimer cette composition ? Cette action ne peut pas être annulée."
        customColor="#F59E0B" // Orange for questions
        actionText="Supprimer"
        onAction={() => {
          console.log('Confirmed deletion');
          toggleAlert('question');
        }}
      />

      {/* 7. Alert sans icon */}
      <AlertCard
        visible={true}
        title="Message simple"
        message="Ceci est un message sans icône."
        type="info"
      />

      {/* 8. Alert sans message (titre uniquement) */}
      <AlertCard
        visible={true}
        icon={CheckCircle}
        title="Opération complétée"
        type="success"
      />

    </ScrollView>
  );
}

/**
 * Cas d'usage courants:
 * 
 * 1. Notification de connexion:
 * <InfoAlert
 *   icon={WifiOff}
 *   title="Hors connexion"
 *   message="Les tendances ne sont disponibles qu'en ligne."
 * />
 * 
 * 2. Alerte de suppression:
 * <ErrorAlert
 *   icon={Trash2}
 *   title="Supprimer?"
 *   message="Cette action est irréversible."
 *   actionText="Supprimer"
 *   onAction={handleDelete}
 * />
 * 
 * 3. Message de succès:
 * <SuccessAlert
 *   icon={CheckCircle}
 *   title="Succès"
 *   message="Votre profil a été mis à jour."
 *   actionText="Fermer"
 *   onAction={closeAlert}
 * />
 * 
 * 4. Validation ou question:
 * <WarningAlert
 *   icon={AlertCircle}
 *   title="Composition vide"
 *   message="Ajoutez au moins une section avant de sauvegarder."
 *   actionText="Ajouter"
 *   onAction={addSection}
 * />
 */
