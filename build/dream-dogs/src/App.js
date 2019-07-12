import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import MainNav from './components/MainNav/MainNav';
import LandingPage from './components/LandingPage/LandingPage';
import PostsHome from './components/PostsHome/PostsHome';
import DemoNav from './components/DemoNav/DemoNav';
import Post from './components/Post/Post'
import AddPostNav from './components/AddPostNav/AddPostNav';
import config from './config';
import {DreamDogsProvider} from './DreamDogsContext';
import MyPost from './components/MyPost/MyPost';
import LoginForm from './components/LoginForm/LoginForm';
import TokenService from './services/token-service';
import UpdatePost from './components/UpdatePost/UpdatePost';
import Profile from './components/Profile/Profile';
import UpdateUser from './components/UpdateUser/UpdateUser';
import AuthApiService from './services/auth-api-service';
import SignUpForm from './components/LandingPageForm/SignUpForm';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';

const {API_BASE_URL} = config

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      post_id: null,
      loggedIn: false,
      logInError: null,
      signupError: null,
      loading: false
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    fetch(`${API_BASE_URL}/posts`, options)
      .then(res => {
        if(res.ok) {
         return res.json();
        }
        else {
          throw new Error('Something went wrong');
        }
      })
      .then(data => {
        this.setState({loading: false})
        this.setState({posts: data})
      })
      .catch(err => {
        alert(`Something went wrong ${err}`)
      })

      if (this.state.loggedIn) {
        this.getUser();
      }      
  }

  getPost() {
    this.setState({loading: true})
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`
      }
    }
    fetch(`${API_BASE_URL}/posts/myPost`, options)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        else {
          throw new Error('Something went wrong');
        }
      })
      .then(data => {
        this.setState({loading: false})
        this.setState({myPost: data})
      })
      .catch(err => {
        alert(`Something went wrong ${err}`)
      })
  }

  handleSubmit = e => {
    this.setState({loading: true})
    e.preventDefault();
    const post = {
      dog_name: e.target.dog_name.value,
      birthdate: e.target.dog_bday.value,
      breed: e.target.breed.value,
      lifestyle: e.target.lifestyle.value
    }

    fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error;
          });
        }
        return res.json();
      })
      .then(post => {
        this.setState({loading: false})
        this.addPost(post);
        const form = document.getElementById('post-form');
        form.reset();
        window.location.href = '/posts'
      })
      .catch(error => {
        alert(`something went wrong: ${error.message}`)
      })

  }

  handleDeletePost = post_id => {
    this.setState({loading: true})
    fetch(`${API_BASE_URL}/posts/${post_id}`,{
      method: "DELETE",
      headers: {
        'Authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error;
          });
        }
      })
      .then(() => {
        this.setState({loading: false})
        this.setState({
          posts: this.state.posts.filter(post => post.id !== post_id)
        });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleDeleteUser = user_id => {
    this.setState({loading: true})
    fetch(`${API_BASE_URL}/users/user`, {
      method: "DELETE",
      headers: {
        'Authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error;
          });
        }
      })
      .then(() => {
        this.setState({loading: false})
        this.setState({posts: this.state.posts.filter(post => post.id !== user_id)})
        TokenService.clearAuthToken()
        window.location.href='/posts'
      })
  }


  loginUser = ev => {
    this.setState({loading: true})
    ev.preventDefault();
    const { login_email, login_password } = ev.target

    AuthApiService.postLogin({
      email: login_email.value,
      password: login_password.value
    })
      .then(res => {
            this.setState({loading: false})
            login_email.value = ''
            login_password.value = ''
            TokenService.saveAuthToken(res.authToken);
            this.setState({loggedIn: true});
            window.location.href = '/posts'
      })
      .catch(err => {
        this.setState({logInError: err})
      })
  }

  handleUpdate = (post_id, e) => {
    this.setState({loading: true})
    e.preventDefault();
    
    const updatedPost = {
      dog_name: e.target.dog_name.value,
      breed: e.target.breed.value,
      email: e.target.owner_email.value,
      lifestyle: e.target.lifestyle.value
    }

    fetch(`${API_BASE_URL}/posts/${post_id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedPost),
      headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
          if (res.ok) {
              this.setState({loading: false})
              window.location.href = '/myPost'
          } else {
              return res.json().then(error => {
                  throw error;
              });
          }
      })
  }

  handleLogout = () => {
    TokenService.clearAuthToken()
  }

  addPost = post => {
    this.setState({
      posts: [...this.state.posts, post]
    })
    this.getPost();
  }

  setPostId = post_id => {
    this.setState({post_id})
  }

  render() {
    const contextVal = {
      posts: this.state.posts,
    }
    return (
      <div className="App">
        <header className="App-header">
          <Route exact path='/' component={MainNav} />
          <Route exact path='/posts' render={(props) => <DemoNav {...props} handleLogout={this.handleLogout}/>}/> 
          <Route exact path='/myPost' render={(props) => <DemoNav {...props} handleLogout={this.handleLogout} />} />
          <Route exact path='/edit' render={(props) => <DemoNav {...props} handleLogout={this.handleLogout}/>} />
          <Route exact path='/login' render={(props) => <DemoNav {...props} handleLogout={this.handleLogout}/>} />
          <Route exact path='/profile' render={(props) => <DemoNav {...props} handleLogout={this.handleLogout}/>} />
          <Route exact path='/editProfile' render={(props) => <DemoNav {...props} handleLogout={this.handleLogout}/>} />
          <Route exact path='/signup' render={(props) => <DemoNav {...props} handleLogout={this.handleLogout}/>} />
          <Route exact path='/addPost' render={(props) => <AddPostNav {...props} handleLogout={this.handleLogout}/>}/>
        </header>
        <>
        <DreamDogsProvider value={contextVal}>
          <Route exact path='/' render={(props) => <LandingPage {...props}  posts={this.state.posts} addUser={(event) => this.handleUserSubmit(event)} signupError={this.state.signUpError} />} />
        </DreamDogsProvider>
          {this.state.loading ? <Route path='/' render={(props) => <Loader {...props} />} /> : (
            <>
              <DreamDogsProvider>
                <Route exact path='/myPost' render={(props) => <MyPost {...props} setId={(post_id) => this.setPostId(post_id)} handleDeletePost={post_id => this.handleDeletePost(post_id)} />} />
                <Route exact path='/edit' render={(props) => <UpdatePost {...props} posts={this.state.posts} postId={this.state.post_id} updatePost={(e) => this.handleUpdate(this.state.post_id, e)}/>} />
                <Route exact path='/login' render={(props) => <LoginForm {...props} loginUser={(event) => (this.loginUser(event))} error={this.state.logInError} />} />
              </DreamDogsProvider>
              <Route exact path='/editProfile' component={UpdateUser} />
              <Route exact path='/posts' render={(props) => <PostsHome {...props} posts={this.state.posts}/>} />
              <Route exact path='/addPost' render={(props) => <Post {...props} addPost={(event) => this.handleSubmit(event)} />}/>
              <Route exact path='/profile' render={(props) => <Profile {...props} deleteUser={(user_id) => this.handleDeleteUser(user_id)} />} />
              <Route exact path='/signup' component={SignUpForm} />
            </>
          )} 
        </>
        <>
          <Route exact path='/' component={Footer} />
        </>
      </div>
    );
  }
}

export default App;
