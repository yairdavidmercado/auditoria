import { Component, OnInit } from '@angular/core';
import { CensoService } from '../../../services/censo.service';
import { StoreService } from "../../../services/store.service";
import { Router } from '@angular/router';
declare var sweetAlert:any
@Component({
  selector: 'app-auditado',
  templateUrl: './auditado.component.html',
  styleUrls: ['./auditado.component.css']
})
export class AuditadoComponent implements OnInit {
  isCollapsed = -1;
  dataCenso:any[] = []
  detailAdmision:any[] = []
  admision:string = ''
  perfil:string = this._storeServises.dataSession[0]["perfil"]
  textBuscar:string = ''
  currentPage = 4;
  totalRows = 0;
  page: number = 1;
  constructor(
    private _CensoService: CensoService,
    private _router: Router, 
    public _storeServises: StoreService
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.mostrarTable(1, this.textBuscar)
    });
  }

  
  pageChanged(event: any): void {
    this.page = event.page;
    this.mostrarTable(event.page, this.textBuscar)
  }

  buscarEnTabla(){
    this.mostrarTable(this.page, this.textBuscar)
  }

  mostrarTable(page:number, admision:string){
    this._storeServises.loading = true
    this._CensoService.auditados(page, admision, this._storeServises.dataSession[0]["perfil"]).subscribe(
      resp => [
        this.dataCenso = resp,
        console.log(resp),
        this.totalRows = resp['data'][0]['totalrows'],
        console.log(resp)
      ], 
      err => [
        this.dataCenso = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }
  
  detailCenso(id:string){
    this.admision = ''
    this.admision = id
    let params = {
      codigo : '1',
      parametro : id,
      parametro2 : this._storeServises.dataSession[0]["perfil"]
    }

    this._CensoService.detailAdmision(params).subscribe(
      resp => [
        this.detailAdmision = resp["resultado"],
        console.log(resp)
      ], 
      err => [
        this.detailAdmision = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
    
  }

  iniciarAuditoria(cod_admi:string, cod_audi:string){
    this._router.navigateByUrl('/dashboard/form?cod_admi='+cod_admi+'&cod_audi='+cod_audi)

  }

  imprimirAuditoria(codigo:string, cod_admi:string, perfil:string, cod_audi:string){
    if (codigo == '1') {
      window.open(this._storeServises.baseUrl+'/AppToolsAPI/reports/hallazgo.php?codigo=1&cod_admi='+cod_admi+'&perfil='+perfil+'&cod_audi='+cod_audi)
    }else if (codigo == '2') {
      window.open(this._storeServises.baseUrl+'/AppToolsAPI/reports/admin.php?codigo=1&cod_admi='+cod_admi+'&perfil='+perfil+'&cod_audi='+cod_audi)
    }
  }

}
