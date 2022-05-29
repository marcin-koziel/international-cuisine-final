import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RestaurantOrderComponent } from './list/restaurant-order.component';
import { RestaurantOrderDetailComponent } from './detail/restaurant-order-detail.component';
import { RestaurantOrderUpdateComponent } from './update/restaurant-order-update.component';
import { RestaurantOrderDeleteDialogComponent } from './delete/restaurant-order-delete-dialog.component';
import { RestaurantOrderRoutingModule } from './route/restaurant-order-routing.module';

@NgModule({
  imports: [SharedModule, RestaurantOrderRoutingModule],
  declarations: [
    RestaurantOrderComponent,
    RestaurantOrderDetailComponent,
    RestaurantOrderUpdateComponent,
    RestaurantOrderDeleteDialogComponent,
  ],
  entryComponents: [RestaurantOrderDeleteDialogComponent],
})
export class RestaurantOrderModule {}
