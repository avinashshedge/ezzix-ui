import { environment } from '../../../environments/environment';
export class UploadAdapter {
  public baseUrl = environment.apiUrl;
//  public http =  InjectorInstance.get<HttpClient>(HttpClient);
  constructor(private loader,private http) {
  }
  
    //the uploadFile method use to upload image to your server
  uploadFile(file){
    
    let name = '';
    let url=  this.baseUrl + '/email/upload-email-image';
    let formData:FormData = new FormData();
    let headers = new Headers();
    name = file.name;
    
    formData.append('asset', file,name);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    return this.http.post(url,formData);
  }

    public upload(): Promise<any> {
      let upload = new Promise((resolve, reject)=>{
        this.loader['file'].then(
            (data)=>{
                this.uploadFile(data)
                  .subscribe(
                      (result)=>{
                        var imagePath = "https://ezzixstorage.blob.core.windows.net/email-images/" + data.name;                        
                        resolve({ default: imagePath });
                      },
                      (error)=>{
                          reject(data.msg);
                      }
                  );
            }
        );
      });
      return upload;
    }
  
    abort() {
      console.log("abort")
    }
  
  }