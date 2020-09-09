import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.css']
})
export class MenuLeftComponent implements OnInit {
  modalRef: BsModalRef;
  buscarAdmision:string = '';
  config = {
    backdrop: true,
    ignoreBackdropClick: false,
    class: 'modal-sm'
  }
  constructor(
    private modalService: BsModalService,
    private _router: Router
  ) { }

  openModal(template: TemplateRef<any>) {
    this._router.navigateByUrl('/dashboard/censo')
    this.modalRef = this.modalService.show(template, this.config);
  }
  auditar_paciente(){
    this._router.navigateByUrl('/dashboard/form?cod_admi='+this.buscarAdmision+'&cod_audi=0')
  }

  ngOnInit(): void {
  }

}
