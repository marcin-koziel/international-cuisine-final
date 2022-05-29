import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RestaurantItemService } from '../service/restaurant-item.service';

import { RestaurantItemComponent } from './restaurant-item.component';

describe('RestaurantItem Management Component', () => {
  let comp: RestaurantItemComponent;
  let fixture: ComponentFixture<RestaurantItemComponent>;
  let service: RestaurantItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RestaurantItemComponent],
    })
      .overrideTemplate(RestaurantItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RestaurantItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RestaurantItemService);

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
    expect(comp.restaurantItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
