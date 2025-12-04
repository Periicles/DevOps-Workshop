import { Request, Response } from 'express';

export class HealthController {
    public health(req: Request, res: Response) {
        res.status(200).json({
            status: 'ok',
            service: 'breweries-service',
            timestamp: new Date().toISOString(),
        });
    }
}

export default new HealthController();
