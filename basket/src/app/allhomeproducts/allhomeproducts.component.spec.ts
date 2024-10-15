import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllhomeproductsComponent } from './allhomeproducts.component';

describe('AllhomeproductsComponent', () => {
  let component: AllhomeproductsComponent;
  let fixture: ComponentFixture<AllhomeproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllhomeproductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllhomeproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
