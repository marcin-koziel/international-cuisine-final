import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RestaurantOrderService } from '../service/restaurant-order.service';
import { IRestaurantOrder, RestaurantOrder } from '../restaurant-order.model';
import { IRestaurantItem } from 'app/entities/restaurant-item/restaurant-item.model';
import { RestaurantItemService } from 'app/entities/restaurant-item/service/restaurant-item.service';
import { ITransaction } from 'app/entities/transaction/transaction.model';
import { TransactionService } from 'app/entities/transaction/service/transaction.service';

import { RestaurantOrderUpdateComponent } from './restaurant-order-update.component';

describe('RestaurantOrder Management Update Component', () => {
  let comp: RestaurantOrderUpdateComponent;
  let fixture: ComponentFixture<RestaurantOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let restaurantOrderService: RestaurantOrderService;
  let restaurantItemService: RestaurantItemService;
  let transactionService: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RestaurantOrderUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RestaurantOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RestaurantOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    restaurantOrderService = TestBed.inject(RestaurantOrderService);
    restaurantItemService = TestBed.inject(RestaurantItemService);
    transactionService = TestBed.inject(TransactionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call item query and add missing value', () => {
      const restaurantOrder: IRestaurantOrder = { id: 456 };
      const item: IRestaurantItem = { id: 5935 };
      restaurantOrder.item = item;

      const itemCollection: IRestaurantItem[] = [{ id: 39940 }];
      jest.spyOn(restaurantItemService, 'query').mockReturnValue(of(new HttpResponse({ body: itemCollection })));
      const expectedCollection: IRestaurantItem[] = [item, ...itemCollection];
      jest.spyOn(restaurantItemService, 'addRestaurantItemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ restaurantOrder });
      comp.ngOnInit();

      expect(restaurantItemService.query).toHaveBeenCalled();
      expect(restaurantItemService.addRestaurantItemToCollectionIfMissing).toHaveBeenCalledWith(itemCollection, item);
      expect(comp.itemsCollection).toEqual(expectedCollection);
    });

    it('Should call Transaction query and add missing value', () => {
      const restaurantOrder: IRestaurantOrder = { id: 456 };
      const transaction: ITransaction = { id: 30177 };
      restaurantOrder.transaction = transaction;

      const transactionCollection: ITransaction[] = [{ id: 20816 }];
      jest.spyOn(transactionService, 'query').mockReturnValue(of(new HttpResponse({ body: transactionCollection })));
      const additionalTransactions = [transaction];
      const expectedCollection: ITransaction[] = [...additionalTransactions, ...transactionCollection];
      jest.spyOn(transactionService, 'addTransactionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ restaurantOrder });
      comp.ngOnInit();

      expect(transactionService.query).toHaveBeenCalled();
      expect(transactionService.addTransactionToCollectionIfMissing).toHaveBeenCalledWith(transactionCollection, ...additionalTransactions);
      expect(comp.transactionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const restaurantOrder: IRestaurantOrder = { id: 456 };
      const item: IRestaurantItem = { id: 28512 };
      restaurantOrder.item = item;
      const transaction: ITransaction = { id: 84768 };
      restaurantOrder.transaction = transaction;

      activatedRoute.data = of({ restaurantOrder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(restaurantOrder));
      expect(comp.itemsCollection).toContain(item);
      expect(comp.transactionsSharedCollection).toContain(transaction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantOrder>>();
      const restaurantOrder = { id: 123 };
      jest.spyOn(restaurantOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: restaurantOrder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(restaurantOrderService.update).toHaveBeenCalledWith(restaurantOrder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantOrder>>();
      const restaurantOrder = new RestaurantOrder();
      jest.spyOn(restaurantOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: restaurantOrder }));
      saveSubject.complete();

      // THEN
      expect(restaurantOrderService.create).toHaveBeenCalledWith(restaurantOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantOrder>>();
      const restaurantOrder = { id: 123 };
      jest.spyOn(restaurantOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(restaurantOrderService.update).toHaveBeenCalledWith(restaurantOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRestaurantItemById', () => {
      it('Should return tracked RestaurantItem primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRestaurantItemById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTransactionById', () => {
      it('Should return tracked Transaction primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTransactionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
