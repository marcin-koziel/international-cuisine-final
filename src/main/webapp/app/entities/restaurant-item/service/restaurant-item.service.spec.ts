import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRestaurantItem, RestaurantItem } from '../restaurant-item.model';

import { RestaurantItemService } from './restaurant-item.service';

describe('RestaurantItem Service', () => {
  let service: RestaurantItemService;
  let httpMock: HttpTestingController;
  let elemDefault: IRestaurantItem;
  let expectedResult: IRestaurantItem | IRestaurantItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RestaurantItemService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      summary: 'AAAAAAA',
      price: 0,
      itemDiscount: 0,
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

    it('should create a RestaurantItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new RestaurantItem()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RestaurantItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          summary: 'BBBBBB',
          price: 1,
          itemDiscount: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RestaurantItem', () => {
      const patchObject = Object.assign(
        {
          summary: 'BBBBBB',
          price: 1,
        },
        new RestaurantItem()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RestaurantItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          summary: 'BBBBBB',
          price: 1,
          itemDiscount: 1,
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

    it('should delete a RestaurantItem', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRestaurantItemToCollectionIfMissing', () => {
      it('should add a RestaurantItem to an empty array', () => {
        const restaurantItem: IRestaurantItem = { id: 123 };
        expectedResult = service.addRestaurantItemToCollectionIfMissing([], restaurantItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(restaurantItem);
      });

      it('should not add a RestaurantItem to an array that contains it', () => {
        const restaurantItem: IRestaurantItem = { id: 123 };
        const restaurantItemCollection: IRestaurantItem[] = [
          {
            ...restaurantItem,
          },
          { id: 456 },
        ];
        expectedResult = service.addRestaurantItemToCollectionIfMissing(restaurantItemCollection, restaurantItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RestaurantItem to an array that doesn't contain it", () => {
        const restaurantItem: IRestaurantItem = { id: 123 };
        const restaurantItemCollection: IRestaurantItem[] = [{ id: 456 }];
        expectedResult = service.addRestaurantItemToCollectionIfMissing(restaurantItemCollection, restaurantItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(restaurantItem);
      });

      it('should add only unique RestaurantItem to an array', () => {
        const restaurantItemArray: IRestaurantItem[] = [{ id: 123 }, { id: 456 }, { id: 80176 }];
        const restaurantItemCollection: IRestaurantItem[] = [{ id: 123 }];
        expectedResult = service.addRestaurantItemToCollectionIfMissing(restaurantItemCollection, ...restaurantItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const restaurantItem: IRestaurantItem = { id: 123 };
        const restaurantItem2: IRestaurantItem = { id: 456 };
        expectedResult = service.addRestaurantItemToCollectionIfMissing([], restaurantItem, restaurantItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(restaurantItem);
        expect(expectedResult).toContain(restaurantItem2);
      });

      it('should accept null and undefined values', () => {
        const restaurantItem: IRestaurantItem = { id: 123 };
        expectedResult = service.addRestaurantItemToCollectionIfMissing([], null, restaurantItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(restaurantItem);
      });

      it('should return initial array if no RestaurantItem is added', () => {
        const restaurantItemCollection: IRestaurantItem[] = [{ id: 123 }];
        expectedResult = service.addRestaurantItemToCollectionIfMissing(restaurantItemCollection, undefined, null);
        expect(expectedResult).toEqual(restaurantItemCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
