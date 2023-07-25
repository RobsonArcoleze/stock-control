import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  loginCard = true;

  constructor(
    private formBuilder: FormBuilder
  ){}

  loginForm = this.formBuilder.group({
    email: ['', Validators.compose([
      Validators.required,
      Validators.email
    ])],
    password: ['', Validators.required],

  })

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.compose([
      Validators.required,
      Validators.email
    ])],
    password: ['', Validators.required],
  })

  onSubmitLoginForm(): void {
    console.log('Dados do Formulário de Login: ', this.loginForm.value);
  }

  onSubmitSignupForm(): void {
    console.log('Dados do Formulário de Login: ', this.signupForm.value);
  }
}
