import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { StoreService } from "../../../services/store.service";
import { UsuarioService } from "../../../services/usuario.service";
import { ActivatedRoute ,Router } from '@angular/router';
declare var $:any
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  
  dataForm:any[] = []
  datall:any[] = []
  idValidation = ''
  dataPaciente:any[] = []
  cod_admi:string = this._route.snapshot.queryParamMap.get('cod_admi')
  cod_audi:string = this._route.snapshot.queryParamMap.get('cod_audi')
  constructor(
    private _FormService: FormService,
    private _router: Router,
    private _route: ActivatedRoute, 
    public _storeServises: StoreService,
    private _usuarioServises: UsuarioService
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.iniciarAuditoria()
    });
  }
  
  verificarRespuesta(){
    for (let i = 0; i < this.datall.length; i++) {
      if(this.datall[i]["clase"] == 'form-group clearfix') {
        //alert($("input[name='radio"+this.datall[i]["id"]+"']:checked").val())
        this.verificargroup(this.datall[i]["id"])
      }
    }
  }

  verificargroup(id:string){
    for (let i = 0; i < this.datall.length; i++) {
      if(this.datall[i]["dependencia"] == id) {
        if(this.datall[i]["clase"] == 'icheck-primary d-inline') {
          this.verificarCheck(this.datall[i]["id"], id)
        }
      }
    }
  }

  verificarCheck(id:string, id2:string){
    let valor:string = '';
    for (let i = 0; i < this.datall.length; i++) {
      if(this.datall[i]["dependencia"] == id) {
        valor += this.datall[i]["respuesta"]
      }
    }
    if (valor.length == 0) {
      this.idValidation = id2
      //alert(this.idValidation) 
    }
  }

  terminarAuditoria(){
    this.verificarRespuesta()
    if (this.idValidation.length > 0) {
      //alert(this.idValidation)
      if (document.getElementById(this.idValidation) != null) {
        let el = document.getElementById(this.idValidation);
        el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        this.idValidation = ''
        this._storeServises.Notifications("Existen campos sin seleccionar", false) 
      } 
    }else{
      alert("hola")
    }
  }

  formulario(id_auditoria:string = '0'){
    let params = {
      codigo: "1",
      parametro : this._storeServises.dataSession[0]["perfil"],
      cod_admi : this.cod_admi,
      cod_audi : id_auditoria
    }
    this._storeServises.loading = true
    this._FormService.formulario(params).subscribe(
      resp => [
        this.dataForm = resp["data"],
        this.datall = resp["datall"],
        console.log(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false,
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  traer_validaciones(id_auditoria:string = '0'){
    let params = {
      codigo: "1",
      parametro : this._storeServises.dataSession[0]["perfil"],
      cod_admi : this.cod_admi,
      cod_audi : id_auditoria
    }
    //this._storeServises.loading = true
    this._FormService.formulario(params).subscribe(
      resp => [
        this.datall = resp["datall"],
        console.log(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        //this._storeServises.loading = false,
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  infoPacienteBasic(){
    let params = {
      codigo: "1",
      parametro : this.cod_admi
    }
    this._storeServises.loading = true
    this._usuarioServises.info_paciente(params).subscribe(
      resp => [
        this.dataPaciente = resp["resultado"][0],
        console.log(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false,
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  infoPaciente(){
    let params = {
      codigo: "1",
      parametro : this.cod_admi
    }
    this._storeServises.loading = true
    this._usuarioServises.info_paciente(params).subscribe(
      resp => [
        this.dataPaciente = resp["resultado"][0],
        this.crearAuditoria(),
        console.log(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false,
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  iniciarAuditoria(){
    if (this.cod_audi.length == 0) {
      this.cod_audi = '0'
    }
    if (this.cod_audi == '0') {
      this.infoPaciente()
    }else{
      this.infoPacienteBasic()
      this.formulario(this.cod_audi)
    }
  }

  guardarRespuesta(codigo:string, id_control:string, id_resp:string, dependencia:string){
    if (id_resp.length == 0) {
      return false
    }
    this.traer_validaciones(this.cod_audi)
    let params = {
      codigo : codigo,
      cod_audi : this.cod_audi,                     
 		  id_control : id_control,                   
      id_resp : id_resp,
      dependencia : dependencia,                      
      cod_usua : this._storeServises.dataSession[0]["cod_usua"],                     
    }
    //this._storeServises.loading = true
    this._FormService.guardarRespuesta(params).subscribe(
      resp => [
        console.log(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false,
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  crearAuditoria(){
    let params = {
      cod_admi: this.dataPaciente['cod_admi'],
 		  cod_usua: this._storeServises.dataSession[0]["cod_usua"],
      servicio: this.dataPaciente['servicio_actual'],
      eps: this.dataPaciente['aseguradora'],
      cama: this.dataPaciente['cama'],
      perfil: this._storeServises.dataSession[0]["perfil"],
    }
    this._storeServises.loading = true
    this._FormService.crearAuditoria(params).subscribe(
      resp => [
        this.cod_audi = resp["message"],
        this.formulario(this.cod_audi),
        console.log(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false,
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  imprimir(tipo:string){
    if (tipo == '1') {
      window.open(this._storeServises.baseUrl+'/AppToolsAPI/reports/admin.php?codigo=1&cod_admi='+this.cod_admi+'&perfil='+this._storeServises.dataSession[0]["perfil"]+'&cod_audi='+this.cod_audi, '_blank');
    }else if (tipo == '2') {
      window.open(this._storeServises.baseUrl+'/AppToolsAPI/reports/hallazgo.php?codigo=1&cod_admi='+this.cod_admi+'&perfil='+this._storeServises.dataSession[0]["perfil"]+'&cod_audi='+this.cod_audi, '_blank');
    }
  }

}
