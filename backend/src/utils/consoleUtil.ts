/* external import */
import * as colors from 'colors';

export const successMessage = (message: string): void => {
    console.log(`[Success] - ${message}`.cyan);
};

export const warningMessage = (message: string): void => {
    console.log(`[Warning] - ${message}`.yellow.italic);
};

export const errorMessage = (message: string): void => {
    console.log(`[Error] - ${message}`.red.italic.bold);
};
