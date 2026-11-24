export class RelocateBookingCommand {
    constructor(
        public readonly bookingId: string,
        public readonly warehouseId: string
    ) {}
}
