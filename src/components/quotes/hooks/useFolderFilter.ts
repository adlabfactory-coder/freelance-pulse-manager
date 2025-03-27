
import { useState, useEffect } from 'react';

export const useFolderFilter = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');

  // Récupérer le dossier sélectionné depuis le localStorage au chargement
  useEffect(() => {
    const savedFolder = localStorage.getItem('selectedQuoteFolder');
    if (savedFolder) {
      setSelectedFolder(savedFolder);
    }
  }, []);

  // Enregistrer le dossier sélectionné dans le localStorage
  const handleFolderChange = (folder: string) => {
    setSelectedFolder(folder);
    localStorage.setItem('selectedQuoteFolder', folder);
  };

  return {
    selectedFolder,
    setSelectedFolder: handleFolderChange,
  };
};

export default useFolderFilter;
