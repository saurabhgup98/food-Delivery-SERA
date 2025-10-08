import { useState, useEffect } from 'react';
import { apiService, Address } from '../services/api';
import { 
  INITIAL_FORM_DATA, 
  createFormDataFromAddress, 
  resetFormData,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES 
} from '../config/addressConfig';

export const useAddressManagement = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAddresses();
      if (response.success) {
        setAddresses(response.data.addresses);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH_FAILED);
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      if (editingAddress) {
        // Update existing address
        const response = await apiService.updateAddress(editingAddress._id, formData);
        
        if (response.success && response.data && response.data.address) {
          setAddresses(prev => prev.map(addr => 
            addr._id === editingAddress._id ? response.data.address : addr
          ));
          setEditingAddress(null);
          setSuccessMessage(SUCCESS_MESSAGES.ADDRESS_UPDATED);
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          throw new Error(response.message || ERROR_MESSAGES.UPDATE_FAILED);
        }
      } else {
        // Add new address
        const response = await apiService.createAddress(formData);
        
        if (response.success && response.data && response.data.address) {
          setAddresses(prev => [...prev, response.data.address]);
          setIsAddingNew(false);
          setSuccessMessage(SUCCESS_MESSAGES.ADDRESS_ADDED);
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          throw new Error(response.message || ERROR_MESSAGES.CREATE_FAILED);
        }
      }
      
      // Reset form
      setFormData(resetFormData());
    } catch (err: any) {
      console.error('Error saving address:', err);
      setError(err.message || ERROR_MESSAGES.CREATE_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(createFormDataFromAddress(address));
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiService.deleteAddress(id);
      if (response.success) {
        setAddresses(prev => prev.filter(addr => addr._id !== id));
        setSuccessMessage(SUCCESS_MESSAGES.ADDRESS_DELETED);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.DELETE_FAILED);
      console.error('Error deleting address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiService.updateAddress(id, { isDefault: true });
      if (response.success) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr._id === id
        })));
        setSuccessMessage(SUCCESS_MESSAGES.DEFAULT_SET);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.SET_DEFAULT_FAILED);
      console.error('Error setting default address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setIsAddingNew(false);
    setFormData(resetFormData());
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData(resetFormData());
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    // State
    addresses,
    isAddingNew,
    editingAddress,
    formData,
    loading,
    error,
    successMessage,
    
    // Actions
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleSetDefault,
    handleCancel,
    handleAddNew,
    clearMessages,
    fetchAddresses
  };
};