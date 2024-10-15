import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProductviewComponent } from './productview/productview.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AllhomeproductsComponent } from './allhomeproducts/allhomeproducts.component';
import { ProductfilterPipe } from './productfilter.pipe';
import { testInterceptor } from './test.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductlistComponent,
    ProductviewComponent,
    CheckoutComponent,
    CartComponent,
    LoginComponent,
    AdminComponent,
    AllhomeproductsComponent,
    ProductfilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withInterceptors([testInterceptor]))

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
