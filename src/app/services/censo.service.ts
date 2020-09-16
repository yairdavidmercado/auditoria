import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root'
})
export class CensoService {

  constructor(
    private _http: HttpClient,
    public _storeServises: StoreService
  ) { }
  censo(page:number, admision:string){
    return this._http.get<any[]>(this._storeServises.baseUrl+'/auditoria_concurrente/php/table_censo.php?page='+page+'&admision='+admision)
  }

  detailAdmision(params:any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/sel_detalle_admision.php', params)
  }

  auditados(page:number, admision:string, perfil:string){
    return this._http.get<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/table_auditado.php?page='+page+'&admision='+admision+'&perfil='+perfil)
  }

  devoluciones(page:number, cod_audi:string, cod_usua:string){
    return this._http.get<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/table_devoluciones.php?page='+page+'&cod_audi='+cod_audi+'&cod_usua='+cod_usua)
  }

  devolucionesRealizadas(page:number, cod_audi:string, cod_usua:string){
    return this._http.get<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/table_devoluciones_realizadas.php?page='+page+'&cod_audi='+cod_audi+'&cod_usua='+cod_usua)
  }

  terminarAuditoria(params:any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/sel_detalle_admision.php', params)
  }
}
