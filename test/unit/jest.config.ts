import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
export default config;
