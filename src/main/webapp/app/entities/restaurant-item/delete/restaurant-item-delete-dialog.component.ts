import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurantItem } from '../restaurant-item.model';
import { RestaurantItemService } from '../service/restaurant-item.service';

@Component({
  templateUrl: './restaurant-item-delete-dialog.component.html',
})
export class RestaurantItemDeleteDialogComponent {
  restaurantItem?: IRestaurantItem;

  constructor(protected restaurantItemService: RestaurantItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.restaurantItemService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
