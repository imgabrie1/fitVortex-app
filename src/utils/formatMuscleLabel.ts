export const formatMuscleLabel = (label: string): string => {
  return label.replace(/\s*\(Total\)$/, '');
};