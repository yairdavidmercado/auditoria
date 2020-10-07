import { Component, OnInit } from '@angular/core';
import { CensoService } from '../../../services/censo.service';
import { StoreService } from "../../../services/store.service";
import { Router } from '@angular/router';
declare var sweetAlert:any
@Component({
  selector: 'app-censo',
  templateUrl: './censo.component.html',
  styleUrls: ['./censo.component.css']
})
export class CensoComponent implements OnInit {
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
    this._CensoService.censo(page, admision, this._storeServises.dataSession[0]["perfil"]).subscribe(
      resp => [
        this.dataCenso = resp,
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

  // confirmar(){
  //   this._storeServises.Confirm('hola', 'como estas', 'warning', true, true, 'ok')
  // }
  
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

  iniciarAuditoria(cod_admi:string, cod_audi:string, estado:string){
    this._router.navigateByUrl('/dashboard/form?cod_admi='+cod_admi+'&cod_audi='+cod_audi+'&estado='+estado)
  }

  imprimirAuditoria(cod_admi:string, perfil:string, cod_audi:string){
    window.open(this._storeServises.baseUrl+'/AppToolsAPI/reports/admin.php?codigo=1&cod_admi='+cod_admi+'&perfil='+perfil+'&cod_audi='+cod_audi)
  }

}
