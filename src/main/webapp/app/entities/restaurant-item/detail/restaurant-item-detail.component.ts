import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRestaurantItem } from '../restaurant-item.model';

@Component({
  selector: 'jhi-restaurant-item-detail',
  templateUrl: './restaurant-item-detail.component.html',
})
export class RestaurantItemDetailComponent implements OnInit {
  restaurantItem: IRestaurantItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurantItem }) => {
      this.restaurantItem = restaurantItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
