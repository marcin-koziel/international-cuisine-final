import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IRestaurantItem, RestaurantItem } from '../restaurant-item.model';
import { RestaurantItemService } from '../service/restaurant-item.service';

import { RestaurantItemRoutingResolveService } from './restaurant-item-routing-resolve.service';

describe('RestaurantItem routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: RestaurantItemRoutingResolveService;
  let service: RestaurantItemService;
  let resultRestaurantItem: IRestaurantItem | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(RestaurantItemRoutingResolveService);
    service = TestBed.inject(RestaurantItemService);
    resultRestaurantItem = undefined;
  });

  describe('resolve', () => {
    it('should return IRestaurantItem returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRestaurantItem = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRestaurantItem).toEqual({ id: 123 });
    });

    it('should return new IRestaurantItem if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRestaurantItem = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultRestaurantItem).toEqual(new RestaurantItem());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as RestaurantItem })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRestaurantItem = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRestaurantItem).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
