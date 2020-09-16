import { Component, OnInit } from '@angular/core';
import { CensoService } from '../../../../services/censo.service';
import { StoreService } from "../../../../services/store.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-recibidas',
  templateUrl: './recibidas.component.html',
  styleUrls: ['./recibidas.component.css']
})
export class RecibidasComponent implements OnInit {
  
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

  mostrarTable(page:number, cod_audi:string){
    this._storeServises.loading = true
    this._CensoService.devoluciones(page, cod_audi, this._storeServises.dataSession[0]["cod_usua"]).subscribe(
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

  revisar(cod_audi:string){
    this._router.navigateByUrl('/dashboard/objeciones/revision?cod_audi='+cod_audi)
  }

}
