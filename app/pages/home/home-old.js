import {Page} from 'ionic-angular';
// import {SocialSharing} from 'ionic-native';
import {Http} from 'angular2/http';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  static get parameters() {
    return [[Http]]
  }
  constructor(http) {
    let firebaseUrl = "https://ansohunter.firebaseio.com";
    this.ref = new Firebase(firebaseUrl);
    this.http = http;
    this.count = 0;
  }

  login() {
    this.ref.authWithOAuthPopup("facebook", (error, authData) => {
      if (error) {
        alert(error);
      }
      else {
        alert("Foi");
        this.nome = authData.facebook.displayName;
        this.email = authData.facebook.email;
        this.imagem = authData.facebook.profileImageURL;
        this.id = authData.facebook.id;

        let http = this.http;

        http.get("https://graph.facebook.com/v2.5/me/friends?access_token=" + authData.facebook.accessToken)
        .subscribe((response) => {
          let obj = response.json();
          alert(obj.data);
          this.destinatario = obj.data[0];

          this.ref.child("users").child(this.id).set(
            {
              name: this.nome
            }
          );
        });
      }
    }, {remember: "sessionOnly", scope:"user_friends, email"});
  }

    share() {
      window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint("teste", '', 'http://ansodev.com', 'teste messagem');
    }

  sendMessage() {
    this.count++;
    this.ref.child("messages").child(this.destinatario.id).push().set(
      {
        sender_id: this.id,
        sender_name: this.nome,
        message: "testando " + this.count,
        read: false
      }
    )
  }

  getMessage() {
    let ref = new Firebase("https://ansohunter.firebaseio.com/messages/" + this.id);



    ref.orderByChild("read").equalTo(false).on("child_added", (snapshot, prev) => {
      let changepost = snapshot.val();
      alert(changepost.message);
    })
  }
}
