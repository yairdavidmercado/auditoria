import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private _http: HttpClient,
    public _storeServises: StoreService
  ) { }

  formulario(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/sel_formulario.php', params )
  }

  crearControles(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/sel_crear_controles.php', params )
  }

  crearAuditoria(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/guardar_auditoria.php', params )
  }

  guardarRespuesta(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/guardar_respuesta.php', params )
  }
}
