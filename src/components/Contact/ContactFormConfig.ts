import React from 'react';
import { FormField } from '../Form/PrimaryForm';
import { BtnConfig } from '../../Style';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  countryCode: string;
  preferredContact: string;
  category: string;
  orderReference: string;
  priority: string;
  bestTime: string;
  subject: string;
  message: string;
}

export const issueCategories = [
  { value: 'order-problems', label: 'Order Problems', icon: '📦' },
  { value: 'account-issues', label: 'Account Issues', icon: '👤' },
  { value: 'payment-problems', label: 'Payment Problems', icon: '💳' },
  { value: 'partnership-inquiries', label: 'Partnership Inquiries', icon: '🤝' },
  { value: 'technical-support', label: 'Technical Support', icon: '🔧' },
  { value: 'feedback-suggestions', label: 'Feedback/Suggestions', icon: '💭' },
  { value: 'other', label: 'Other', icon: '❓' },
];

export const contactMethodOptions = [
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'phone', label: 'Phone', icon: '📞' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
];

export const priorityOptions = [
  { value: 'low', label: 'Low', icon: '🟢' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'high', label: 'High', icon: '🟠' },
  { value: 'urgent', label: 'Urgent', icon: '🔴' },
];

export const bestTimeOptions = [
  { value: 'morning', label: 'Morning', icon: '🌅' },
  { value: 'afternoon', label: 'Afternoon', icon: '☀️' },
  { value: 'evening', label: 'Evening', icon: '🌆' },
];

/**
 * Get initial form data
 */
export const getInitialContactFormData = (user: any): ContactFormData => ({
  name: user?.username || '',
  email: user?.email || '',
  phone: '',
  whatsappNumber: '',
  countryCode: 'IN',
  preferredContact: 'email',
  category: '',
  orderReference: '',
  priority: 'medium',
  bestTime: 'afternoon',
  subject: '',
  message: '',
});

/**
 * Get form fields configuration for Step 1: Personal Information
 */
export const getStep1FormFieldsConfig = (
  formData: ContactFormData,
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>,
  user: any
): FormField[] => {
  const fields: FormField[] = [];

  // Name and Email fields
  if (user) {
    // Read-only fields for logged-in users
    fields.push(
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        value: formData.name || 'Not provided',
        onChange: () => {},
        disabled: true,
        placeholder: ''
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        value: formData.email || 'Not provided',
        onChange: () => {},
        disabled: true,
        placeholder: ''
      }
    );
  } else {
    // Editable fields for non-logged-in users
    fields.push(
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        value: formData.name,
        onChange: (value) => setFormData(prev => ({ ...prev, name: value as string })),
        disabled: false,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        value: formData.email,
        onChange: (value) => setFormData(prev => ({ ...prev, email: value as string })),
        disabled: false,
        placeholder: 'Enter your email'
      }
    );
  }

  // Preferred Contact Method
  fields.push({
    id: 'preferredContact',
    type: 'dropdown',
    label: 'Preferred Contact Method',
    value: formData.preferredContact,
    onChange: (value) => setFormData(prev => ({ ...prev, preferredContact: value as string })),
    disabled: false,
    options: contactMethodOptions,
    placeholder: 'Select contact method'
  });

  // Conditional phone/WhatsApp fields based on preferred contact method
  if (formData.preferredContact === 'whatsapp') {
    fields.push({
      id: 'whatsappNumber',
      type: 'phone',
      label: 'WhatsApp Number (if different from your registered phone)',
      value: formData.whatsappNumber,
      onChange: (value) => setFormData(prev => ({ ...prev, whatsappNumber: value as string })),
      disabled: false,
      placeholder: 'Enter your WhatsApp number',
      countryCode: formData.countryCode,
      onCountryCodeChange: (value) => setFormData(prev => ({ ...prev, countryCode: value }))
    });
  }

  if (formData.preferredContact === 'phone' || formData.preferredContact === 'email') {
    if (user) {
      fields.push({
        id: 'phone',
        type: 'text',
        label: formData.preferredContact === 'phone' ? 'Phone Number' : 'Phone Number (for account verification)',
        value: formData.phone || 'Not provided',
        onChange: () => {},
        disabled: true,
        placeholder: ''
      });
    } else {
      fields.push({
        id: 'phone',
        type: 'phone',
        label: formData.preferredContact === 'phone' ? 'Phone Number' : 'Phone Number (for account verification)',
        value: formData.phone,
        onChange: (value) => setFormData(prev => ({ ...prev, phone: value as string })),
        disabled: false,
        placeholder: 'Enter your phone number',
        countryCode: formData.countryCode,
        onCountryCodeChange: (value) => setFormData(prev => ({ ...prev, countryCode: value }))
      });
    }
  }

  return fields;
};

/**
 * Get form fields configuration for Step 2: Issue Details
 */
export const getStep2FormFieldsConfig = (
  formData: ContactFormData,
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>
): FormField[] => [
  {
    id: 'category',
    type: 'dropdown',
    label: 'Issue Category',
    value: formData.category,
    onChange: (value) => setFormData(prev => ({ ...prev, category: value as string })),
    disabled: false,
    options: issueCategories,
    placeholder: 'Select an issue category'
  },
  {
    id: 'orderReference',
    type: 'text',
    label: 'Order Reference',
    value: formData.orderReference,
    onChange: (value) => setFormData(prev => ({ ...prev, orderReference: value as string })),
    disabled: false,
    placeholder: 'Order # (optional)'
  },
  {
    id: 'priority',
    type: 'dropdown',
    label: 'Priority Level',
    value: formData.priority,
    onChange: (value) => setFormData(prev => ({ ...prev, priority: value as string })),
    disabled: false,
    options: priorityOptions,
    placeholder: 'Select priority level'
  },
  {
    id: 'bestTime',
    type: 'dropdown',
    label: 'Best Time to Contact',
    value: formData.bestTime,
    onChange: (value) => setFormData(prev => ({ ...prev, bestTime: value as string })),
    disabled: false,
    options: bestTimeOptions,
    placeholder: 'Select best time'
  }
];

/**
 * Get form fields configuration for Step 3: Message
 */
export const getStep3FormFieldsConfig = (
  formData: ContactFormData,
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>
): FormField[] => [
  {
    id: 'subject',
    type: 'text',
    label: 'Subject',
    value: formData.subject,
    onChange: (value) => setFormData(prev => ({ ...prev, subject: value as string })),
    disabled: false,
    placeholder: 'Subject line'
  },
  {
    id: 'message',
    type: 'textarea',
    label: 'Message',
    value: formData.message,
    onChange: (value) => setFormData(prev => ({ ...prev, message: value as string })),
    disabled: false,
    placeholder: 'Please describe your issue or inquiry in detail...',
    rows: 6,
    resize: 'none'
  }
];

/**
 * Get button configuration for Step 1
 */
export const getStep1ButtonsConfig = (
  onNext: () => void,
  formData: ContactFormData
) => [
  {
    onClick: onNext,
    disabled: !formData.name || !formData.email || (formData.preferredContact === 'whatsapp' && !formData.whatsappNumber),
    text: "Next Step",
    size: "md" as const,
    className: "px-6 py-2",
    ...BtnConfig.Secondary
  }
];

/**
 * Get button configuration for Step 2
 */
export const getStep2ButtonsConfig = (
  onPrev: () => void,
  onNext: () => void,
  formData: ContactFormData
) => [
  {
    onClick: onPrev,
    text: "Previous",
    size: "md" as const,
    className: "px-6 py-2",
    ...BtnConfig.Secondary
  },
  {
    onClick: onNext,
    disabled: !formData.category,
    text: "Next Step",
    size: "md" as const,
    className: "px-6 py-2",
    ...BtnConfig.Secondary
  }
];

/**
 * Get button configuration for Step 3
 */
export const getStep3ButtonsConfig = (
  onPrev: () => void,
  onSubmit: () => void,
  formData: ContactFormData,
  isLoading: boolean
) => [
  {
    onClick: onPrev,
    text: "Previous",
    size: "md" as const,
    className: "px-6 py-2",
    ...BtnConfig.Secondary
  },
  {
    onClick: onSubmit,
    disabled: isLoading || !formData.message,
    text: isLoading ? 'Sending...' : 'Send Message',
    size: "md" as const,
    className: "px-8 py-2"
  }
];

/**
 * Get close button configuration
 */
export const getCloseButtonConfig = (onClose: () => void) => ({
  onClick: onClose,
  text: "✕",
  size: "sm" as const,
  className: "text-gray-400 hover:text-white",
  ...BtnConfig.Secondary
});

/**
 * Contact methods configuration
 */
export const contactMethods = [
  {
    icon: '📞',
    title: 'Phone Support',
    primary: '+1 (555) SERA-123',
    secondary: '24/7 Support',
    response: 'Immediate',
    action: () => window.open('tel:+1555SERA123'),
  },
  {
    icon: '📧',
    title: 'Email Support',
    primary: 'hello@serafood.com',
    secondary: '< 2 hours response',
    response: 'Quick',
    action: () => window.open('mailto:hello@serafood.com'),
  },
  {
    icon: '💬',
    title: 'Live Chat',
    primary: 'Available 24/7',
    secondary: '2 people ahead',
    response: 'Instant',
    action: () => console.log('Open live chat'),
  },
  {
    icon: '📍',
    title: 'Visit Us',
    primary: '123 Food Street, City',
    secondary: '9 AM - 6 PM',
    response: 'In-person',
    action: () => console.log('Show office location'),
  },
];

/**
 * Floating food icons configuration
 */
export const getFloatingFoodIcons = () => [
  {
    id: 'pizza',
    icon: '🍕',
    position: 'top-20 left-10',
    size: 'w-8 h-8',
    bgColor: 'bg-sera-pink/20',
    animationDelay: '0s'
  },
  {
    id: 'burger',
    icon: '🍔',
    position: 'top-40 right-20',
    size: 'w-6 h-6',
    bgColor: 'bg-sera-blue/20',
    animationDelay: '1s'
  },
  {
    id: 'noodles',
    icon: '🍜',
    position: 'bottom-40 left-20',
    size: 'w-7 h-7',
    bgColor: 'bg-sera-orange/20',
    animationDelay: '2s'
  },
  {
    id: 'sushi',
    icon: '🍣',
    position: 'bottom-20 right-10',
    size: 'w-5 h-5',
    bgColor: 'bg-sera-yellow/20',
    animationDelay: '0.5s'
  }
];
