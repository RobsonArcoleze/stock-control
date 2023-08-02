import { ProductEvent } from './../../../../models/enums/Products-event';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeleteProductAction } from 'src/app/models/interfaces/event/delete-product-action';
import { EventAction } from 'src/app/models/interfaces/event/event-action';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {

  @Input() products: GetAllProductsResponse[] = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void{
    if(action && action !== ''){
      const productEventData = id && id !== ''? { action, id } : { action };
      /* EMITIR VALOR DO EVENTO */
      this.productEvent.emit(productEventData)
    }
  }

  handleDeleteProduct(product_id: string, productName: string): void{
    if(product_id !== '' && productName !== ''){
      this.deleteProductEvent.emit({
        product_id,
        productName
      })
    }
  }
}
