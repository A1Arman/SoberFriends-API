# SoberFriends

SoberFriends aims to help people quit their addiction by tracking their progress, and having a community of people going through the same thing for support.

## Motivation

I wanted to build an app for people going through quitting their addiction, because I know when you are quitting it can be tough to stay motivated. Also some people may feel like they are alone and have no support. This app aims to solve that by having a community, as well as allowing the user to see their progress by tracking how much money they have saved and how many days they have been stopped their addiction for.

## Demo

- [Live Demo]('https://soberfriends.herokuapp.com/')

## Installing

```
npm install
npm start
```

## Testing 
To run back-end tests run ```npm test``` in terminal.

## Schema

### User
```
(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    impact TEXT NOT NULL,
    money_spent INTEGER NOT NULL,
    start_date TIMESTAMP DEFAULT now() NOT NULL
);
```

### Posts 
```
(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    owner INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);
```

### Comments 
```
(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    comment TEXT NOT NULL,
    date_commented TIMESTAMP DEFAULT now() NOT NULL,
    post_id INTEGER
        REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    owner INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL
)
```

### Likes 
```
(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    post_id INTEGER
        REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    owner INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL
);
```

## API Overview
```
/api
|__/auth
|   |__ POST
|   |__/login
|
|__/posts
|   |__ GET
|   |   |__ /
|   |   |__ /getRandom
|   |   |__ /myPost
|   |   |__ /:postId/likes
|   |   |__ /:postId
|   |__ POST
|   |    |__ /
|   |    |__ /:postId/likes
|   |__ PATCH
|   |    |__ /:postId
|   |__ DELETE
|   |    |__ /:postId/likes
|   |    |__ /:postId
|
|__/users
|    |__ GET
|    |   |__ /user
|    |__ POST
|    |   |__ /
|    |__ DELETE
|    |    |__ /user
|     
|__/comments
|    |__ GET
|    |    |__ /
|    |    |__ /:postId
|    |__ POST
|    |    |__ /   
```

### POST ```/api/auth/login```
```
// req.body
 {
  email: String,
  password: String
 }
 
 // res.body
 {
  authToken: String
 }
```

### GET ```/api/posts```
```
// req.header
Authorization: Bearer ${token}

// res.body
[
  {
    id: Number,
    post_title: String,
    post_content: String,
    first_name: String,
    last_name: String
   }
]
```

### GET ```/api/posts/getRandom```
```
  // req.header
  Authorization: Bearer ${token}

  // res.body
  {
    id: Number,
    post_title: String,
    post_content: String,
    first_name: String,
    last_name: String
   }
```

### GET ```/api/posts/myPost```
```
  // req.header
  Authorization: Bearer ${token}
  
  // req.user
  {
    id: Number
  }

  // res.body
[
  {
    id: Number,
    post_title: String,
    post_content: String,
    first_name: String,
    last_name: String
   }
]
```

### GET ```/api/posts/:postId/likes```
```
  // req.header
  Authorization: Bearer ${token}

  // res.body
[
  {
    id: Number,
    post_id: Number,
    owner: Number
  }
]
```

### GET ```/api/posts/:postId```
```
  // req.header
  Authorization: Bearer ${token}

  // res.body
  {
    id: Number,
    post_title: String,
    post_content: String,
    owner: Number
  }
```

### POST ```/api/posts```
```
  // req.header
  Authorization: Bearer ${token}
  
  // req.user
  {
    id: Number
  }
  
  // req.body
  {
    post_title: String,
    post_content: String,
    owner: Number
  }
```

### POST ```/api/posts/:postId/likes```
```
  // req.header
  Authorization: Bearer ${token}
  
  // req.user
  {
    id: Number
  }
  
  // req.body
  {
    post_id: Number,
    owner: Number
  }
 ```
 
 ### PATCH ```/api/posts/:postId```
 ```
  // req.header
  Authorization: Bearer ${token}
  
  // req.params
  {
    postId: Number
  }
  
  // req.body
  {
    post_title: String,
    post_content: String
    post_id: Number
  }
```

### DELETE ```/api/posts/:postId/likes```
```
  // req.header
  Authorization: Bearer ${token}
  
  // req.user
  {
    id: Number
  }
  
  // req.params
  {
    postId: Number
  }
```

### DELETE ```/api/posts/:postId```
```
  // req.header
  Authorization: Bearer ${token}
  
  // req.params
  {
    postId: Number
  }
```

### GET ```/api/users/user```
```
  // req.header
  Authorization: Bearer ${token}
  
  //req.user
  {
    id: Number
  }
  
  // res.body
  {
    first_name: String,
    last_name: String,
    id: Number,
    start_date: String,
    impact: String,
    money_spent: Number
  }
```
    

### POST ```/api/users```
```
  // req.body
  {
   first_name: String,
   last_name: String,
   email: String,
   password: String,
   impact: String,
   money_spent: Number
  }
```

### DELETE ```/api/users/user```
```
  // req.header
  Authorization: Bearer ${token}
  
  // req.user
  {
    id: Number
  }
```

### GET ```/api/comments```
```
  // res.body
[
  {
    id: Number,
    comment: String,
    post_id: Number,
    owner: Number
  }
]
```

### GET ```/api/comments/:postId```
```
  // req.params
  {
    postId: Number
  }
  
  // res.body
[
  {
    id: Number,
    comment: String,
    date_commented: String,
    first_name: String,
    last_name: String,
    post_title: String
  }
]
```
    

### POST ```/api/comments```
```
  // req.header
  Authorization: Bearer ${token}
  
  // req.user
  {
    id: Number
  }
  
  // req.body
  {
    comment: String,
    post_id: Number
  }
```
  
## Screenshots

Landing Page:
![Image of SoberFriends Landing Page](https://github.com/A1Arman/SoberFriends/blob/master/src/screenshots/Landing.PNG)

Dashboard:
![Image of SoberFriends Dashboard](https://github.com/A1Arman/SoberFriends/blob/master/src/screenshots/Dashboard.PNG)

Create Post:
![Image of SoberFriends Add Post Page](https://github.com/A1Arman/SoberFriends/blob/master/src/screenshots/Add%20Post.PNG)

Post Page:
![Image of SoberFriends Posts Page](https://github.com/A1Arman/SoberFriends/blob/master/src/screenshots/Posts.PNG)

Profile:
![Image of SoberFriends Profile Page](https://github.com/A1Arman/SoberFriends/blob/master/src/screenshots/Profile.PNG)

## Built With

### Front-end
- React
- Vanilla JavaScript
- HTML
- CSS

### Back-End
- PostgreSQL
- Express
- Node
- Knex

### Testing
- Mocha
- Chai
- Jest
- Enzyme

### Authentication
- bcrypt
- JWTs

## Features
- Create Account
- Create a Post
- Comment on Posts
- See Comments on Posts
- Like Posts
- Unlike Posts
- Track money saved and days off addiction
- Update Posts
- Delete Posts 
- Delete Account
