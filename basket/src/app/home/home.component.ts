import { ChangeDetectorRef, Component, OnInit,DoCheck } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
   
  http: HttpClient;
  allcategorieslist: any;
  allsubcategories: any;
  router: Router;
  cd: ChangeDetectorRef;
  cartservice: CartService;
  cartlength: any;
  isPopupOpen = false;
  local:boolean=false
  phno: boolean =false;
  phnootp: boolean=false;
  auth: AuthService;
  flag: string | undefined;
  timer: any
  timerdisplay: string | undefined;
  k: any;
  validatetoken: string | null | undefined;
   
   constructor(http:HttpClient,router:Router, cd: ChangeDetectorRef,cartservice:CartService,auth:AuthService){
    this.cartservice=cartservice
    this.http=http
    this.router=router
    this.cd=cd
    this.auth=auth
   }


  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.validatetoken = localStorage.getItem('token');
    }
    this.http.get("http://localhost:78/allcategories").subscribe((data:any)=>{this.allcategorieslist=data.result
     // this.getcartlengths()
      this.cd.detectChanges();

    },(err)=>{})

    

  }

 
  //  getcartlengths(){
  
  //   this.cartservice.getcartitems().subscribe(u=>{
  //     console.log(u)
  //     this.cartlength=u.length
  //    // this.cd.detectChanges();
  //   })
   
  //  }
 
  
  getcategoryproducts(y:string){
    this.router.navigate(['/category',y])
   
  }

  gotocart(){
    this.router.navigate(['/cart'])

  }

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
    this.phno=true
    this.phnootp=false
  }

  next(y:any){
    this.k=y
   this.phno=false
   this.phnootp=true
   console.log(y)
   this.flag=undefined
   this.auth.sendmobieno(y).subscribe((a)=>{

     this.timer=30

   let y= setInterval(()=>{
      this.timer--
      if(this.timer==0){
      
        clearInterval(y)
         this.timer=undefined
     }
    },1000)

   
   })
   
  }

  verifyotp(k:any){
   console.log(k)
   this.auth.verifyotp(k).subscribe((a:any)=>{
    console.log(a)

    if(a.flag==1){
     
      this.flag=undefined
      localStorage.setItem('token',a.token)
      this.validatetoken = localStorage.getItem('token');
    
      this.isPopupOpen=false
      alert("succufully logined")
      window.location.reload()

    }
    else if(a.flag==0){
      this.flag="wrong otp entered"
    }
    else if(a.flag==3){
      this.flag="otp expired"
    }
   })
  }


  resend(){
    this.next(this.k)
  }

  closePopup() {
    this.isPopupOpen = false;
  }
  
  logout() {
    // Remove token from localStorage and update state
    localStorage.removeItem('token');
    this.validatetoken = null;
     window.location.reload()
    alert("Logged out successfully");
  }
}
