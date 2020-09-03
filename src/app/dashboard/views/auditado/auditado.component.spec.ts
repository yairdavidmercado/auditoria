import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditadoComponent } from './auditado.component';

describe('AuditadoComponent', () => {
  let component: AuditadoComponent;
  let fixture: ComponentFixture<AuditadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
