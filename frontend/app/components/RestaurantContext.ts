import {createContext} from 'react';
import type {Id} from '~/domain/objects';

export default createContext<Id<'Restaurant'> | null>(null);
