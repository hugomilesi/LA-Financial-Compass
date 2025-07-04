import React from 'react';

interface CostCenterDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any; // Temporarily set to any for simplicity
}

export const CostCenterDetailsModal = ({
  isOpen,
  onClose,
  category
}: CostCenterDetailsModalProps) => {
  return (
    <div>
      <p>Modal content placeholder</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};