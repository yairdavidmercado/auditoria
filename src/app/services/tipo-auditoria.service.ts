import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root'
})
export class TipoAuditoriaService {

  constructor(
    private _http: HttpClient,
    public _storeServises: StoreService
  ) { }

  tableTipoAuditoria(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/sel_tipoauditoria.php', params)
  }

  
  guardarTipoAuditoria(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/guardar_tipoauditoria.php', params )
  }

  guardarFechasTipoAuditoria(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/guardar_fechas_tipoauditoria.php', params )
  }

  guardarPerfil(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/guardar_perfiles.php', params )
  }
}
