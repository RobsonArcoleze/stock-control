import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ProductEvent } from 'src/app/models/enums/Products-event';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/event/event-action';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { EditProductResquest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$:Subject<void> = new Subject();
  public categoriesDatas: GetCategoriesResponse[] = [];
  public selectedCategory: {name: string; code: string}[] = []
  public productAction!: {
    event: EventAction,
    productList: GetAllProductsResponse[]
  }
  public renderDropdown = false;
  public productSelectedDatas!: GetAllProductsResponse;
  public productList: GetAllProductsResponse[]= [];
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private productDt: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private msg: MessageService,
    private router: Router,
    private ref: DynamicDialogConfig
  ){}

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required]
  });

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required]
  });

  ngOnInit(): void {

    this.productAction = this.ref.data;
    this.productAction?.event?.action === this.saleProductAction && this.getProductDatas();
    this.getAllCategories();
    this.renderDropdown = true;
  }

 getAllCategories(): void {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.categoriesDatas = response;
          if(this.productAction?.event?.action === this.editProductAction
            && this.productAction?.productList){
              this.getProductSelectedDatas(this.productAction?.event?.id as string)
            }
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
      this.productsService.creatProduct(requestCreateProduct)
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

  handleSubmitEditProduct(): void{
    if(this.editProductForm.value && this.editProductForm.valid && this.productAction.event.id){
      const requestEditProduct: EditProductResquest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction.event.id,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string
      };
      this.productsService.editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Produto ${requestEditProduct.name} editado com sucesso`,
              life: 3000
            });
          },
          error: (err: HttpErrorResponse) => {
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao editar Produto: ${err.error}`,
              life: 3000
            });
            this.editProductForm.reset();
          },
          complete: () =>{
            this.editProductForm.reset();
          }
        })
    }
  }

  getProductSelectedDatas(id: string): void {
    const allProducts = this.productAction?.productList;

    if(allProducts.length > 0){
      const productFiltered = allProducts.filter(
        (element) => element?.id === id
      );

      if(productFiltered){
        this.productSelectedDatas = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          description: this.productSelectedDatas?.description,
          amount: this.productSelectedDatas?.amount,
          category_id: this.productSelectedDatas?.category?.id
        })
      }
    }
  }

  getProductDatas(): void{
    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) =>{
          if(response.length > 0) {
            this.productList =  response;
            this.productList && this.productDt.setProductDatas(this.productList);
          }
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


