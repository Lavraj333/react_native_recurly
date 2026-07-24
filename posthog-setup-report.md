# PostHog setup report

PostHog analytics was installed and initialized for the Expo React Native app, with authenticated identity, 12 client events, React rendering error tracking, and a starter dashboard configured.

## Installed and initialized

- Added `posthog-react-native@^4.8.0` and `react-native-svg@~15.12.1` to `package.json`.
- Ran `npm install` successfully; the resolved dependencies were recorded in `package-lock.json`.
- Added a singleton client in `lib/posthog.ts`, configured from `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST`.
- Wired the client into the Expo Router root in `app/_layout.tsx` with `PostHogProvider`. The configured environment values were verified as present in `.env`; `.env.example` documents the required variable names.
- Added `PostHogErrorBoundary` around the router stack when PostHog is configured.
- No event delivery was observed during this run. The dashboard definitions intentionally exist before matching production events arrive.

## Events instrumented

The following 12 snake_case events are defined in `.posthog-wizard-cache/.posthog-events.json` and wired at the listed call sites:

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | A user completes password or MFA sign-in. | `app/(auth)/sign_in.tsx` |
| `user_sign_in_failed` | A submitted sign-in attempt fails. | `app/(auth)/sign_in.tsx` |
| `sign_in_mfa_code_sent` | A sign-in flow requests an email MFA code. | `app/(auth)/sign_in.tsx` |
| `sign_in_mfa_code_resent` | A user requests another sign-in MFA code. | `app/(auth)/sign_in.tsx` |
| `sign_in_mfa_reset` | A user restarts sign-in from MFA verification. | `app/(auth)/sign_in.tsx` |
| `user_signed_up` | A user completes account registration and email verification. | `app/(auth)/sign_up.tsx` |
| `user_sign_up_failed` | A submitted account-registration attempt fails. | `app/(auth)/sign_up.tsx` |
| `sign_up_verification_code_sent` | A registration flow sends an email verification code. | `app/(auth)/sign_up.tsx` |
| `sign_up_verification_code_resent` | A user requests another registration verification code. | `app/(auth)/sign_up.tsx` |
| `subscription_expanded` | A user opens a subscription card to review details. | `app/(tabs)/index.tsx` |
| `subscription_collapsed` | A user closes an expanded subscription card. | `app/(tabs)/index.tsx` |
| `user_signed_out` | A user successfully signs out. | `app/(tabs)/settings.tsx` |

Subscription expansion and collapse include the non-PII `subscription_id` property. The capture plan and review handoff report no email or other PII in event properties.

## Identity

User identification was wired, not skipped. After successful password/MFA sign-in and registration, `app/(auth)/sign_in.tsx` and `app/(auth)/sign_up.tsx` call `identify()` with Clerk's stable `session.userId`; email is sent as a person property rather than an event property. The existing successful sign-out flow captures `user_signed_out` and then calls `reset()` in `app/(tabs)/settings.tsx`.

The returning-visitor path was not verified during this run. The implementation relies on the SDK's persisted identity after authentication, so the user should confirm that behavior before merging.

## Error tracking

`app/_layout.tsx` uses the SDK-supported `PostHogErrorBoundary` around the Expo Router stack. This covers uncaught React rendering exceptions when PostHog is configured. Native crash autocapture was not added because it requires the optional native plugin and separate native setup. No error event was observed arriving in PostHog during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/525484/dashboard/1895228)

The dashboard contains four rolling-30-day insights for authentication activity, signup-to-sign-in conversion, subscription engagement, and MFA/verification activity. Definitions were created successfully, but matching event volume was not validated.

## Verification and unresolved issues

Verified by the run:

- `npm install` completed successfully and resolved the PostHog dependencies.
- The available `npm run lint` command executed and reported no PostHog integration diagnostics.
- Review confirmed one client construction, provider and error-boundary wiring, all 12 planned capture call sites, stable Clerk-based identification, and reset after successful sign-out.
- The required Expo PostHog environment variable keys were present.

Not verified by the run:

- No full production build or typecheck was available; `package.json` defines no build or typecheck script.
- No tests were run.
- No app launch or live event delivery was observed.
- Returning-session identification and error-boundary delivery were not exercised.

The available lint command still fails on unrelated existing application issues: an unescaped apostrophe at `app/(auth)/sign_in.tsx:334`, lowercase `subscriptionDetails` with `useLocalSearchParams` at `app/subscriptions/[id].tsx:6`, and existing `clsx` import warnings in `app/(tabs)/_layout.tsx` and `components/SubscriptionCard.tsx`. These are the full reported build/verification conflicts; no integration-caused lint diagnostic was reported.

## Before you merge

- [ ] Run a full production Expo build and fix any generated-code lint or type errors; at minimum review the existing lint findings at `app/(auth)/sign_in.tsx:334`, `app/subscriptions/[id].tsx:6`, `app/(tabs)/_layout.tsx`, and `components/SubscriptionCard.tsx`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites.
- [ ] Set `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` in every deploy environment, not only the local `.env`; the names are documented in `.env.example`.
- [ ] Exercise sign-in, sign-up, MFA, subscription expansion/collapse, and sign-out in a built app and confirm the expected events arrive in PostHog; this run only verified code placement, not delivery.
- [ ] Confirm a returning authenticated session remains attributed to the Clerk user after app restart or reload, covering the identity flow in `app/(auth)/sign_in.tsx` and `app/(auth)/sign_up.tsx`.
- [ ] Trigger a rendering failure in a safe test environment and confirm the `PostHogErrorBoundary` path in `app/_layout.tsx` reports the error.
