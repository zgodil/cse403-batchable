import type {ComponentProps} from 'react';
import {Link} from 'react-router';

import {vi} from 'vitest';

vi.mock('react-router', async loadOriginal => {
  return {
    ...(await loadOriginal()),
    Link: ({to, ...props}: ComponentProps<typeof Link> & {to: string}) => (
      <a href={to} {...props} />
    ),
  };
});
