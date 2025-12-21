import {Injectable} from '@angular/core';
import {doc, getDoc, serverTimestamp, setDoc} from 'firebase/firestore';
import {FirebaseService} from './Firebase.service';

export interface CompanyProfilePayload {
  ownerUid: string;
  companyName: string;
  contactEmail: string;
  industry: string;
  contactPhone?: string;
  officeLocation?: string;
  description?: string;
}

export interface CompanyProfile extends CompanyProfilePayload {
  onboardingCompleted: true;
  createdAt?: unknown;
  updatedAt?: unknown;
}

@Injectable({
              providedIn: 'root'
            })
export class OnboardingService extends FirebaseService {
  private readonly collectionName = 'company_profiles';

  async saveProfile(payload: CompanyProfilePayload): Promise<void> {
    const documentRef = doc(this.FireStore, this.collectionName, payload.ownerUid);
    await setDoc(documentRef, {
      ...payload,
      onboardingCompleted: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  async hasProfile(uid: string): Promise<boolean> {
    try {
      const snapshot = await getDoc(doc(this.FireStore, this.collectionName, uid));
      return snapshot.exists();
    } catch {
      return false;
    }
  }

  async getProfile(uid: string): Promise<CompanyProfile | null> {
    const snapshot = await getDoc(doc(this.FireStore, this.collectionName, uid));
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as CompanyProfile;
  }
}
