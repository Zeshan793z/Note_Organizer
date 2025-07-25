// import { Request } from 'express';

// export interface AuthRequest extends Request {
//   user?: {
//     _id: string;
//     name?: string;
//     email?: string;
//   };
// }

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name?: string;
    email?: string;
  };
}




