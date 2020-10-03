import { OnInit, Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'facebook-comments',
    templateUrl: './facebook-comments.html'
  })

  export class FacebookCommentsComponent implements OnInit {
    newComment:any;
    comments:any = [];
    post:any;    FB: any;   
    pageAccessToken:any;    replyMessage:any;
    constructor(public ref: MatDialogRef<FacebookCommentsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        private http: HttpClient){
        
    }
    ngOnInit(): void {
        this.comments = this.data.comments;
        this.post = this.data.post;
        this.FB = this.data.FB;
        this.pageAccessToken = this.data.pageAccessToken;
        //this.comments = JSON.parse(localStorage.getItem('comments'));
        //this.post = JSON.parse(localStorage.getItem("selectedpost"));
        //console.log("comments" + this.comments + this.post);
    }

    showReplies(comment){
        comment.showReplies = ! comment.showReplies;
    }

    onReply(commentId,reply){
        var self = this;
        this.FB.api(
            "/"+commentId +"/comments?access_token=" + self.pageAccessToken,
            "POST",
            {
                "message": reply
            },
            function (response) {
                if (response && !response.error) {
                    self.replyMessage = "";
                    /* handle the result */
                    self.getComments();
                }
            }
        );
    }

    onComment(comment){
      var self = this;
      this.FB.api(
            "/"+self.post.id +"/comments?access_token=" + self.pageAccessToken,
            "POST",
            {
                "message": comment
            },
            function (response) {
                self.newComment = "";
                if (response && !response.error) {
                    /* handle the result */
                    self.getComments();
                }
            }
        );
    }
    
    getComments(){
        var self =this;
        this.FB.api(
          "/"+ self.post.id +"/?fields=comments{comments,from,id,message}",
          function (response) {
            if (response && !response.error) {
              self.comments = response.comments != null ? response.comments.data : [];              
            }
          }
        );
      }


  }