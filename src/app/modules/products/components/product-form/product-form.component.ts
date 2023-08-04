import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$:Subject<void> = new Subject();
  public categoriesDatas: GetCategoriesResponse[] = [];
  public selectedCategory: {name: string; code: string}[] = []

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private msg: MessageService,
    private router: Router,

  ){}

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required]
  })

  ngOnInit(): void {
    this.getAllCategories();
  }

 getAllCategories(): void {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.categoriesDatas = response;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.msg.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao Buscar as Categorias: ${err.error}`,
          life: 3000
        });
      },
      complete: () =>{
        this.msg.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Categorias listadas com sucesso',
          life: 3000
        })
      }
    })
  }

  handleSubmitAddProduct(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


