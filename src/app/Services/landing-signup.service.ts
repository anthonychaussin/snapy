import {Injectable} from '@angular/core';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {FirebaseService} from './Firebase.service';

export interface LandingCompanyPayload {
  companyName: string;
  contactEmail: string;
  ownerUid: string;
  contactPhone?: string;
  notes?: string;
}

/**
 * Persists landing registration intents so the back office can approve companies before
 * granting broader access. Make sure the Firestore rules explicitly guard this path:
 *
 * match /landing_company_requests/{docId} {
 *   allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerUid;
 *   allow read, update, delete, list: if false;
 * }
 *
 * You can verify these permissions in the Firebase Console (Firestore → Rules) or by
 * deploying updated rules via `firebase deploy --only firestore:rules`.
 */
@Injectable({
              providedIn: 'root'
            })
export class LandingSignupService extends FirebaseService {
  async registerLandingCompany(payload: LandingCompanyPayload): Promise<void> {
    await addDoc(collection(this.FireStore, 'landing_company_requests'), {
      ...payload,
      createdAt: serverTimestamp()
    });
  }
}
