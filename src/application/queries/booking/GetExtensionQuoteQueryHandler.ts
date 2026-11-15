import type {
    ExtensionQuote,
    IBookingRepository,
} from '../../../domain/iRepositories/IBookingRepository.js';
import type { IConfigRepository } from '../../../domain/iRepositories/IConfigRepository.js';
import loadPricing from '../../utils/LoadPricing.js';
import { GetExtensionQuoteQuery } from './GetExtensionQuoteQuery.js';

export class GetExtensionQuoteQueryHandler {
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly configRepository: IConfigRepository
    ) {}

    async handle(query: GetExtensionQuoteQuery): Promise<ExtensionQuote> {
        const pricing = await loadPricing(this.configRepository);

        return await this.bookingRepository.getExtensionQuote(
            query.bookingId,
            query.userId,
            query.newEndDate,
            pricing
        );
    }
}
