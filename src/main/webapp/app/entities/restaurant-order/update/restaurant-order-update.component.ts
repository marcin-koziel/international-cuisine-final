import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRestaurantOrder, RestaurantOrder } from '../restaurant-order.model';
import { RestaurantOrderService } from '../service/restaurant-order.service';
import { IRestaurantItem } from 'app/entities/restaurant-item/restaurant-item.model';
import { RestaurantItemService } from 'app/entities/restaurant-item/service/restaurant-item.service';
import { ITransaction } from 'app/entities/transaction/transaction.model';
import { TransactionService } from 'app/entities/transaction/service/transaction.service';

@Component({
  selector: 'jhi-restaurant-order-update',
  templateUrl: './restaurant-order-update.component.html',
})
export class RestaurantOrderUpdateComponent implements OnInit {
  isSaving = false;

  itemsCollection: IRestaurantItem[] = [];
  transactionsSharedCollection: ITransaction[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    total: [],
    item: [],
    transaction: [],
  });

  constructor(
    protected restaurantOrderService: RestaurantOrderService,
    protected restaurantItemService: RestaurantItemService,
    protected transactionService: TransactionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurantOrder }) => {
      this.updateForm(restaurantOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const restaurantOrder = this.createFromForm();
    if (restaurantOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.restaurantOrderService.update(restaurantOrder));
    } else {
      this.subscribeToSaveResponse(this.restaurantOrderService.create(restaurantOrder));
    }
  }

  trackRestaurantItemById(_index: number, item: IRestaurantItem): number {
    return item.id!;
  }

  trackTransactionById(_index: number, item: ITransaction): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRestaurantOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(restaurantOrder: IRestaurantOrder): void {
    this.editForm.patchValue({
      id: restaurantOrder.id,
      quantity: restaurantOrder.quantity,
      total: restaurantOrder.total,
      item: restaurantOrder.item,
      transaction: restaurantOrder.transaction,
    });

    this.itemsCollection = this.restaurantItemService.addRestaurantItemToCollectionIfMissing(this.itemsCollection, restaurantOrder.item);
    this.transactionsSharedCollection = this.transactionService.addTransactionToCollectionIfMissing(
      this.transactionsSharedCollection,
      restaurantOrder.transaction
    );
  }

  protected loadRelationshipsOptions(): void {
    this.restaurantItemService
      .query({ filter: 'restaurantorder-is-null' })
      .pipe(map((res: HttpResponse<IRestaurantItem[]>) => res.body ?? []))
      .pipe(
        map((restaurantItems: IRestaurantItem[]) =>
          this.restaurantItemService.addRestaurantItemToCollectionIfMissing(restaurantItems, this.editForm.get('item')!.value)
        )
      )
      .subscribe((restaurantItems: IRestaurantItem[]) => (this.itemsCollection = restaurantItems));

    this.transactionService
      .query()
      .pipe(map((res: HttpResponse<ITransaction[]>) => res.body ?? []))
      .pipe(
        map((transactions: ITransaction[]) =>
          this.transactionService.addTransactionToCollectionIfMissing(transactions, this.editForm.get('transaction')!.value)
        )
      )
      .subscribe((transactions: ITransaction[]) => (this.transactionsSharedCollection = transactions));
  }

  protected createFromForm(): IRestaurantOrder {
    return {
      ...new RestaurantOrder(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      total: this.editForm.get(['total'])!.value,
      item: this.editForm.get(['item'])!.value,
      transaction: this.editForm.get(['transaction'])!.value,
    };
  }
}
