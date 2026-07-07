import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsByDepartmentComponent } from './tickets-by-department.component';

describe('TicketsByDepartmentComponent', () => {
  let component: TicketsByDepartmentComponent;
  let fixture: ComponentFixture<TicketsByDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsByDepartmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketsByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
