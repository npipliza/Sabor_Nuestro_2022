import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SupervisorGuard } from './guards/supervisor.guard';
import { HomeSupervisorComponent } from './supervisor/pages/home-supervisor/home-supervisor.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegistroEmpleadoComponent } from './supervisor/pages/registro-empleado/registro-empleado.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./supervisor/supervisor.module').then( m => m.SupervisorModule)
  },
  {
    path: 'mozo',
    loadChildren: () => import('./mozo/mozo.module').then( m => m.MozoModule)
  },
  {
    path: 'cliente',
    loadChildren: () => import('./cliente/cliente.module').then( m => m.ClienteModule)
  },
  {
    path:'registro-cliente', component:RegisterComponent
  },
  {
    path:'registro-cliente',
    component:RegisterComponent
  },
  {
    path:'registro-personal',
    component:RegistroEmpleadoComponent,
  },
  {
    path:'home-supervisor',
    component:HomeSupervisorComponent,
    canActivate:[SupervisorGuard]
  },
  {
    path: 'altamesas',
    loadChildren: () => import('./pages/altamesas/altamesas.module').then( m => m.AltamesasPageModule),
    canActivate:[SupervisorGuard]
  },
  {
    path: 'home-clientes',
    loadChildren: () => import('./pages/home-clientes/home-clientes.module').then( m => m.HomeClientesPageModule)
  },
  {
    path: 'home-mozo',
    loadChildren: () => import('./pages/home-mozo/home-mozo.module').then( m => m.HomeMozoPageModule)
  },
  {
    path: 'home-cocinero',
    loadChildren: () => import('./pages/home-cocinero/home-cocinero.module').then( m => m.HomeCocineroPageModule)
  },
  {
    path: 'carta',
    loadChildren: () => import('./pages/carta/carta.module').then( m => m.CartaPageModule)
  },
  {
    path: 'lista-espera',
    loadChildren: () => import('./pages/lista-espera/lista-espera.module').then( m => m.ListaEsperaPageModule)
  },
  {
    path: 'listado-pedidos',
    loadChildren: () => import('./pages/listado-pedidos/listado-pedidos.module').then( m => m.ListadoPedidosPageModule)
  },
  {
    path: 'mesas',
    loadChildren: () => import('./pages/mesas/mesas.module').then( m => m.MesasPageModule)
  },
  {
    path: 'detalle-pedido',
    loadChildren: () => import('./pages/detalle-pedido/detalle-pedido.module').then( m => m.DetallePedidoPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
