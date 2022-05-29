import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RestaurantOrderService } from '../service/restaurant-order.service';

import { RestaurantOrderComponent } from './restaurant-order.component';

describe('RestaurantOrder Management Component', () => {
  let comp: RestaurantOrderComponent;
  let fixture: ComponentFixture<RestaurantOrderComponent>;
  let service: RestaurantOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RestaurantOrderComponent],
    })
      .overrideTemplate(RestaurantOrderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RestaurantOrderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RestaurantOrderService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.restaurantOrders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
