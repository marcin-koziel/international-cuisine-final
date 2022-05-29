import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurantMenu } from '../restaurant-menu.model';
import { RestaurantMenuService } from '../service/restaurant-menu.service';

@Component({
  templateUrl: './restaurant-menu-delete-dialog.component.html',
})
export class RestaurantMenuDeleteDialogComponent {
  restaurantMenu?: IRestaurantMenu;

  constructor(protected restaurantMenuService: RestaurantMenuService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.restaurantMenuService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
