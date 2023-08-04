import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';

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
    private productsService: ProductsService,
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
    })
  }

  handleSubmitAddProduct(): void {
    if(this.addProductForm?.value && this.addProductForm?.valid){
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
      }
      this.productsService.crreatProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (err: HttpErrorResponse) => {
            console.log(err);
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao criar Produto: ${err.error}`,
              life: 3000
            });
          },
          complete: () =>{
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso',
              life: 3000
            })
          }
        })
    }
    this.addProductForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


