import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RestaurantOrderComponent } from '../list/restaurant-order.component';
import { RestaurantOrderDetailComponent } from '../detail/restaurant-order-detail.component';
import { RestaurantOrderUpdateComponent } from '../update/restaurant-order-update.component';
import { RestaurantOrderRoutingResolveService } from './restaurant-order-routing-resolve.service';

const restaurantOrderRoute: Routes = [
  {
    path: '',
    component: RestaurantOrderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RestaurantOrderDetailComponent,
    resolve: {
      restaurantOrder: RestaurantOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RestaurantOrderUpdateComponent,
    resolve: {
      restaurantOrder: RestaurantOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RestaurantOrderUpdateComponent,
    resolve: {
      restaurantOrder: RestaurantOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(restaurantOrderRoute)],
  exports: [RouterModule],
})
export class RestaurantOrderRoutingModule {}
