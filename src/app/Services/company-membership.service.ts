import {Injectable} from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import {RoleType} from '../Models';
import {FirebaseService} from './Firebase.service';

export type MembershipStatus = 'pending' | 'active';

export interface CompanyMembership {
  id?: string;
  ownerUid: string;
  email: string;
  status: MembershipStatus;
  role?: RoleType;
  invitedAt?: Timestamp | null;
  joinedAt?: Timestamp | null;
  employeeUid?: string | null;
  inviteNote?: string | null;
}

@Injectable({
              providedIn: 'root'
            })
export class CompanyMembershipService extends FirebaseService {
  private readonly collectionName = 'company_memberships';

  async invite(email: string, ownerUid: string, role: RoleType = RoleType.EMPLOYEE, note?: string): Promise<CompanyMembership> {
    const normalizedEmail = email?.trim().toLowerCase() ?? '';
    const docRef = doc(collection(this.FireStore, this.collectionName));
    const payload = {
      ownerUid,
      email: normalizedEmail,
      status: 'pending' as MembershipStatus,
      role,
      invitedAt: serverTimestamp(),
      inviteNote: note ?? null
    };
    await setDoc(docRef, payload);
    return {
      id: docRef.id,
      ...payload
    } as CompanyMembership;
  }

  async listForOwner(ownerUid: string): Promise<CompanyMembership[]> {
    const q = query(
      collection(this.FireStore, this.collectionName),
      where('ownerUid', '==', ownerUid),
      orderBy('invitedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.parseDoc(doc.id, doc.data()));
  }

  subscribeToOwner(ownerUid: string, listener: (members: CompanyMembership[]) => void): () => void {
    const q = query(
      collection(this.FireStore, this.collectionName),
      where('ownerUid', '==', ownerUid),
      orderBy('invitedAt', 'desc')
    );
    return onSnapshot(q, snapshot => {
      const members = snapshot.docs.map(doc => this.parseDoc(doc.id, doc.data()));
      listener(members);
    });
  }

  async getInviteById(inviteId: string): Promise<CompanyMembership | null> {
    try {
      const docRef = doc(this.FireStore, this.collectionName, inviteId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        return null;
      }
      return this.parseDoc(snapshot.id, snapshot.data());
    } catch {
      return null;
    }
  }

  async findPendingByEmail(email: string): Promise<CompanyMembership | null> {
    if (!email) {
      return null;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const q = query(
      collection(this.FireStore, this.collectionName),
      where('email', '==', normalizedEmail),
      where('status', '==', 'pending'),
      orderBy('invitedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    return this.parseDoc(snapshot.docs[0].id, snapshot.docs[0].data());
  }

  async findMembershipByEmployee(employeeUid: string): Promise<CompanyMembership | null> {
    if (!employeeUid) {
      return null;
    }
    const q = query(
      collection(this.FireStore, this.collectionName),
      where('employeeUid', '==', employeeUid),
      orderBy('joinedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    return this.parseDoc(snapshot.docs[0].id, snapshot.docs[0].data());
  }

  async activateInvite(inviteId: string | null, employeeUid: string, employeeEmail?: string): Promise<CompanyMembership | null> {
    const targetId = inviteId ?? (employeeEmail ? (await this.findPendingByEmail(employeeEmail))?.id : undefined);
    if (!targetId) {
      return null;
    }
    const docRef = doc(this.FireStore, this.collectionName, targetId);
    await updateDoc(docRef, {
      status: 'active',
      employeeUid,
      joinedAt: serverTimestamp()
    });
    return this.getInviteById(targetId);
  }

  async hasActiveMembership(employeeUid: string): Promise<boolean> {
    const membership = await this.findMembershipByEmployee(employeeUid);
    return !!membership;
  }

  async updateMemberRole(memberId: string, role: RoleType | undefined): Promise<void> {
    if (!memberId) {
      return;
    }
    const docRef = doc(this.FireStore, this.collectionName, memberId);
    await updateDoc(docRef, {role});
  }

  async removeMembership(memberId: string): Promise<void> {
    if (!memberId) {
      return;
    }
    const docRef = doc(this.FireStore, this.collectionName, memberId);
    await deleteDoc(docRef);
  }

  private parseDoc(id: string, data: DocumentData): CompanyMembership {
    return {
      id,
      ownerUid: data['ownerUid'],
      email: data['email'],
      status: data['status'],
      invitedAt: data['invitedAt'] ?? null,
      joinedAt: data['joinedAt'] ?? null,
      employeeUid: data['employeeUid'] ?? null,
      role: (data['role'] ?? data['roleType']) as RoleType | undefined,
      inviteNote: data['inviteNote'] ?? null
    } as CompanyMembership;
  }
}
