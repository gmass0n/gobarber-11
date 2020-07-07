import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { provider_id } = req.params;
    const { day, year, month } = req.query;

    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const providers = await listProviderDayAvailabilityService.execute({
      provider_id,
      day: Number(day),
      year: Number(year),
      month: Number(month),
    });

    return res.json(providers);
  }
}
