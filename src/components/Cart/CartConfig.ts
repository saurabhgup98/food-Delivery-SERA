import { BtnConfig } from '../../Style';
import { InputConfig } from '../../Style';

export const PRICE_BREAKDOWN_CONFIG = {
    subtotal: {
        label: 'Subtotal',
        labelColor: 'text-gray-400',
        valueColor: 'text-white',
        textSize: 'text-sm'
    },
    deliveryFee: {
        label: 'Delivery Fee',
        labelColor: 'text-gray-400',
        valueColor: 'text-white',
        textSize: 'text-sm',
        freeThreshold: 500,
        freeMessage: 'Free'
    },
    total: {
        label: 'Total',
        labelColor: 'text-white',
        valueColor: 'text-sera-orange',
        textSize: 'text-lg font-bold'
    },
    freeDeliveryMessage: {
        text: 'Add ₹{amount} more for free delivery!',
        color: 'text-green-400',
        textSize: 'text-xs'
    }
};

export const getDeliveryInstructionsProps = (
    deliveryInstructions: string,
    setDeliveryInstructions: (value: string) => void
) => ({
    type: 'text' as const,
    name: 'deliveryInstructions',
    placeholder: 'Additional delivery instructions (optional)',
    value: deliveryInstructions,
    onChange: setDeliveryInstructions,
    className: 'w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent text-sm mt-2',
    ...InputConfig.Primary
});

export const calculateSubtotal = (items: any[]) => {
    return items.reduce((total, item) => {
        return total + (parseInt(item.price.replace('₹', '')) * item.quantity);
    }, 0);
};

export const calculateDeliveryFee = (subtotal: number) => {
    return subtotal > 500 ? 0 : 50; // Free delivery above ₹500
};

export const calculateTotal = (subtotal: number, deliveryFee: number) => {
    return subtotal + deliveryFee;
};

export const getCartFooterButtonConfigs = (
    onClearCart: () => void,
    onPlaceOrder: () => void,
    isPlacingOrder: boolean
) => [
        {
            onClick: onClearCart,
            text: "Clear Cart",
            size: "md" as const,
            className: "flex-1",
            ...BtnConfig.Secondary,
        },
        {
            onClick: onPlaceOrder,
            text: isPlacingOrder ? "Placing Order..." : "Place Order",
            disabled: isPlacingOrder,
            size: "md" as const,
            className: "flex-1",
            ...BtnConfig.OAuth
        }
    ];

// ============================================================================
// MAIN CART CONFIGURATION
// ============================================================================

export const CART_CONFIG = {
    priceBreakdown: PRICE_BREAKDOWN_CONFIG,
    deliveryInstructions: getDeliveryInstructionsProps,
    calculations: {
        calculateSubtotal,
        calculateDeliveryFee,
        calculateTotal
    },
    footerButtons: getCartFooterButtonConfigs
};
