import { initializeApp } from 'firebase/app';
import { getDatabase, get, child, ref, update, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAgusRDy-8ClkGHN3xjUpHbA6up7GGvu6w",
  authDomain: "sasave-dce67.firebaseapp.com",
  projectId: "sasave-dce67",
  storageBucket: "sasave-dce67.appspot.com",
  messagingSenderId: "916413326864",
  appId: "1:916413326864:web:cd18129f5d913278f84c95",
  measurementId: "G-GXNWC88MSQ"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

console.log(firebase);

chrome.runtime.onMessage.addListener((msg, sender, response) => {

  if(msg.command == "fetch"){
    var domain = msg.data.domain;
    var enc_domain = btoa(domain);
  
    const dbRef = ref(getDatabase(firebase));
    get(child(dbRef, '/domain/'+enc_domain)).then((snapshot) => {
      if (snapshot.exists()) {
        response({type: "result", status: "success", data: snapshot.val(), request: msg});
      } else {
        response({type: "result", status: "success", data: [], request: msg});
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
      response({type: "result", status: "error", error: error, data: [], request: msg});
      console.log("No data available");
    });
  }

  //submit coupon data..
  if(msg.command == "post"){

    var domain = msg.data.domain;
    var enc_domain = btoa(domain);
    var code = msg.data.code;
    var desc = msg.data.desc;

    try{
        const db = getDatabase(firebase);
        const postId = push(child(ref(db), '/domain/'+enc_domain)).key;
        update(ref(db, '/domain/'+enc_domain+'/'+postId), {
          code: code,
          description: desc
        })
        .then(() => {
          //return response
          response({type: "result", status: "success", data: postId, request: msg});
        })
        .catch((error) => {
          // The write failed...
          console.log("error:", e);
          response({type: "result", status: "error", data: error, request: msg});
        });

    }catch(e){
      console.log("error:", e);
      response({type: "result", status: "error", data: e, request: msg});

    }
  }

  return true;


})