import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{

  private destroy$ = new Subject<void>();

  loginCard = true;

  constructor(
    private formBuilder: FormBuilder,
    private service: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
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
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  onSubmitLoginForm(): void {
    this.service.authUser(this.loginForm.value as AuthRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.cookieService.set('USER_INFO', response?.token);
        this.loginForm.reset();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bem vindo de volta ${response?.name}`,
          life: 2000,
        })
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Usuário ou senha incorreto!`,
          life: 2000,
        })
      },
      complete: ()=> this.router.navigate(['/dashboard'])
    })
  }

  onSubmitSignupForm(): void {
    this.service.signUpUser(this.signupForm.value as SignupUserRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.signupForm.reset();
        this.loginCard = true;

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Usuário ${response.name} Criado com sucesso `,
          life: 2000,
        })
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao criar usuário! ${JSON.stringify(err.error)}`,
          life: 30000,
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
