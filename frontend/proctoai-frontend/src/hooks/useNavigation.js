import { useState } from 'react';

export const useNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    toggleMenu,
    closeMenu
  };
};
