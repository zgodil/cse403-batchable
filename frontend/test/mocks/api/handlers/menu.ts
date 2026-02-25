import {db, makeCrudHandlers} from '../common';
export const menuHandlers = [
  ...makeCrudHandlers('/api/menu', db.menuItems, [
    'create',
    'read',
    'update',
    'delete',
  ]),
];
