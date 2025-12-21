import {computed, Injectable, signal} from '@angular/core';
import {FirebaseError} from 'firebase/app';
import type {User} from 'firebase/auth';
import {AuthService} from '../Services/auth.service';

type AuthStatus = 'idle' | 'loading' | 'error';

@Injectable({
              providedIn: 'root'
            })
export class AuthStore {
  /**
   * Central signal store exposing the current Firebase user, loading status, and errors.
   * Consume `user()`, `isAuthenticated()`, `isLoading()`, and `error()` from views
   * while invoking the exposed actions (`signIn`, `register`, `signOut`, `resetPassword`).
   */

  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private readonly _status = signal<AuthStatus>('idle');
  readonly status = computed(() => this._status());
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isAuthenticated = computed(() => !!this._user());

  private readonly _initialized = signal(false);
  readonly isInitialized = computed(() => this._initialized());
  private _readyResolver?: () => void;
  private readonly _readyPromise: Promise<void>;
  readonly ready: Promise<void>;

  constructor(private readonly authService: AuthService) {
    this._readyPromise = new Promise(resolve => {
      this._readyResolver = resolve;
    });
    this.ready = this._readyPromise;
    this.authService.observeAuthState(user => {
      this._user.set(user);
      if (!this.isInitialized()) {
        this._initialized.set(true);
        this._readyResolver?.();
        this._readyResolver = undefined;
      }
    });
  }

  signIn(email: string, password: string) {
    return this.withStatus(() => this.authService.signInWithEmail(email, password));
  }

  register(email: string, password: string) {
    return this.withStatus(() => this.authService.registerWithEmail(email, password));
  }

  signOut() {
    return this.withStatus(() => this.authService.signOutUser());
  }

  resetPassword(email: string) {
    return this.withStatus(() => this.authService.sendPasswordReset(email));
  }

  waitForAuthState(): Promise<void> {
    if (this.isInitialized()) {
      return Promise.resolve();
    }
    return this.ready;
  }

  private async withStatus<T>(action: () => Promise<T>): Promise<T> {
    this._status.set('loading');
    this._error.set(null);

    try {
      const result = await action();
      this._status.set('idle');
      return result;
    } catch (error) {
      this._status.set('error');
      this._error.set(this.formatErrorMessage(error));
      throw error;
    }
  }

  private formatErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError || error instanceof Error) {
      return error.message;
    }
    return 'Une erreur est survenue pendant l\'authentification.';
  }
}
