import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { StoreService } from "../../../services/store.service";
import { UsuarioService } from "../../../services/usuario.service";
import { CensoService } from "../../../services/censo.service";
import { ActivatedRoute ,Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $:any
declare var sweetAlert:any
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @ViewChild('childModal', { static: false }) childModal: ModalDirective;
  @ViewChild('HallazgoModal', { static: false }) HallazgoModal: ModalDirective;

  modalRef: BsModalRef;
  dataForm:any[] = []
  dataHallazgo:any[] = []
  dataUsuarios:any[] = []
  datall:any[] = []
  idValidation = ''
  finalizado = ''
  terminado = ''
  anulado = ''
  selectedValue = ''
  explicacion:string = ''
  dataPaciente:any[] = []
  cod_admi:string = this._route.snapshot.queryParamMap.get('cod_admi')
  cod_audi:string = this._route.snapshot.queryParamMap.get('cod_audi')

  dataSubForm:any[] = []
  id_dependencia:string = ''
  ValueResp:string = ''
  ValueDependencia:string = ''
  dataSuball:any[] = []
  constructor(
    private _FormService: FormService,
    private _router: Router,
    private _route: ActivatedRoute, 
    public _storeServises: StoreService,
    private _usuarioServises: UsuarioService,
    private _censoService: CensoService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.validarNueva(),
      this.mostrarUsuarios()
    });

    $('.select2').select2()

    //Initialize Select2 Elements
    $('.select2bs4').select2({
      theme: 'bootstrap4'
    })

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModal2(template2: TemplateRef<any>) {
    this.hallazgo(this.cod_audi)
    this.modalRef = this.modalService.show(template2,
      Object.assign({}, { class: 'gray modal-lg'}));
  }

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
    this.formulario(this.cod_audi)
  }

  showHallazgoModal(): void {
    this.HallazgoModal.show();
  }

  hideHallazgoModal(): void {
    this.HallazgoModal.hide();
  }

  anular(){

    if (this.explicacion.trim().length < 100) {
      sweetAlert("Su explicación solo tiene "+this.explicacion.trim().length+" caracteres, recuerde que debe superar los 100 caracteres para poder continuar.")
      return false;
    }

    sweetAlert({
      title: "Advertencia!",
      text: "¿Estas seguro que deseas anular la auditoría N° "+this.cod_audi+" ?",
      icon: "danger",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.anularAuditoria()
      } else {
        // sweetAlert("Your imaginary file is safe!");
      }
    });
  }

  justificar(id:string,  text:string,  tipo:string){
    if (this.explicacion.trim().length < 150) {
      sweetAlert("Su justificación solo tiene "+this.explicacion.trim().length+" caracteres, recuerde que debe superar los 150 caracteres para poder continuar.")
      return false;
    }

    let params = {
      cod_audi : this.cod_audi,
      id_componente : id,
      observacion : text,
      cod_crea : this._storeServises.dataSession[0]["cod_usua"],
      perfil : this._storeServises.dataSession[0]["perfil"],
      tipo : tipo,
    }
    this._storeServises.loading = true
    this._FormService.guardarjustificacion(params).subscribe(
      resp => [
        this.hallazgo(this.cod_audi),
        console.log(resp),
        this.explicacion = ''
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

  finalizar(){

    sweetAlert({
      title: "Advertencia!",
      text: "¿Estas seguro que deseas finalizar la auditoría N° "+this.cod_audi+" ?",
      icon: "danger",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.finalizarAuditoria()
      } else {
        // sweetAlert("Your imaginary file is safe!");
      }
    });
  }

  guardarDevolucion(){

    let params = {
      cod_usua : this._storeServises.dataSession[0]["cod_usua"],
      cod_crea : this.selectedValue,
      perfil : this._storeServises.dataSession[0]["perfil"],
      cod_audi : this.cod_audi
    }
    this._storeServises.loading = true
    this._FormService.guardarDevoluciones(params).subscribe(
      resp => [
        window.open(this._storeServises.baseUrl+'/AppToolsAPI/reports/hallazgo.php?codigo=1&cod_admi='+this.cod_admi+'&perfil='+this._storeServises.dataSession[0]["perfil"]+'&cod_audi='+this.cod_audi, '_blank'),
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

  finalizarAuditoria(){

    let params = {
      codigo: "4",
      parametro : this.cod_audi,
      cod_admi : this.cod_admi,
      parametro2 : this._storeServises.dataSession[0]["perfil"],
      comentario : this.explicacion,
      cod_usua : this._storeServises.dataSession[0]["cod_usua"]
    }
    this._storeServises.loading = true
    this._censoService.terminarAuditoria(params).subscribe(
      resp => [
        sweetAlert("La auditoría N° "+this.cod_audi+" ha sido finalizada satisfactoriamente."),
        this.modalRef.hide(),
        this._router.navigateByUrl('/dashboard/form?cod_admi='+this.cod_admi+'&cod_audi='+this.cod_audi),
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

  anularAuditoria(){

    let params = {
      codigo: "3",
      parametro : this.cod_audi,
      parametro2 : this._storeServises.dataSession[0]["perfil"],
      comentario : this.explicacion,
      cod_usua : this._storeServises.dataSession[0]["cod_usua"]
    }
    this._storeServises.loading = true
    this._censoService.terminarAuditoria(params).subscribe(
      resp => [
        sweetAlert("La auditoría N° "+this.cod_audi+" ha sido anulada satisfactoriamente."),
        this.modalRef.hide(),
        this._router.navigateByUrl('/dashboard/form?cod_admi='+this.cod_admi+'&cod_audi='+this.cod_audi),
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
        console.log(el)
        el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        this.idValidation = ''
        this._storeServises.Notifications("Existen campos sin seleccionar", false) 
      } 
    }else{
      sweetAlert({
        title: "Advertencia!",
        text: "¿Estas seguro que deseas terminar la auditoría ?",
        // icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this.actualizarAuditoria(this.cod_audi)
        } else {
          // sweetAlert("Your imaginary file is safe!");
        }
      });
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
        this.finalizado = resp["data"][0]["finalizado"],
        this.terminado = resp["data"][0]["terminado"], 
        this.anulado = resp["data"][0]["anulado"], 
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

  hallazgo(id_auditoria:string = '0'){
    let params = {
      codigo: "8",
      parametro : this._storeServises.dataSession[0]["perfil"],
      cod_admi : this.cod_admi,
      cod_audi : id_auditoria
    }
    this._storeServises.loading = true
    this._FormService.formulario(params).subscribe(
      resp => [
        this.dataHallazgo = resp['resultado'],
        console.log(resp)
      ], 
      err => [
        this.dataHallazgo = [],
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

  actualizarAuditoria(id_auditoria:string = '0'){
    let params = {
      codigo: "2",
      parametro : id_auditoria,
      parametro2 : this._storeServises.dataSession[0]["perfil"]
    }
    this._storeServises.loading = true
    this._censoService.terminarAuditoria(params).subscribe(
      resp => [
        sweetAlert("La auditoría N° "+this.cod_audi+" fue terminada exitosamente."),
        this._router.navigateByUrl('/dashboard/form?cod_admi='+this.cod_admi+'&cod_audi='+this.cod_audi),
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
        this.dataPaciente = resp["data"][0],
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
        this.dataPaciente = resp["data"][0],
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

  validarNueva(id_auditoria:string = '0'){
    let params = {
      codigo: "4",
      parametro : this._storeServises.dataSession[0]["perfil"],
      cod_admi : this.cod_admi,
      cod_audi : id_auditoria
    }
    //this._storeServises.loading = true
    this._FormService.formulario(params).subscribe(
      resp => [
        this.iniciarAuditoria(resp),
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

  iniciarAuditoria(id:any){
    if (id["success"]) {
      sweetAlert("La auditoría para este paciente ha sido finalizada.")
      this.cod_audi = id["resultado"][0]["cod_audi"]
      this.formulario(this.cod_audi)
      this.infoPacienteBasic()
      return false
    }
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

  validarGuardarRespuesta(id_especial:string, codigo:string, id_control:string, id_resp:string, dependencia:string){
    if (id_especial != '') {
      this.id_dependencia = id_especial
      this.ValueResp = id_resp
      this.ValueDependencia = dependencia
      this.showChildModal()
      this.subFormulario(this.id_dependencia)
    }else{
      this.guardarRespuesta(codigo, id_control, id_resp, dependencia)
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
      eps: this.dataPaciente['nom_contrato'],
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
      if (this.selectedValue.length > 0) {
        this.guardarDevolucion()
      }
    }
  }

  selectValue(id:string){
    this.selectedValue = id
  }

  mostrarUsuarios(){
    let params = {
      codigo : '6'
    }
    this._storeServises.loading = true
    this._usuarioServises.AllUsuarios(params).subscribe(
      resp => [
        console.log(resp),
        this.dataUsuarios = resp,
      ], 
      err => [
        this.dataUsuarios = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  //---------------------- SUB PREGUNTAS -------------------

  subFormulario(id_dependencia:string){
    let params = {
      codigo: "7",
      parametro : this._storeServises.dataSession[0]["perfil"],
      parametro2 : id_dependencia,
      cod_audi : this.cod_audi
    }
    this._storeServises.loading = true
    this._FormService.formulario(params).subscribe(
      resp => [
        this.dataSubForm = resp["data"],
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

  guardarSubRespuesta(codigo:string, id_control:string, id_resp:string, dependencia:string){
    if (id_resp.length == 0) {
      return false
    }
    //this.traer_Sub_validaciones(this.cod_audi)
    let params = {
      codigo : codigo,
      cod_audi : this.cod_audi,                     
 		  id_control : id_control,                   
      id_resp : id_resp,
      dependencia : dependencia,                      
      cod_usua : this._storeServises.dataSession[0]["cod_usua"],                     
    }
    //this._storeServises.loading = true
    this._FormService.guardarSubRespuesta(params).subscribe(
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

  traer_Sub_validaciones(){
    let params = {
      codigo: "7",
      parametro : this._storeServises.dataSession[0]["perfil"],
      parametro2 : this.id_dependencia,
      cod_audi : this.cod_audi
    }
    this._storeServises.loading = true
    this._FormService.formulario(params).subscribe(
      resp => [
        this.dataSuball = resp["datall"],
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

  EnviarSubRespuesta(codigo:string, id_control:string, id_resp:string, dependencia:string){
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
        this.childModal.hide(),
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

}
