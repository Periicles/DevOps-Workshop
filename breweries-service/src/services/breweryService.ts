import axios from 'axios';
import { Brewery, BreweryList } from '../types';

export class BreweryService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'https://api.openbrewerydb.org/v1/breweries';
    }

    public async getAllBreweries(): Promise<BreweryList> {
        try {
            const response = await axios.get<BreweryList>(this.apiUrl);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error('Error fetching breweries: ' + message);
        }
    }

    public async getRandomBrewery() {
        try {
            const response = await axios.get(`${this.apiUrl}/random`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error('Error fetching random brewery: ' + message);
        }
    }

    public async getBreweriesByCountry(country: string): Promise<BreweryList> {
        try {
            const response = await axios.get<BreweryList>(`${this.apiUrl}?by_country=${encodeURIComponent(country)}`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error('Error fetching breweries by country: ' + message);
        }
    }

    public async getBreweryById(id: string): Promise<Brewery | null> {
        try {
            const response = await axios.get<Brewery>(`${this.apiUrl}/${id}`);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Error fetching brewery by id:', message);
            return null;
        }
    }
}