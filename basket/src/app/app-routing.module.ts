import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductviewComponent } from './productview/productview.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AllhomeproductsComponent } from './allhomeproducts/allhomeproducts.component';
import { authGuard } from './auth.guard';

const routes: Routes = [{path:'',component:HomeComponent,children: [
  { path: '', component:AllhomeproductsComponent }, // Child route 1
  { path: 'category/:name', component:ProductlistComponent,canActivate:[authGuard]  },
  {path:"cart",component:CartComponent,canActivate:[authGuard] },
  {path:"checkout",component:CheckoutComponent,canActivate:[authGuard] },
  {path:"productview",component:ProductviewComponent,canActivate:[authGuard] },
 ],},
  {path:"login",component:LoginComponent},
 
   {path:"productlist",component:ProductlistComponent,canActivate:[authGuard] }
   ,
   
   {path:"admin",component:AdminComponent,canActivate:[authGuard] },

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
