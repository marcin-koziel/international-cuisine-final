import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurantOrder } from '../restaurant-order.model';
import { RestaurantOrderService } from '../service/restaurant-order.service';

@Component({
  templateUrl: './restaurant-order-delete-dialog.component.html',
})
export class RestaurantOrderDeleteDialogComponent {
  restaurantOrder?: IRestaurantOrder;

  constructor(protected restaurantOrderService: RestaurantOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.restaurantOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
