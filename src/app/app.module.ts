import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

//ng loading
import { NgxLoadingModule } from 'ngx-loading';
//ng-pagination
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { LoginComponent } from './access/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuLeftComponent } from './dashboard/menu-left/menu-left.component';
import { CensoComponent } from './dashboard/views/censo/censo.component';
import { AuditadoComponent } from './dashboard/views/auditado/auditado.component';
import { FormComponent } from './dashboard/views/form/form.component';
import { ConfigComponent } from './dashboard/views/config/config.component';
import { FormTemplateComponent } from './dashboard/views/config/form-template/form-template.component';
import { UsuariosComponent } from './dashboard/views/config/usuarios/usuarios.component';
import { PerfilesComponent } from './dashboard/views/config/perfiles/perfiles.component';

const rutas: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'censo'
      },
      {
        path: 'censo',
        component: CensoComponent
      },
      {
        path: 'auditado',
        component: AuditadoComponent
      },
      {
        path: 'form',
        component: FormComponent
      },
      {
        path: 'config',
        component: ConfigComponent,
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            redirectTo: 'formtemplate'
          },
          {
            path: 'formtemplate',
            component: FormTemplateComponent
          },
          {
            path: 'usuario',
            component: UsuariosComponent
          },
          {
            path: 'perfiles',
            component: PerfilesComponent
          },
        ]
      }
    ]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MenuLeftComponent,
    CensoComponent,
    AuditadoComponent,
    FormComponent,
    ConfigComponent,
    FormTemplateComponent,
    UsuariosComponent,
    PerfilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(rutas,{
      paramsInheritanceStrategy: 'always',
      useHash: false,
      anchorScrolling: 'enabled'
    }),
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
