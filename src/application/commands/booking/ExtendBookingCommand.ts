export class ExtendBookingCommand {
    constructor(
        public readonly bookingId: string,
        public readonly userId: string,
        public readonly newEndDate: string
    ) {}
}
