
import { useState, useEffect, useCallback } from 'react';

export const useFolderFilter = (initialFolder: string | null = null) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(initialFolder);
  
  // Fonction pour filtrer les éléments par dossier
  const filterByFolder = useCallback((items: any[]) => {
    if (!selectedFolder) return items;
    return items.filter(item => item.folder === selectedFolder);
  }, [selectedFolder]);
  
  // Permettre la persistance du filtre dans le stockage local
  useEffect(() => {
    // Charger le filtre au démarrage
    const savedFolder = localStorage.getItem('appointmentFolderFilter');
    if (savedFolder) {
      try {
        setSelectedFolder(JSON.parse(savedFolder));
      } catch (e) {
        localStorage.removeItem('appointmentFolderFilter');
      }
    }
  }, []);
  
  // Sauvegarder le filtre lorsqu'il change
  useEffect(() => {
    if (selectedFolder === null) {
      localStorage.removeItem('appointmentFolderFilter');
    } else {
      localStorage.setItem('appointmentFolderFilter', JSON.stringify(selectedFolder));
    }
  }, [selectedFolder]);
  
  return {
    selectedFolder,
    setSelectedFolder,
    filterByFolder
  };
};
