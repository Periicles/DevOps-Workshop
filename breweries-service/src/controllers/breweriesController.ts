import { Request, Response } from 'express';
import { BreweryService } from '../services/breweryService';

export class BreweriesController {
    private breweryService: BreweryService;

    constructor() {
        this.breweryService = new BreweryService();
    }

    public async fetchBreweries(req: Request, res: Response) {
        try {
            const breweries = await this.breweryService.getAllBreweries();
            res.status(200).json(breweries);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching breweries', error });
        }
    }

    public async fetchRandomBrewery(req: Request, res: Response) {
        try {
            const brewery = await this.breweryService.getRandomBrewery();
            res.status(200).json(brewery);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching random brewery', error });
        }
    }

    public async fetchBreweriesByCountry(req: Request, res: Response) {
        try {
            const { country } = req.params;
            if (!country) {
                return res.status(400).json({ message: 'Country parameter is required' });
            }
            const breweries = await this.breweryService.getBreweriesByCountry(country);
            res.status(200).json(breweries);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching breweries by country', error });
        }
    }
}

export default new BreweriesController();