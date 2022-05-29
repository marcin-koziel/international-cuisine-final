import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRestaurantMenu } from '../restaurant-menu.model';

@Component({
  selector: 'jhi-restaurant-menu-detail',
  templateUrl: './restaurant-menu-detail.component.html',
})
export class RestaurantMenuDetailComponent implements OnInit {
  restaurantMenu: IRestaurantMenu | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurantMenu }) => {
      this.restaurantMenu = restaurantMenu;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
