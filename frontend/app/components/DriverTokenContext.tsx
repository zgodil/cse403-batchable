import {createContext} from 'react';

/** represents the hidden driver token used to identify the /route/:token page  */
export const DriverTokenContext = createContext<string | null>(null);
