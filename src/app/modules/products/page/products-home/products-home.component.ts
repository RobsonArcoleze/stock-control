import { Route, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
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
    private msg: MessageService
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
