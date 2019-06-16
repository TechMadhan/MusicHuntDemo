import axios from 'axios'
const localhost = "http://localhost:5000";
//
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://codingmart42:<password>@musichunt01-4ybzp.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


export const login = (userLogin) => {
  return axios.post(localhost+'/users/login',{
      userName : userLogin.userName,
      password : userLogin.password
  }).then(response => {
    console.log(response);
      if(response.data.token!==undefined){
        if(response.data.error===undefined){
            localStorage.setItem("musicHunt", response.data.token);
        }
      }
      return response.data
  }).catch(err=>{
      return err
  })
}


export const setFavouriteByUser = (userFavourite) => {
  return axios.post(localhost+'/tracks/setFavouriteByUser',{
      userName : userFavourite.userName,
      albumIds : userFavourite.albumId
  }).then(response => {
    console.log(response);
      if(response.data!==undefined){
        if(response.data.error===undefined){
            console.log("Got");
        }
      }
      return response.data
  }).catch(err=>{
      return err
  })
}

export const removeFavouriteByUser = (userRemoveFavour) => {
  return axios.post(localhost + '/tracks/removeFavouriteByUser',{
    userName : userRemoveFavour.userName,
    albumId : userRemoveFavour.albumId
  }).then(response => {
    console.log(response);
  })
}


export const albumsList = ()=>{
  return axios.get(localhost+'/albums/getAllAlbums').then(response=>{
      if(response.data===undefined || response.data===null){
        return "Server Down"
      }
      else{
        return response.data.slice(1,10);
      }
  })
}


export const getFavouriteTracksByUser = (userDet) => {
  return axios.get(localhost + '/tracks/getFavouriteByUser', {
    params : {
      userName : userDet.userName
    }
  }).then(response => {
      return response.data;
  })
}


export const getAllTracksByAlbumId = (val)=> {
  return axios.get(localhost + '/getAllTracksByAlbumId',{
    params: {
      albumId : val
    }
  }).then(response => {
      if(response.data.body===undefined || response.data.body===null){
        return "Server Down"
      }
      else{
        return response.data.body;
      }
  })
}

export const register = (user) => {
  return axios.post(localhost+'/users/register', {
    firstName : user.firstName,
    lastName : user.lastName,
    userName  : user.userName,
    email : user.email,
    password : user.password,
    profile_img : user.profile_img
  }).then((response)=>{
     return response
  })
}


export const getFavouriteByTrackId = (trackId) => {
  return axios.get(localhost +'/getFavouriteByTrackId', {
    params : {
      trackId : trackId
    }
  }).then(response => {
      if(response.data.body===undefined || response.data.body===null){
        return "Server Down"
      }
      else{
        return response.data.body;
      }
  })
}

//
// export const albums = ()=> {
//   return axios.get("https://musichunt-699ba.firebaseio.com/albums.json").then((response)=>{
//       return response;
//   })
// }
//
// export const putAlbums = (data)=> {
//   return axios.put("https://musichunt-699ba.firebaseio.com/albums.json",data).then((response)=>{
//       return response;
//   })
// }

// export const getTracks = ()=> {
//   return axios.get("http://localhost:5000/allTracks").then((response)=>{
//     return response.data.name.body.dataset;
//   })
// }
