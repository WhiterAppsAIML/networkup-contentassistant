import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';

let app: App;
let auth: Auth;

export function getFirebaseAdmin(): Auth {
  if (!getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Firebase Admin SDK config missing: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    }
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey,
      }),
    });
  }
  return getAuth(app);
}

export async function verifyFirebaseToken(idToken: string): Promise<DecodedIdToken> {
  const auth = getFirebaseAdmin();
  return auth.verifyIdToken(idToken, true);
}

export const TIER_CLAIM_MAP = {
  starter: 'STARTER',
  growth: 'GROWTH',
  enterprise: 'ENTERPRISE',
} as const;

export type FirebaseTierClaim = keyof typeof TIER_CLAIM_MAP;

export function mapFirebaseTierToBackend(firebaseTier?: string): 'STARTER' | 'GROWTH' | 'ENTERPRISE' {
  if (!firebaseTier) return 'STARTER';
  const normalized = firebaseTier.toLowerCase();
  return (TIER_CLAIM_MAP[normalized as FirebaseTierClaim] ?? 'STARTER') as 'STARTER' | 'GROWTH' | 'ENTERPRISE';
}