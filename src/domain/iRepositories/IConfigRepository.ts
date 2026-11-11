import Config from '../models/Config.js';

export interface IConfigRepository {
    editConfig(config: Config): Promise<Config>;
    getConfig(): Promise<Config>;
}
