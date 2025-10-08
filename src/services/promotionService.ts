import { ApiClient } from './base/apiClient';
import { 
  CreatePromoCodeRequest, 
  PromoCodesResponse 
} from '../types/common.types';

export class PromotionService extends ApiClient {
  // Promotion methods
  async createPromoCode(promoData: CreatePromoCodeRequest): Promise<{ success: boolean; message: string; data: { promoCode: any } }> {
    return this.makeRequest('/promotions', {
      method: 'POST',
      body: JSON.stringify(promoData)
    });
  }

  async getPromoCodes(userId: string): Promise<PromoCodesResponse> {
    return this.makeRequest(`/app?action=promotions&userId=${userId}`);
  }
}

export const promotionService = new PromotionService();
