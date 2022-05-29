import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRestaurantOrder } from '../restaurant-order.model';

@Component({
  selector: 'jhi-restaurant-order-detail',
  templateUrl: './restaurant-order-detail.component.html',
})
export class RestaurantOrderDetailComponent implements OnInit {
  restaurantOrder: IRestaurantOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurantOrder }) => {
      this.restaurantOrder = restaurantOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
