import React, { useState } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    category: '',
    orderReference: '',
    priority: 'medium',
    bestTime: 'afternoon',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<File[]>([]);

  const issueCategories = [
    { value: 'order-problems', label: 'Order Problems', icon: '📦' },
    { value: 'account-issues', label: 'Account Issues', icon: '👤' },
    { value: 'payment-problems', label: 'Payment Problems', icon: '💳' },
    { value: 'partnership-inquiries', label: 'Partnership Inquiries', icon: '🤝' },
    { value: 'technical-support', label: 'Technical Support', icon: '🔧' },
    { value: 'feedback-suggestions', label: 'Feedback/Suggestions', icon: '💭' },
    { value: 'other', label: 'Other', icon: '❓' },
  ];

  const contactMethods = [
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate subject based on category
    if (name === 'category') {
      const category = issueCategories.find(cat => cat.value === value);
      if (category) {
        setFormData(prev => ({
          ...prev,
          subject: `SERA Support: ${category.label}`
        }));
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      console.log('Contact form submitted:', formData);
      console.log('Attachments:', attachments);
      onClose();
    }, 2000);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden">
          {/* Header */}
          <div className="relative p-4 md:p-6 bg-gradient-to-r from-sera-blue to-sera-darkBlue">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Contact SERA</h2>
              <p className="text-sm md:text-base text-white/80">We're here to help! Choose your preferred way to reach us.</p>
            </div>
          </div>

          {/* Contact Method Showcase */}
          <div className="p-4 md:p-6 border-b border-dark-600">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Get in Touch</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  onClick={method.action}
                  className="p-3 md:p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all duration-200 group border border-dark-600 hover:border-sera-blue"
                >
                  <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform">{method.icon}</div>
                  <h4 className="text-sm md:text-base font-semibold text-white mb-1">{method.title}</h4>
                  <p className="text-xs md:text-sm text-gray-300 mb-1">{method.primary}</p>
                  <p className="text-xs text-gray-400">{method.secondary}</p>
                  <div className="mt-2 text-xs text-sera-blue font-medium">{method.response}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Smart Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {currentStep} of 3</span>
                <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-sera-blue to-sera-pink h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>

                         {/* Step 1: Personal Information */}
             {currentStep === 1 && (
               <div className="space-y-6 animate-fade-in">
                 <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Personal Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Contact Method</label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email}
                    className="btn-secondary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

                         {/* Step 2: Issue Details */}
             {currentStep === 2 && (
               <div className="space-y-6 animate-fade-in">
                 <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Issue Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Issue Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                    >
                      <option value="">Select an issue category</option>
                      {issueCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Order Reference</label>
                      <input
                        type="text"
                        name="orderReference"
                        value={formData.orderReference}
                        onChange={handleInputChange}
                        className="input-field w-full"
                        placeholder="Order # (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Priority Level</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Best Time to Contact</label>
                      <select
                        name="bestTime"
                        value={formData.bestTime}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary px-6 py-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.category}
                    className="btn-secondary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

                         {/* Step 3: Message */}
             {currentStep === 3 && (
               <div className="space-y-6 animate-fade-in">
                 <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Your Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Subject line"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="input-field w-full resize-none"
                      placeholder="Please describe your issue or inquiry in detail..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Attachments</label>
                    <div className="border-2 border-dashed border-dark-600 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📎</div>
                          <p className="text-gray-400">Click to upload files or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">Images, PDF, DOC (max 5MB each)</p>
                        </div>
                      </label>
                    </div>
                    {attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-dark-700 p-2 rounded">
                            <span className="text-sm text-gray-300">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary px-6 py-2"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.message}
                    className="btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

             {/* Floating Food Icons - Hidden on mobile */}
       <div className="hidden md:block absolute inset-0 pointer-events-none">
         <div className="absolute top-20 left-10 animate-bounce-gentle">
           <div className="w-8 h-8 bg-sera-pink/20 rounded-full flex items-center justify-center">
             <span className="text-lg">🍕</span>
           </div>
         </div>
         <div className="absolute top-40 right-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
           <div className="w-6 h-6 bg-sera-blue/20 rounded-full flex items-center justify-center">
             <span className="text-sm">🍔</span>
           </div>
         </div>
         <div className="absolute bottom-40 left-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
           <div className="w-7 h-7 bg-sera-orange/20 rounded-full flex items-center justify-center">
             <span className="text-base">🍜</span>
           </div>
         </div>
         <div className="absolute bottom-20 right-10 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
           <div className="w-5 h-5 bg-sera-yellow/20 rounded-full flex items-center justify-center">
             <span className="text-xs">🍣</span>
           </div>
         </div>
       </div>
    </div>
  );
};

export default ContactForm;
