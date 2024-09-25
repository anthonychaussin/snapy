import {EventEmitter, inject, Injectable} from '@angular/core';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  provideAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile
} from '@angular/fire/auth';
import {AuthCredential} from '@firebase/auth';
import {BehaviorSubject} from 'rxjs';
import {User} from '../Models';
import {UserService} from './User.service';

@Injectable({
              providedIn: 'root'
            })
export class AuthService {
  private FirebaseAuth = inject(provideAuth);
  private User: User | undefined;

  /**
   * Prompt to show to user for confirm email and password.
   * It must be listened with a function that give a {@link AuthCredential},
   * see {@link ReAuthenticate} methode for more explanation
   * @type {EventEmitter<any>}
   */
  public PromptForCredential: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userService: UserService) {
    this.FirebaseAuth.useDeviceLanguage();
  }

  /**
   * Delete the current user
   * @return {Promise<void>}
   */
  async RemoveCurrentUser(): Promise<void> {
    return deleteUser(this.FirebaseAuth.currentUser);
  }

  /**
   * Get current user (from cache if defined)
   * @return {User}
   */
  GetCurrentUser(): User {
    if (this.User) {
      return this.User;
    }

    this.User = User.NewFromAuthUser(this.FirebaseAuth.currentUser);
    return this.User;
  }

  /**
   * Create a new user account
   * @param {string} email User's email
   * @param {string} password User's password
   * @return {Promise<User>} return a basic {@link User}
   */
  async SignUp(email: string, password: string): Promise<User> {
    let userCredentials = await createUserWithEmailAndPassword(this.FirebaseAuth, email, password);
    this.User = User.NewFromAuthUser(userCredentials.user);
    return this.User;
  }

  /**
   * Log in a user
   * @param {string} email User's email
   * @param {string} password User's password
   * @return {Promise<User>} return a full {@link User}
   */
  async SignIn(email: string, password: string): Promise<User> {
    let userCredentials = await signInWithEmailAndPassword(this.FirebaseAuth, email, password);
    this.User = User.NewFromAuthUser(userCredentials.user);
    this.User = Object.assign(this.User, {
      ...this.User,
      ...(await this.userService.Get(User.DBName, userCredentials.user.uid))!
    });
    return this.User;
  }

  /**
   * Disconnect the current user
   * @return {Promise<void>}
   */
  async SignOut(): Promise<void> {
    return await signOut(this.FirebaseAuth);
  }

  /**
   * Update user basic info (displayName, avatar)
   * @param {User} user The {@link User} to update
   * @return {Promise<User>} return a new full {@link User} object
   */
  async UpdateUserInfo(user: User): Promise<User> {
    await updateProfile(this.FirebaseAuth.currentUser, {
      displayName: user.DisplayName,
      photoURL: user.Avatar
    });
    this.User = undefined;
    return this.GetCurrentUser();
  }

  /**
   * Update user's email.
   * You must be listening {@link PromptForCredential} event before calling this method !
   * @param {string} email New user's email
   */
  UpdateUserEmail(email: string): void {
    let subscriber = this.ReAuthenticate().asObservable().subscribe((state: boolean | undefined): Promise<void> | null => {
      switch (state) {
        case undefined:
          return null;
        case true:
          subscriber.unsubscribe();
          return updateEmail(this.FirebaseAuth.constructor, email);
        case false:
          subscriber.unsubscribe();
          return null;
      }
    });
  }

  /**
   * Send verification mail for a new {@link SignUp} {@link User}
   * @return {Promise<void>}
   */
  async SendEmailVerification(): Promise<void> {
    return sendEmailVerification(this.FirebaseAuth.currentUser);
  }

  /**
   * Update user's password.
   * You must be listening {@link PromptForCredential} event before calling this method !
   * @param {string} password New user's password
   */
  UpdateUserPassword(password: string): void {
    let subscriber = this.ReAuthenticate().asObservable().subscribe((state: boolean | undefined): Promise<void> | null => {
      switch (state) {
        case undefined:
          return null;
        case true:
          subscriber.unsubscribe();
          return updatePassword(this.FirebaseAuth.constructor, password);
        case false:
          subscriber.unsubscribe();
          return null;
      }
    });
  }

  /**
   * Send password reset mail to a user
   * @return {Promise<void>}
   */
  async SendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.FirebaseAuth, email);
  }

  /**
   * Re authenticate a user.
   * Allow to confirm email and password of a user before an update of his personal information
   * @return {BehaviorSubject<boolean | undefined>} Authenticated state (undefined : before user enter his credential, false : wrong credential, true : valid credentials)
   * @private
   */
  private ReAuthenticate(): BehaviorSubject<boolean | undefined> {
    let userAuthenticated = new BehaviorSubject<boolean | undefined>(undefined);
    this.PromptForCredential.emit({
                                    func: (credentials: AuthCredential) => {
                                      reauthenticateWithCredential(this.FirebaseAuth.currentUser, credentials).then(() => {
                                        userAuthenticated.next(true);
                                      }).catch((error) => {
                                        console.error(error);
                                        userAuthenticated.next(false);
                                      });
                                    }
                                  });
    return userAuthenticated;
  }
}
