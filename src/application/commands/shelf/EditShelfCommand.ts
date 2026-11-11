import type { ShelfType } from '../../../domain/enums/ShelfType.js';
import type { ShelfStatus } from '../../../domain/enums/ShelfStatus.js';
export class EditShelfCommand {
    constructor(
        public readonly Id: string,
        public readonly warehouseId: string,
        public readonly capacity: number,
        public readonly type: ShelfType,
        public readonly status: ShelfStatus
    ) {}
}
