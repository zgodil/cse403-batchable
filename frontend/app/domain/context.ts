import {createContext} from 'react';
import type {Id} from './objects';

export const UserContext = createContext<Id<'Restaurant'>>({
  type: 'Restaurant',
  id: -1,
});
