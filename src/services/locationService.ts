import { ApiClient } from './base/apiClient';
import { 
  CountryCodesResponse, 
  StatesResponse, 
  CitiesResponse 
} from '../types/common.types';

export class LocationService extends ApiClient {
  // Country codes and location methods
  async getCountryCodes(): Promise<CountryCodesResponse> {
    return this.makeRequest<CountryCodesResponse>('/countries');
  }

  async getCountries(): Promise<CountryCodesResponse> {
    return this.makeRequest<CountryCodesResponse>('/countries');
  }

  async getStates(countryCode: string): Promise<StatesResponse> {
    return this.makeRequest<StatesResponse>(`/countries/${countryCode}/states`);
  }

  async getCities(countryCode: string, stateCode: string): Promise<CitiesResponse> {
    return this.makeRequest<CitiesResponse>(`/countries/${countryCode}/states/${stateCode}/cities`);
  }
}

export const locationService = new LocationService();
