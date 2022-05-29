import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import {IRestaurantItem} from "../entities/restaurant-item/restaurant-item.model";
import {IRestaurantMenu} from "../entities/restaurant-menu/restaurant-menu.model";
import {RestaurantItemService} from "../entities/restaurant-item/service/restaurant-item.service";
import {RestaurantMenuService} from "../entities/restaurant-menu/service/restaurant-menu.service";
import {HttpResponse} from "@angular/common/http";
import {RestaurantOrderService} from "../entities/restaurant-order/service/restaurant-order.service";
import {IRestaurantOrder, RestaurantOrder} from "../entities/restaurant-order/restaurant-order.model";
import {User} from "../admin/user-management/user-management.model";
import {UserManagementService} from "../admin/user-management/service/user-management.service";

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  restaurantItems?: IRestaurantItem[];
  restaurantMenus?: IRestaurantMenu[];
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private userManagementService: UserManagementService,
    private restaurantItemService: RestaurantItemService,
    private restaurantMenuService: RestaurantMenuService,
    private restaurantOrderService: RestaurantOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.restaurantItemService.query().subscribe({
      next: (res: HttpResponse<IRestaurantItem[]>) => {
        this.restaurantItems = res.body ?? [];
      }
    });

    this.restaurantMenuService.query().subscribe({
      next: (res: HttpResponse<IRestaurantMenu[]>) => {
        this.restaurantMenus = res.body ?? [];
      }
    });

  }

  addToCart(restaurantItem: IRestaurantItem): void {
    this.isLoading = true;

    const restaurantOrders: IRestaurantOrder[] = JSON.parse(localStorage.getItem('restaurantOrders')!) ?? [];
    if (restaurantOrders.length === 0) {
      const restaurantOrder :IRestaurantOrder = new RestaurantOrder();
      restaurantOrder.item = restaurantItem;
      restaurantOrder.quantity = 1;
      restaurantOrder.total = restaurantItem.price;
      restaurantOrders.push(restaurantOrder);
    } else {
      for (const order of restaurantOrders) {
        if (order.item!.id === restaurantItem.id) {
          order.quantity!++;
          order.total = order.quantity! * order.item!.price! - order.item!.itemDiscount!;
          this.isLoading = false;
        }
      }
      if (this.isLoading) {
        const restaurantOrder :IRestaurantOrder = new RestaurantOrder();
        restaurantOrder.item = restaurantItem;
        restaurantOrder.quantity = 1;
        restaurantOrder.total = restaurantItem.price;
        restaurantOrders.push(restaurantOrder);
      }
    }
    this.isLoading = false;
    localStorage.setItem('restaurantOrders', JSON.stringify(restaurantOrders));

    this.router.navigate(['/cart']);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
