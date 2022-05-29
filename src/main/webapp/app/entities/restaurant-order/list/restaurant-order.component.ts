import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurantOrder } from '../restaurant-order.model';
import { RestaurantOrderService } from '../service/restaurant-order.service';
import { RestaurantOrderDeleteDialogComponent } from '../delete/restaurant-order-delete-dialog.component';

@Component({
  selector: 'jhi-restaurant-order',
  templateUrl: './restaurant-order.component.html',
})
export class RestaurantOrderComponent implements OnInit {
  restaurantOrders?: IRestaurantOrder[];
  isLoading = false;

  constructor(protected restaurantOrderService: RestaurantOrderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.restaurantOrderService.query().subscribe({
      next: (res: HttpResponse<IRestaurantOrder[]>) => {
        this.isLoading = false;
        this.restaurantOrders = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IRestaurantOrder): number {
    return item.id!;
  }

  delete(restaurantOrder: IRestaurantOrder): void {
    const modalRef = this.modalService.open(RestaurantOrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.restaurantOrder = restaurantOrder;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
