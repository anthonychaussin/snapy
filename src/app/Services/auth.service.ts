import {Injectable} from '@angular/core';
import {getApp, getApps, initializeApp} from 'firebase/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import {environment} from '../../environments/environment';

const firebaseApp = getApps().length ? getApp() : initializeApp(environment.FIREBASE_CONFIG);
const firebaseAuth: Auth = getAuth(firebaseApp);

@Injectable({
              providedIn: 'root'
            })
export class AuthService {

  private auth: Auth = firebaseAuth;

  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signOutUser() {
    return signOut(this.auth);
  }

  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  sendVerificationEmail(user: User) {
    return sendEmailVerification(user);
  }

  updateDisplayName(user: User, displayName: string) {
    return updateProfile(user, {displayName});
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async reloadCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) {
      return Promise.reject(new Error('Utilisateur non authentifié.'));
    }
    return user.reload();
  }

  observeAuthState(listener: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, listener);
  }
}
