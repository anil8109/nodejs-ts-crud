// // utils/handleMongoError.ts
// import { MongoServerError } from 'mongodb';
// import { AppError } from './AppError';

// export const handleMongoError = (error: unknown): never => {
//   if (error instanceof MongoServerError) {
//     switch (error.code) {
//         case 11000:
//            { const field = Object.keys(error.keyPattern)[0];
//             throw new AppError(`${field} already exists`, 409); } 
        
//       // Add other MongoDB error codes as needed
//     }
//   }
//   throw error;
// };