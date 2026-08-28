import { LOGIN_FAILURE_REASON } from '@/modules/login/constants.ts';

export type VerifyFireflyLoginReason =
  (typeof LOGIN_FAILURE_REASON)[keyof typeof LOGIN_FAILURE_REASON];

export type VerifyFireflyLoginResult =
  { ok: true } | { ok: false; reason: VerifyFireflyLoginReason };

export type VerifyFireflyLoginInput = {
  token: string;
  backendUrl: string;
};
