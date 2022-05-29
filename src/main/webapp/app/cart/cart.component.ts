import {Component, OnDestroy, OnInit} from '@angular/core';
import {Account} from "../core/auth/account.model";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {AccountService} from "../core/auth/account.service";
import {RestaurantItemService} from "../entities/restaurant-item/service/restaurant-item.service";
import {RestaurantOrderService} from "../entities/restaurant-order/service/restaurant-order.service";
import {IRestaurantOrder, RestaurantOrder} from "../entities/restaurant-order/restaurant-order.model";
import {TransactionService} from "../entities/transaction/service/transaction.service";
import {ITransaction, Transaction} from "../entities/transaction/transaction.model";
import {UserManagementService} from "../admin/user-management/service/user-management.service";
import jsPDF from "jspdf";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  account: Account | null = null;
  restaurantOrders: IRestaurantOrder[] = [];

  membershipDiscountPercent = 0.2;

  isLoading = false;
  creditCard = "0000 0000 0000 0000";
  paymentSuccessful = false;

  total = 0.00;
  subTotal = 0.00;
  tax = 0.00;
  itemsDiscount = 0.00;
  membershipDiscount = 0.00;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private restaurantItemService: RestaurantItemService,
    private restaurantOrderService: RestaurantOrderService,
    private transactionService: TransactionService,
    private userManagementService: UserManagementService
  ) { }

  ngOnInit(): void {
    // this.creditCard = "test";
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    // read restaurantOrders from localStorage
    this.restaurantOrders = JSON.parse(localStorage.getItem('restaurantOrders')!);

    this.calculateTotal();
  }

  removeOrder(id: number): void {
    this.restaurantOrders = this.restaurantOrders.filter(order => order.item!.id !== id);
    localStorage.setItem('restaurantOrders', JSON.stringify(this.restaurantOrders));
    this.calculateTotal();
  }

  decreaseOrderQuantity(id: number): void {
    for (const order of this.restaurantOrders) {
      if (order.item!.id === id) {
        if (order.quantity! > 1) {
          order.quantity!--;
          order.total = order.quantity! * order.item!.price! - order.item!.itemDiscount!;
          localStorage.setItem('restaurantOrders', JSON.stringify(this.restaurantOrders));
          this.calculateTotal();
        } else {
          this.removeOrder(id);
        }
      }
    }
  }

  increaseOrderQuantity(id: number): void {
    for (const order of this.restaurantOrders) {
      if (order.item!.id === id) {
        order.quantity!++;
        order.total = order.quantity! * order.item!.price! - order.item!.itemDiscount!;
        localStorage.setItem('restaurantOrders', JSON.stringify(this.restaurantOrders));
        this.calculateTotal();
      }
    }
  }

  calculateTotal(): void {
    this.subTotal = 0.00;
    this.tax = 0.00;
    this.itemsDiscount = 0.00;
    this.membershipDiscount = 0.00;
    this.total = 0.00;

    for (const order of this.restaurantOrders) {
      this.subTotal += order.total!;
      this.itemsDiscount += order.item!.itemDiscount! * order.quantity!;
    }

    this.membershipDiscount = this.subTotal * this.membershipDiscountPercent;

    this.tax = this.subTotal * 0.13;
    this.total = this.subTotal + this.tax - this.itemsDiscount - this.membershipDiscount;
  }

  checkout(): void {
    this.isLoading = true;
    const transaction = new Transaction();
    transaction.total = this.total;
    transaction.subTotal = this.subTotal;
    transaction.tax = this.tax;
    transaction.lastFourDigits = this.creditCard.substr(this.creditCard.length - 4);
    for (const order of this.restaurantOrders) {
      this.restaurantOrderService.create(order)
    }
    this.userManagementService.find(this.account!.login).subscribe(user => {
      transaction.user = user;
      this.transactionService.create(transaction).subscribe(() => {
        this.isLoading = false;
        // this.restaurantOrders = [];
        localStorage.setItem('restaurantOrders', JSON.stringify([]));
        // this.calculateTotal();
        this.paymentSuccessful = true;
      });
    });
  }

  downloadReceipt(): void {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Restaurant Receipt', 10, 10);
    doc.setFontSize(12);
    doc.text('Subtotal: ' + this.subTotal.toString(), 10, 20);
    doc.text('Tax: ' + this.tax.toString(), 10, 30);
    doc.text('Items Discount: ' + this.itemsDiscount.toString(), 10, 40);
    doc.text('Membership Discount: ' + this.membershipDiscount.toString(), 10, 50);
    doc.text('Total: ' + this.total.toString(), 10, 60);
    doc.text('Credit Card: ' + this.creditCard, 10, 70);
    doc.text('Date: ' + new Date().toLocaleDateString(), 10, 80);
    doc.text('Time: ' + new Date().toLocaleTimeString(), 10, 90);
    doc.text('Order:', 10, 150);
    let y = 160;
    for (const order of this.restaurantOrders) {
      doc.text(order.item!.title!.toString() + ' x ' + order.quantity!.toString(), 10, y);
      y += 10;
    }
    doc.save('receipt.pdf');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
