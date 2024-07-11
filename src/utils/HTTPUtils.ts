import { Response } from 'express';

export const sendResponse = (response: Response, statusCode: number, data: any) => {

    if (statusCode === 200) {
        if (typeof data === 'string') {
            return response.status(statusCode).json({message: data});
        }
        return response.status(statusCode).json(data);
    }

    const responseObj = {
       success: false,
       reason: data,
    };
    
    return response.status(statusCode).json(responseObj);
};
