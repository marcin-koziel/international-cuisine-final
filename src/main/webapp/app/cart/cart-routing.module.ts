import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactionComponent} from "../entities/transaction/list/transaction.component";
import {UserRouteAccessService} from "../core/auth/user-route-access.service";
import {CartComponent} from "./cart.component";

const routes: Routes = [
  {
    path: '',
    component: CartComponent
    // canActivate: [UserRouteAccessService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
