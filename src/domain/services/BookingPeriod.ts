import { AppError } from '../errors/AppError.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const toUtcDate = (isoDate: string): Date => new Date(`${isoDate}T00:00:00Z`);

export const todayIsoDate = (): string => new Date().toISOString().slice(0, 10);

/** Number of billed days between two 'YYYY-MM-DD' dates (end day excluded). */
export const countBookingDays = (startDate: string, endDate: string): number =>
    Math.ceil(
        (toUtcDate(endDate).getTime() - toUtcDate(startDate).getTime()) /
            MS_PER_DAY
    );

/** The day after a 'YYYY-MM-DD' date. */
export const nextIsoDate = (isoDate: string): string => {
    const date = toUtcDate(isoDate);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
};

/**
 * Days the goods stayed after the end date. Leaving on the end date itself
 * costs nothing, every later day is overdue.
 */
export const countOverdueDays = (
    endDate: string,
    today: string = todayIsoDate()
): number => Math.max(0, countBookingDays(endDate, today));

export const assertValidBookingPeriod = (
    startDate: string,
    endDate: string
): void => {
    if (startDate < todayIsoDate()) {
        throw new AppError(
            400,
            'The start date cannot be in the past.',
            'A kezdődátum nem lehet a múltban.'
        );
    }

    if (countBookingDays(startDate, endDate) < 1) {
        throw new AppError(
            400,
            'The end date must be after the start date.',
            'A végdátumnak a kezdődátum után kell lennie.'
        );
    }
};
