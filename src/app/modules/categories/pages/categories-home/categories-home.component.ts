import { DialogService } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: []
})
export class CategoriesHomeComponent implements OnInit,  OnDestroy{

  private readonly destroy$: Subject<void> = new Subject();
  public categoryDatas: GetCategoriesResponse[] = [];

  constructor(
    private catService: CategoriesService,
    private dialogService: DialogService,
    private msg: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ){}



  ngOnInit(): void {
    this.getAllCategories()
  }
  getAllCategories() {
    this.catService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0){
            this.categoryDatas = response;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.msg.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao buscar categorias: ${err.error}`,
            life: 3000
          });
          this.router.navigate(['/dashboard'])
          }
      })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
