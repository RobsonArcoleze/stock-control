import { Route, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventAction } from 'src/app/models/interfaces/event/event-action';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject();
  public productList: GetAllProductsResponse[] = [];

  constructor(
    private productService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit(): void {
    this.getServiceProductsdata();

  }
  getServiceProductsdata() {
    const productsLoaded = this.productsDtService.getProductsData();

    (productsLoaded.length > 0)? this.productList = productsLoaded
                               : this.getAPIProductsData();
  }

  getAPIProductsData() {
    this.productService.getAllProducts()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.productList = response;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.msg.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao buscar produtos: ${err.error}`,
          life: 3000
        });
      }

    })
  }

  handleProductAction(event: EventAction):void{
    if(event){console.log('Evento recebido: ', event);
    }
  }

  handleDeleteProductAction(event: {product_id: string, productName: string}): void{
    if(event){
      this.confirmationService.confirm({
        message: `Confirma a exclusão do produto ${event.productName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event.product_id)
      })
    }
  }

  deleteProduct(product_id: string) {
    if(product_id){
      this.productService.deleteProduct(product_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response)=> {
          if(response){
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto Removido com sucesso',
              life: 3000
            })
            this.getAPIProductsData();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.msg.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao deletar produto: ${err.error}`,
            life: 3000
          });
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
