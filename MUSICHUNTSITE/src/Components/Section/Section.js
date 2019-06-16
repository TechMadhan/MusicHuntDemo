import React , {Component} from 'react';
import './Section.css';
import $ from 'jquery';
import { albumsList } from '../../Main/UserFunctions';
import { getAllTracksByAlbumId } from '../../Main/UserFunctions';
// import { getFavouriteByTrackId }  from '../../Main/UserFunctions';
import { getFavouriteTracksByUser } from '../../Main/UserFunctions';
import { setFavouriteByUser } from '../../Main/UserFunctions';
import { removeFavouriteByUser } from '../../Main/UserFunctions';
// import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import Files from 'react-files'
import MusicPlayer from './MusicPlayer/MusicPlayer'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
  } from 'react-router-dom';


class Home extends Component{
    render(){
        return(
            <div className="home">
                <Album/>
                <Recent/>
                <Favourite/>
            </div>
        )
    }
}

class Album extends Component{

    constructor(props) {
        super(props);
        this.state = {
          currentCard: 0,
          position: 0,
          cardStyle: {
            transform: 'translateX(0px)'
          },
          width: 0,
          albumData : [],
          isAlbumCreate : false,
          isDataAlive : false,
          albumTitle  : "Albums"
        };
      }

      componentDidMount() {
        albumsList().then(response => {
          console.log(response);
          if(response===undefined){
            console.log("server unavailable");
          }
          else{
            this.setState({albumData : response, isDataAlive : true});
          }
        })
      }

      createAlbumActive = ()=>{
          this.setState({isAlbumCreate : true});
      }

      createAlbum = (albumObj)=> {
        let albumCopy = this.state.albumData.slice();
        let count = 0;
        for(let i=0; i<albumCopy.length; i++){
            if(albumCopy[i].title === albumObj.albumName){
              count++;
            }
        }
        if(count)
        var obj = {
          albumImg : "",
          description : albumObj.albumDesc,
          songs : [],
          title : albumObj.albumName
        }
        albumCopy.push(obj);
        // putAlbums(albumCopy).then(()=>{
            this.setState({albumData : albumCopy, isAlbumCreate : false});
        // })
      }
      setAlbumTitle = (index) => {
          this.setState({albumTitle : this.state.albumData[index].album_title});
      }

    render(){
        let createShown = {
          display : this.props.albumTitle ==="Albums"?"block":"none"
        }
        let mainPageShown = {
          display : this.state.isDataAlive ? "block" : "none"
        }
        if(!this.state.isAlbumCreate){
            return(
                <div className="album container-fluid" style={mainPageShown}>
                    <div className="cards-slider row">
                        <div className="col-md-9"><h3><Link to="/">Albums</Link>{this.state.albumTitle!=="Albums"?<span>&nbsp;&#x3e;&nbsp;{this.state.albumTitle}</span>:""}</h3></div>
                          <div className="btn btn-success create-albm-btn" style={createShown} onClick={this.createAlbumActive}>Create Album</div>
                      {/*    <div className="ml-auto">
                            <div className="row">
                                <div className="arrow-btn">
                                    <div className="btn btn-sm btn-outline-secondary btn-arrow-left" onClick={() => this.handleClick('prev')}><span>&lt;</span></div>
                                </div>
                                <div className="col-md-1 arrow-btn">
                                    <div className="btn btn-sm btn-outline-secondary btn-arrow-right" onClick={() => this.handleClick('next')}><span>&gt;</span></div>
                                </div>
                            </div>
                          </div> */}
                    </div>
                    <hr className="album-hr"/>
                    <div className="album-content">
                        <Card cardStyle={this.state.cardStyle} albumData={this.state.albumData} albumTitle={this.setAlbumTitle}/>
                    </div>
                </div>
            )
          }
          else{
            return <CreateAlbum createAlbum={this.createAlbum}/>
          }
    }
}

class CreateAlbum extends Component{
  constructor(props){
    super(props);
    this.state = {
      albumName : "",
      albumDesc : "",
      albumImg : "",
      songs : []
    }
  }

  updateAlbumDetails = (e)=>{
    this.setState({[e.target.name] : e.target.value});
  }

  render(){
    return(
      <div className="create-album-main container">
      <h2>Create Your Album </h2>
      <hr/>
        <div className="row">
              <div className="col">
                <form>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="abmName">Name</label>
                            <input type="text" className="form-control ml-auto" id="abmName" placeholder="Enter Album Name" onChange={this.updateAlbumDetails} name="albumName" autoComplete="current-username" required />
                        </div>
                        <div className="col ml-auto">
                            <label htmlFor="abmDesc">Description</label>
                            <input type="text" className="form-control ml-auto" id="abmName" placeholder="Enter Album Name" onChange={this.updateAlbumDetails} name="albumDesc" autoComplete="current-username" required />
                        </div>
                    </div>
                    <div className="form-group text-center create-abm-upload">
                        <Files
                            className='files-dropzone album-img-upload btn btn-primary btn-sm'
                            // onChange={this.onFilesChange}
                            // onError={this.onFilesError}
                            accepts={['image/*']}
                            multiple
                            maxFiles={10}
                            maxFileSize={10000000}
                            minFileSize={0}
                            clickable
                        >
                            Upload Album Cover
                        </Files>
                      </div>
                      <div className="form-group text-center create-abm-upload">
                          <Files
                              className='files-dropzone album-songs-upload btn btn-primary btn-sm'
                              // onChange={this.onFilesChange}
                              // onError={this.onFilesError}
                              accepts={['audio/*']}
                              multiple
                              maxFiles={10}
                              maxFileSize={10000000}
                              minFileSize={0}
                              clickable
                          >
                              Upload Songs
                          </Files>
                      </div>
                      <div className="btn btn-sm btn-outline-success" onClick={this.props.createAlbum.bind(this,this.state)}>Create</div>
                </form>
            </div>
            <div className="col">
                uploaded image and songs will display here
            </div>
        </div>
      </div>
    )
  }
}

class Card extends Component{
    constructor(props){
        super(props);
        this.state = {
          tracksData : [],
          isSongsShown : false,
          isFavourite : false,
          favouriteCount : 0,
          userFavouriteTracks : []
        }
    }
   componentDidMount = ()=>{
      let user = localStorage.getItem("musicHuntUser");
      if(user!==undefined && user !== null){
        getFavouriteTracksByUser({
            userName : user
        }).then(response=>{
            if(response.albumId!==undefined && response.albumId!==null){
                this.setState({userFavouriteTracks : response.albumId});
            }
        })
      }
    }

    getTracks = (index)=>{
        getAllTracksByAlbumId(this.props.albumData[index].album_id).then(response => {
              if(response.dataset===undefined){
                  console.log("server unavailable");
              }
              else{
                this.props.albumTitle(index);
                this.setState({tracksData : response.dataset,isSongsShown : true});
              }
        })
    }

    toggleFavourite = (type,index,  trackId) => {
      console.log(type);
        if(type ==="add"){
          console.log($(".add-favourite").eq(index));
          this.setState({isFavourite : true});
        }
        else{
          console.log(type + trackId);
          this.setState({isFavourite : false});
        }
    }



    getFavouriteHandler = (index,albumId) => {
      let user = localStorage.getItem("musicHuntUser");
      let userTracksArr = this.state.userFavouriteTracks;
      if(user!==undefined && userTracksArr!==null && userTracksArr!==undefined){
          let index = userTracksArr.indexOf(albumId);
          if(index!==-1){
            return(
                <i className="fa fa-heart add-favourite" onClick={this.removeFavour.bind(this,index,albumId)} title="Remove to favourite"></i>
            )
          }
          else{
              return <i className="fa fa-heart-o add-favourite add-album" onClick={this.setFavour.bind(this,index,albumId)} title="Add to favourite"></i>
          }
      }
    }

    setFavour = (index,albumId)=> {
      let user = localStorage.getItem("musicHuntUser")
      if(user!==null && user!==undefined){
          let obj = {
            userName : user,
            albumId :albumId
          }
          setFavouriteByUser(obj).then(response=> {
            console.log(response);
          })
      }
    }

    removeFavour = (index, albumId) => {
      let user = localStorage.getItem("musicHuntUser")
      if(user!==null && user!==undefined){
          let obj = {
            userName : user,
            albumId : albumId
          }
          removeFavouriteByUser(obj).then(response => {
            console.log(response);
          })
      }
    }

    render(){
      let albumcardStyle = {
        flexWrap: window.location.href.includes("album") ? "none"  :"nowrap",
      }
        const cardData = this.props.albumData;
        if(this.state.isSongsShown){
          return (
            <Songs tracksData = {this.state.tracksData}/>
          )
        }
        else{
            return(
                <div className="album-card text-center row" style={albumcardStyle}>
                 {cardData.map((val, index)=>{
                     return(
                        <div className="card col-md-3" id="card" style={this.props.cardStyle} key={index}>
                          <div className="row" onClick={this.getTracks.bind(this,index)}>
                            <img src={val.album_image_file} className="card-img-top mx-auto img-thumbnail" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title"><b>Title  :</b> {val.album_title}</h5>
                                <span><b>Tracks : </b>{val.album_tracks}</span>
                            </div>
                            </div>
                            <div className="row pull-right card-fa-heart">
                              {this.getFavouriteHandler(index,val.album_id)}
                            </div>
                        </div>
                     )
                   })}
                 </div>
            )
          }
        }
}

class Songs extends Component{
  constructor(props){
      super();
      this.state = {
          songsData : []
      }
  }
  componentDidMount = ()=> {
    if(this.props.tracksData===undefined){

    }
    else{
      this.setState({songsData : this.props.tracksData});
    }
  }
  render(){
    return(
      <div className="song-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h4>SONGS</h4>
            </div>
            <div className="col-md-2 mr-auto">
              <h5>{this.state.songsData.length} Songs</h5>
            </div>
          </div>
          <hr/>
          <div className="row text-center song-header">
            <div className="col"></div>
            <div className="col">Song</div>
            <div className="col">Album</div>
            <div className="col"></div>
            <div className="col"></div>
            <div className="col"></div>
            <div className="col"></div>
          </div>
          <div className="row">
          <div className="col-md-3 ml-auto">

          </div>
            <div className="col-md-9">
              {this.state.songsData.map((song, index)=>{
                  return(
                      <MusicPlayer songData={song} index={index} key={index}/>
                  )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class AllCards extends Component{
    render(){
        return(
            <div className="allCards"></div>
        )
    }
}

class Favourite extends Component{
  constructor(props){
    super(props);
    this.state = {
      userFavouriteList : [],
      userFavouriteTrackList : []
    }
  }
  componentDidMount = () => {
    let user = localStorage.getItem("musicHuntUser");
    let userAlbumList = this.state.userFavouriteList;
    // let tracksList = this.state.userFavouriteTrackList;
    if(user!==null && user !== undefined){
        getFavouriteTracksByUser({
          userName : user
        }).then(response => {
          if(response.albumIds!==null && response.albumIds!==undefined){
              response.albumIds.filter(function(value, index, arr){
                  getAllTracksByAlbumId(value).then(response=>{
                      if(response.dataset!==null && response.dataset!== undefined){
                        response.dataset.filter(function(value, index, arr){
                            userAlbumList.push(value);
                        })
                      }
                  })
              })
              this.setState({userFavouriteList : userAlbumList})
          }
        })
    }
  }
    render(){
        return(
            <div className="favourites">
                <Songs tracksData={this.state.userFavouriteList}/>
            </div>
        )
    }
}

class Recent extends Component{
    render(){
        return(
            <div className="recent">
                <Album/>
            </div>
        )
    }
}

class Profile extends Component{
    render(){
        return(
            <div className="profile">Profile</div>
        )
    }
}

class Section extends Component{
    constructor(props){
        super(props);
        this.state = {
            isUserActive : false,
            audioLists : [
            {
              name : "First song 1",
              singer : "Madhan",
              cover : "https://freemusicarchive.org/file/images/tracks/Track_-_20110118110252018",
              musicSrc :"http://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/download"
            },
            {
              name : "First song",
              singer : "Madhan",
              cover : "https://freemusicarchive.org/file/images/tracks/Track_-_20110118110252018",
              musicSrc : () => {
                return Promise.resolve("http://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/download")
              }
            }
          ]
        }
    }

    componentDidMount = ()=> {
      if(localStorage.getItem("musicHunt") !==null){
        this.setState({isUserActive : true});
      }
      console.log(this.props);
    }

    logout = ()=> {
      localStorage.clear();
      this.setState({isUserActive : false});
    }

    loginUser = ()=> {
      this.setState({isUserActive : true});
    }
    render(){
        return(
            <div className="section container-fluid">
                <Router>
                <div className="section-aside">
                    <ul>
                        <Link to="/MusicHuntPro">
                            <li className="active">
                                <div className="row">
                                    <div className="mr-auto">Home</div>
                                    <div className="ml-auto"><i className="fa fa-home" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                        <Link to="/MusicHuntPro/album">
                            <li>
                                <div className="row">
                                    <div className="mr-auto">Albums</div>
                                    <div className="ml-auto"><i className="fa fa-folder-open-o" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                        <Link to="/MusicHuntPro/song">
                            <li>
                                <div className="row">
                                    <div className="mr-auto">Songs</div>
                                    <div className="ml-auto"><i className="fa fa-folder-open-o" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                        <Link to="/MusicHuntPro/recent">
                            <li>
                                <div className="row">
                                    <div className="mr-auto">Recent</div>
                                    <div className="ml-auto"><i className="fa fa-history" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                        <Link to="/MusicHuntPro/favourites">
                            <li>
                                <div className="row">
                                    <div className="mr-auto">Favourites</div>
                                    <div className="ml-auto"><i className="fa fa-heart" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                        <Link to="/MusicHuntPro/profile">
                            <li>
                                <div className="row">
                                    <div className="mr-auto">Profile</div>
                                    <div className="ml-auto"><i className="fa fa-user-o" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                            <li>
                                <div className="row" onClick={this.logout}>
                                    <div className="mr-auto">
                                    {this.state.isUserActive ?
                                      <div onClick={this.logout}>Logout</div>:
                                      <div data-toggle="modal" data-target="#myModal" onClick={this.loginUser}>Login</div>}</div>
                                    <div className="ml-auto"><i className="fa fa-sign-out" aria-hidden="true"></i></div>
                                </div>
                            </li>
                    </ul>
                </div>
                <div className="section-content">
                    <div className="section-content-album">
                    <Switch>
                        <Redirect exact from="/" to="/MusicHuntPro"/>
                        <Route exact path="/MusicHuntPro" render={()=><Home/>}/>
                        <Route exact path="/MusicHuntPro/album" render = {()=><Album title="Albums"/>}/>
                        <Route exact path="/MusicHuntPro/song" render = {()=><Songs/>}/>
                        <Route path="/MusicHuntPro/allcards" render={()=><AllCards/>}/>
                        <Route exact path="/MusicHuntPro/recent" render = {()=><Recent/>}/>
                        <Route exact path="/MusicHuntPro/favourites" render = {()=><Favourite />}/>
                        <Route exact path="/MusicHuntPro/profile" render = {()=><Profile />}/>
                    </Switch>
                    </div>
                </div>
                </Router>
                {/*<Draggable
                  handle=".handle"
                  defaultPosition={{x: 0, y: 0}}
                  position={null}
                  grid={[25, 25]}
                  scale={1}
                  onStart={this.handleStart}
                  onDrag={this.handleDrag}
                  onStop={this.handleStop}>
                <div className="play-music-main fixed-bottom handle">
                  <div className="container">
                      <div>
                        <div>Drag from here</div>
                      </div>
                  </div>
                </div>
                </Draggable>*/}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
  return{
    musicPlayListReducer : state.musicPlayListReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    setCurrent : (val) => {
      dispatch({
          type : 'SET_CURRENT',
          payload : val
      });
    },
    setPlayList : (playList) => {
      dispatch({
        type : 'SET_PLAYLIST',
        payload : playList
      })
    }
  }
}
connect(mapStateToProps,mapDispatchToProps)(Section);
export default Section;
