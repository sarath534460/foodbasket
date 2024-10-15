import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  visibleForm: string | null = null; // Can be 'category', 'subcategory', or 'product'
  http: HttpClient;
  data: any;
  allparentcategorieslist: any;
  selectedpcategory:any;

  isDisabled=true
  p: any;
  image:any


   constructor(http:HttpClient){
    this.http=http
   }

   ngOnInit(): void {
       
    this.http.get("http://localhost:78/allsubcategoriesofchild").subscribe((data:any)=>{this.data=data},(err)=>{

    })

    this.http.get("http://localhost:78/allcategories").subscribe((data:any)=>{this.allparentcategorieslist=data.result},(err)=>{})


   }


  // Show the appropriate form
  showForm(formType: string) {
    this.visibleForm = formType;
  }

  addcategory(addcat:any){
    this.http.post("http://localhost:78/addcategoryfromadmin",addcat).subscribe((adcat)=>{

    }),(err:any)=>{}
  }

  addsubcategory(p:any){
   
    this.http.post("http://localhost:78/addsubcategorytype",p).subscribe((adcat)=>{

    }),(err:any)=>{}
  }

  productimage(e:any){
   let f:File=e.target.files[0]
    this.image=f
  }

  addproducts(y:any){
   console.log(y)
   
    let formdata=new FormData();
    formdata.append('hjk',this.image);
    formdata.append('data',JSON.stringify(y))

   // console.log(formdata.get('hjk'));
    
    this.http.post("http://localhost:78/addproducts",formdata).subscribe((adprod)=>{

    }),(err:any)=>{}


  }

  test(y:string){
    console.log(y)
    this.isDisabled=false
    this.http.post("http://localhost:78/allsubcategories",{categoryfruit:y}).subscribe((p)=>{this.p=p},(err)=>{
    
    })
    
  }
}
