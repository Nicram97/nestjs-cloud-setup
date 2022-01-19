import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testRegex: '.*\\.contract-verifier-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
export default config;
