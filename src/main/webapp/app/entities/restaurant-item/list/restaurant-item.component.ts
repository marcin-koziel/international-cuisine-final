import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurantItem } from '../restaurant-item.model';
import { RestaurantItemService } from '../service/restaurant-item.service';
import { RestaurantItemDeleteDialogComponent } from '../delete/restaurant-item-delete-dialog.component';

@Component({
  selector: 'jhi-restaurant-item',
  templateUrl: './restaurant-item.component.html',
})
export class RestaurantItemComponent implements OnInit {
  restaurantItems?: IRestaurantItem[];
  isLoading = false;

  constructor(protected restaurantItemService: RestaurantItemService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.restaurantItemService.query().subscribe({
      next: (res: HttpResponse<IRestaurantItem[]>) => {
        this.isLoading = false;
        this.restaurantItems = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IRestaurantItem): number {
    return item.id!;
  }

  delete(restaurantItem: IRestaurantItem): void {
    const modalRef = this.modalService.open(RestaurantItemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.restaurantItem = restaurantItem;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
