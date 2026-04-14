import React, { useState, useEffect } from 'react';
import { PrimaryForm } from '../Form';
import { PrimaryActionBtn } from '../buttons';
import { PrimarySelectBtn } from '../buttons';
import PrimaryCheckbox from '../Input/PrimaryCheckbox';
import { PrimaryContentContainer } from '../Container';
import { getHeaderContainerProps } from '../Header/CommonHeaderConfig';
import {
  RestaurantFilterData,
  getInitialRestaurantFilterData,
  getRestaurantFilterFormFieldsConfig,
  getRatingFilterConfig,
  getQuickFilterCheckboxesConfig
} from './config/RestaurantFilterModalConfig';
import { getRestaurantButtonProps, RestaurantButtonType } from '../Restaurant/Config/RestaurantButtonConfig';
import { RestaurantFilterModalProps } from './interfaces/RestaurantFilterModalInterface';

const RestaurantFilterModal: React.FC<RestaurantFilterModalProps> = ({
  initialFilters,
  onApply,
  onCancel,
  onClear,
  loading = false
}) => {
  const [localFilterData, setLocalFilterData] = useState<RestaurantFilterData>(
    initialFilters || getInitialRestaurantFilterData()
  );

  // Sync local state with initialFilters when modal opens
  useEffect(() => {
    if (initialFilters) {
      setLocalFilterData(initialFilters);
    }
  }, [initialFilters]);

  const formFieldsConfig = getRestaurantFilterFormFieldsConfig(
    localFilterData,
    setLocalFilterData,
    true
  );

  const ratingFilterConfig = getRatingFilterConfig(
    localFilterData.ratingFilter,
    (value) => setLocalFilterData(prev => ({ ...prev, ratingFilter: value }))
  );

  const checkboxConfig = getQuickFilterCheckboxesConfig(
    localFilterData,
    setLocalFilterData,
    true
  );

  const handleClearAll = () => {
    const initialData = getInitialRestaurantFilterData();
    setLocalFilterData(initialData);
    onClear();
  };

  const handleApply = () => {
    onApply(localFilterData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-600/50 overflow-hidden">
        
        {/* Modal Header */}
        <PrimaryContentContainer 
          {...getHeaderContainerProps('restaurantFilter', onCancel)}
          className="p-6 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 to-slate-800 flex-shrink-0 justify-between"
          radius="rounded-t-2xl"
        />

        {/* Modal Content - Scrollable */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0" style={{ contain: 'layout style paint' }}>
          
          {/* Primary Form Fields */}
          <PrimaryForm
            columns={1}
            fields={formFieldsConfig}
            className="space-y-6"
          />

          {/* Quick Filters Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
              Quick Filters
            </h3>
            
            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Minimum Rating</label>
              <PrimarySelectBtn {...ratingFilterConfig} />
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3">
              {checkboxConfig.map((checkbox) => (
                <div key={checkbox.id} className="flex items-center space-x-3">
                  <PrimaryCheckbox
                    id={checkbox.id}
                    checked={checkbox.checked}
                    onChange={checkbox.onChange}
                    label={checkbox.label}
                    shape={checkbox.shape}
                    checkboxSize={checkbox.checkboxSize}
                    disabled={checkbox.disabled}
                  />
                  <span className="text-gray-400">{checkbox.icon}</span>
                  <span className="text-gray-500 text-xs">{checkbox.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-600/50 bg-gradient-to-r from-slate-700 to-slate-800 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <PrimaryActionBtn
              {...getRestaurantButtonProps(RestaurantButtonType.RESTAURANT_FILTER_CLEAR_ALL, handleClearAll)}
            />
            <PrimaryActionBtn
              {...getRestaurantButtonProps(RestaurantButtonType.RESTAURANT_FILTER_CANCEL, onCancel)}
            />
            <PrimaryActionBtn
              {...getRestaurantButtonProps(RestaurantButtonType.RESTAURANT_FILTER_APPLY, handleApply, { isLoading: loading })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilterModal;
