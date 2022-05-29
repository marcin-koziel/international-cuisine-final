import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'restaurant-menu',
        data: { pageTitle: 'internationalCuisineFinalApp.restaurantMenu.home.title' },
        loadChildren: () => import('./restaurant-menu/restaurant-menu.module').then(m => m.RestaurantMenuModule),
      },
      {
        path: 'restaurant-item',
        data: { pageTitle: 'internationalCuisineFinalApp.restaurantItem.home.title' },
        loadChildren: () => import('./restaurant-item/restaurant-item.module').then(m => m.RestaurantItemModule),
      },
      {
        path: 'restaurant-order',
        data: { pageTitle: 'internationalCuisineFinalApp.restaurantOrder.home.title' },
        loadChildren: () => import('./restaurant-order/restaurant-order.module').then(m => m.RestaurantOrderModule),
      },
      {
        path: 'transaction',
        data: { pageTitle: 'internationalCuisineFinalApp.transaction.home.title' },
        loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
