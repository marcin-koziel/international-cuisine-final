import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RestaurantMenuService } from '../service/restaurant-menu.service';

import { RestaurantMenuComponent } from './restaurant-menu.component';

describe('RestaurantMenu Management Component', () => {
  let comp: RestaurantMenuComponent;
  let fixture: ComponentFixture<RestaurantMenuComponent>;
  let service: RestaurantMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RestaurantMenuComponent],
    })
      .overrideTemplate(RestaurantMenuComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RestaurantMenuComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RestaurantMenuService);

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
    expect(comp.restaurantMenus?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
