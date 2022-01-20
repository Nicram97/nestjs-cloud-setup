import {
  Pact,
  PactOptions,
  Verifier,
  VerifierOptions,
} from '@pact-foundation/pact';

export const initPactProvider = (pactOptions: PactOptions) => {
  return new Pact(pactOptions);
};

export const initPactVerifier = (verifierOptions: VerifierOptions) => {
  return new Verifier(verifierOptions);
};
