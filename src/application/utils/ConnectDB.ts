import DataSource from '../../infrastructure/db/DataSource.js';

const connectDB = async () => {
    try {
        await DataSource.initialize();
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Database connection failed', error);
        process.exit(1);
    }
};

export default connectDB;
