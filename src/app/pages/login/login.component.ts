import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {IonButton, IonContent, IonInput} from '@ionic/angular/standalone';
import {AuthStore} from '../../Stores/auth.store';

@Component({
             selector: 'snap-login-page',
             imports: [CommonModule, RouterModule, ReactiveFormsModule, IonContent, IonInput, IonButton],
             templateUrl: './login.component.html',
             styleUrls: ['./login.component.scss']
           })
export class LoginComponent {
  readonly form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authStore: AuthStore,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
                                email: ['', [Validators.required, Validators.email]],
                                password: ['', Validators.required]
                              });
  }

  get error() {
    return this.authStore.error;
  }

  get isLoading() {
    return this.authStore.isLoading();
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {email, password} = this.form.value;

    try {
      await this.authStore.signIn(email ?? '', password ?? '');
      await this.router.navigateByUrl('/dashboard');
    } catch {
      // Error surfaced via store signal; no additional logic needed.
    }
  }
}
