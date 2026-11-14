import type { IConfigRepository } from '../../domain/iRepositories/IConfigRepository.js';
import type { PricingConfig } from '../../domain/services/InvoiceCalculator.js';
import { AppError } from '../../domain/errors/AppError.js';

/** Reads the pricing row; numeric columns arrive as strings from Postgres. */
const loadPricing = async (
    configRepository: IConfigRepository
): Promise<PricingConfig> => {
    try {
        const config = await configRepository.getConfig();
        return {
            unitPrice: Number(config.unitPrice),
            refrigeratedMultiplier: Number(config.refrigeratedMultiplier),
        };
    } catch {
        throw new AppError(
            500,
            'Pricing is not configured.',
            'Az árazás nincs beállítva.'
        );
    }
};

export default loadPricing;
