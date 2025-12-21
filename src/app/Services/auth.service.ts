import {Injectable} from '@angular/core';
import {initializeApp, getApps, getApp} from 'firebase/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
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

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  observeAuthState(listener: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, listener);
  }
}
