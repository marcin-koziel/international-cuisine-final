import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRestaurantOrder, RestaurantOrder } from '../restaurant-order.model';

import { RestaurantOrderService } from './restaurant-order.service';

describe('RestaurantOrder Service', () => {
  let service: RestaurantOrderService;
  let httpMock: HttpTestingController;
  let elemDefault: IRestaurantOrder;
  let expectedResult: IRestaurantOrder | IRestaurantOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RestaurantOrderService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      quantity: 0,
      total: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a RestaurantOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new RestaurantOrder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RestaurantOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantity: 1,
          total: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RestaurantOrder', () => {
      const patchObject = Object.assign({}, new RestaurantOrder());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RestaurantOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantity: 1,
          total: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a RestaurantOrder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRestaurantOrderToCollectionIfMissing', () => {
      it('should add a RestaurantOrder to an empty array', () => {
        const restaurantOrder: IRestaurantOrder = { id: 123 };
        expectedResult = service.addRestaurantOrderToCollectionIfMissing([], restaurantOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(restaurantOrder);
      });

      it('should not add a RestaurantOrder to an array that contains it', () => {
        const restaurantOrder: IRestaurantOrder = { id: 123 };
        const restaurantOrderCollection: IRestaurantOrder[] = [
          {
            ...restaurantOrder,
          },
          { id: 456 },
        ];
        expectedResult = service.addRestaurantOrderToCollectionIfMissing(restaurantOrderCollection, restaurantOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RestaurantOrder to an array that doesn't contain it", () => {
        const restaurantOrder: IRestaurantOrder = { id: 123 };
        const restaurantOrderCollection: IRestaurantOrder[] = [{ id: 456 }];
        expectedResult = service.addRestaurantOrderToCollectionIfMissing(restaurantOrderCollection, restaurantOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(restaurantOrder);
      });

      it('should add only unique RestaurantOrder to an array', () => {
        const restaurantOrderArray: IRestaurantOrder[] = [{ id: 123 }, { id: 456 }, { id: 98977 }];
        const restaurantOrderCollection: IRestaurantOrder[] = [{ id: 123 }];
        expectedResult = service.addRestaurantOrderToCollectionIfMissing(restaurantOrderCollection, ...restaurantOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const restaurantOrder: IRestaurantOrder = { id: 123 };
        const restaurantOrder2: IRestaurantOrder = { id: 456 };
        expectedResult = service.addRestaurantOrderToCollectionIfMissing([], restaurantOrder, restaurantOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(restaurantOrder);
        expect(expectedResult).toContain(restaurantOrder2);
      });

      it('should accept null and undefined values', () => {
        const restaurantOrder: IRestaurantOrder = { id: 123 };
        expectedResult = service.addRestaurantOrderToCollectionIfMissing([], null, restaurantOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(restaurantOrder);
      });

      it('should return initial array if no RestaurantOrder is added', () => {
        const restaurantOrderCollection: IRestaurantOrder[] = [{ id: 123 }];
        expectedResult = service.addRestaurantOrderToCollectionIfMissing(restaurantOrderCollection, undefined, null);
        expect(expectedResult).toEqual(restaurantOrderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
