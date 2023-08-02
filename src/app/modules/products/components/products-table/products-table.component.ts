import { ProductEvent } from './../../../../models/enums/Products-event';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventAction } from 'src/app/models/interfaces/event/event-action';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {

  @Input() products: GetAllProductsResponse[] = [];
  @Output() ProductEvent = new EventEmitter<EventAction>();

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void{
    if(action && action !== ''){
      const productEventData = id && id !== ''? { action, id } : { action };
      /* EMITIR VALOR DO EVENTO */
      this.ProductEvent.emit(productEventData)
    }
  }
}
