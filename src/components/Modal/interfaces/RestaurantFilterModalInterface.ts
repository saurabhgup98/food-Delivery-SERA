import { RestaurantFilterData } from '../config/RestaurantFilterModalConfig';

export interface RestaurantFilterModalProps {
  initialFilters: RestaurantFilterData;

  // Actions
  onApply: (filters: RestaurantFilterData) => void;
  onCancel: () => void;
  onClear: () => void;

  // Loading state
  loading?: boolean;
}