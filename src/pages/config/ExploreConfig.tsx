import { Search } from "lucide-react";
import { ItemContainer, ItemContainerProps, ColumnDef } from "../../components/common";
import HeartIcon from "../../components/Icon/HeartIcon";
import LocationIcon from "../../components/Icon/LocationIcon";
import StarIcon from "../../components/Icon/StarIcon";
import { FilterConfigItemI, FilterHandlersI, FilterStatesI } from "../interfaces/ExploreInterfaces";
import { QUICK_FILTERS } from "../constant/ExploreConstants";
import { FILTER_SELECTED_STYLES, FILTER_UNSELECTED_STYLES } from "../constant/ExploreStyles";

export const createFilterConfigs = (states: FilterStatesI, handlers: FilterHandlersI): FilterConfigItemI[] => {
  const handleRatingFilter = (rating: string) => {
    handlers.onRatingFilterChange(states.selectedRatingFilter === rating ? '' : rating);
  };

  // Map filter IDs to their selection state and onClick handlers
  const getFilterState = (filterId: string): { isSelected: boolean; onClick: () => void } => {
    switch (filterId) {
      case 'veg-only':
        return {
          isSelected: states.selectedVegFilter,
          onClick: () => handlers.onVegFilterChange(!states.selectedVegFilter),
        };
      case 'rating-4-plus':
        return {
          isSelected: states.selectedRatingFilter === '4+',
          onClick: () => handleRatingFilter('4+'),
        };
      case 'rating-3-plus':
        return {
          isSelected: states.selectedRatingFilter === '3+',
          onClick: () => handleRatingFilter('3+'),
        };
      case 'offers-only':
        return {
          isSelected: states.offersOnly,
          onClick: () => handlers.onOffersOnlyChange(!states.offersOnly),
        };
      case 'free-delivery':
        return {
          isSelected: states.freeDelivery,
          onClick: () => handlers.onFreeDeliveryChange(!states.freeDelivery),
        };
      default:
        return {
          isSelected: false,
          onClick: () => {}, // Placeholder for filters not yet implemented
        };
    }
  };

  return QUICK_FILTERS.map((filter) => {
    if (filter.isSeparator) {
      return {
        id: filter.id,
        label: filter.label,
        icon: filter.icon,
        isSelected: false,
        selectedBgColor: '',
        selectedBorderColor: '',
        selectedTextColor: '',
        onClick: () => {},
        isSeparator: true,
      };
    }

    const { isSelected, onClick } = getFilterState(filter.id);
    const selectedStyles = FILTER_SELECTED_STYLES[filter.styleVariant];

    return {
      id: filter.id,
      label: filter.label,
      icon: filter.icon,
      isSelected,
      // Only set selected styles when selected (PrimarySelectBtn uses defaults when not selected)
      selectedBgColor: selectedStyles.selectedBgColor,
      selectedBorderColor: selectedStyles.selectedBorderColor,
      selectedTextColor: selectedStyles.selectedTextColor,
      onClick,
    };
  });
};

// Get Restaurant Display Header Props
export const getRestaurantDisplayHeaderProps = (restaurantCount: number): ItemContainerProps => {
  return {
    left: [
      {
        content: (
          <div className="w-10 h-[80%] bg-gradient-to-br from-sera-blue to-sera-pink rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold">🍽️</span>
          </div>
        ),
        align: 'center',
      },
      {
        rows: [
          {
            content: (
              <h2 className="text-white font-bold text-lg sm:text-xl">
                {restaurantCount} {restaurantCount === 1 ? 'Restaurant' : 'Restaurants'} Found
              </h2>
            )
          },
          {
            content: (
              <p className="text-gray-400 text-xs sm:text-sm">
                Discover amazing food near you
              </p>
            )
          }
        ],
        width: 'w-fit',
        align: 'center',
        rowGap: 'space-y-0.5',
      },
    ],
    center: null,
    right: {
      content: (
        <ItemContainer
          center={{
            content: (
              <span className="text-gray-300 text-sm">
                Showing <span className="text-sera-orange font-semibold">{restaurantCount}</span> of <span className="text-sera-orange font-semibold">{restaurantCount}</span> restaurants
              </span>
            )
          }}
          bgColor="bg-dark-700/50"
          borderColor="border-dark-600"
          className="px-3 py-1.5 rounded-lg"
          size="w-fit h-fit"
        />
      ),
      align: 'center'
    },
    className: 'w-full h-full px-4 sm:px-6 lg:px-6 py-3',
    size: 'w-full h-full',
    bgColor: '',
    border: '',
    gradient: 'bg-gradient-to-r from-sera-blue/20 via-sera-pink/20 to-sera-orange/20',
    shape: 'rectangle'
  };
};

// Get CompactHeroSection props based on mode
export const getCompactHeroProps = (mode: 'all' | 'favorites') => {
  if (mode === 'favorites') {
    return {
      headerIcon: (
        <ItemContainer
          bgColor="bg-pink-500/20"
          borderColor="border-pink-300/30"
          shape="circular"
          size="w-6 h-6"
          center={{
            content: <HeartIcon className="w-3 h-3" color="pink-400" />
          }}
          centered={true}
        />
      ),
      heading: 'Favorite Restaurants',
      text: 'Your saved restaurants and favorite places to eat.',
      span1Icon: <StarIcon className="w-3 h-3 text-yellow-400" filled={true} />,
      span1Text: 'Personalized picks',
      span1TextColor: 'text-white/80',
      span2Icon: <LocationIcon className="w-3 h-3 text-blue-400" size="sm" />,
      span2Text: 'Quick access',
      span2TextColor: 'text-white/80'
    };
  }

  return {
    headerIcon: (
      <ItemContainer
        shape="circular"
        size="w-12 h-12"
        center={{
          content: <Search className="w-3 h-3" color="white" />
        }}
        centered={true}
      />
    ),
    heading: 'Explore Restaurants',
    text: 'Discover amazing food from the best restaurants near you.',
    span1Icon: <StarIcon className="w-3 h-3 text-yellow-400" filled={true} />,
    span1Text: 'Top rated',
    span1TextColor: 'text-white/80',
    span2Icon: <LocationIcon className="w-3 h-3 text-blue-400" size="sm" />,
    span2Text: 'Near you',
    span2TextColor: 'text-white/80'
  };
};