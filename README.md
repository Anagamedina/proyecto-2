
## About
Este proyecto es una red social enfocada en el running, que permite a los usuarios compartir rutas que han realizado anteriormente y permite interactuar con dichas publicaciones a través de comentarios. Además, se implementará un modelo de rutas para lo cual se enlazará con la API de Strava.

  

![Project Image](.... "Project Image")

## Deployment
...

## Work structure
Características Principales

Registro de usuarios con roles diferenciados.
Inicio de sesión y cierre de sesión con contraseñas encriptadas.
Publicación, edición y eliminación de rutas realizadas por los usuarios.
Interacción mediante comentarios en las publicaciones de rutas.
Integración opcional con la API de Strava para crear un modelo de rutas personalizado.

## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd nameproyect
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: Boolean,
});

const User = mongoose.model('User', userSchema);

``` 
#### post.model.js
```js
const postSchema = new Schema({
  title: { type: String, required: true },
  content: String,
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],

});

const Post = mongoose.model('Post', postSchema);

```
#### Comment.model.js
```js
const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },

});

const Comment = mongoose.model('Comment', commentSchema);

```
#### ruta.model.js
```js
const routeSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 
});

const Route = mongoose.model('Route', routeSchema);


```
## User roles
 Usuario
  Pueden iniciar sesión y registrarse.
  Pueden leer todas las rutas publicadas.
  Pueden crear y eliminar sus propias rutas.
  Pueden comentar en las rutas de otros usuarios.
  isAdmin: false

Administrador
  Pueden iniciar sesión y registrarse.
  Tienen todas las capacidades de los usuarios normales.
  Pueden editar o eliminar todas las rutas.
  Pueden ver todas las órdenes de los usuarios.
  isAdmin: true

## Routes
|Method|Endpoint|Require                                               |Response (200)                                                    |Action                                                            |
|------|--------|------------------------------------------------------|------------------------------------------------------------------|------------------------------------------------------------------|
|POST  |/signup |const { username, email, password } = req.body        |({user: user})                                                |Registers the user in the database and returns the logged in user.|
|POST  |	/login |const { email, password } = req.body                  |({authToken: authToken})                                      |Logs in a user already registered.                                |
|GET   |/posts  |-                                                     |([allPosts])                                                  |Returns an array with posts                                       |
|GET   |/posts/:postId|const { postId} = req.params                          |({post: post})                                                |Returns a post                                                    |
|POST  |/posts/new|const { title, description, image, userId} = req.body |({post: post})                                                |Saves the post in the database                                    |
|PUT   |/posts/:postId|const { postId} = req.params                          |({post: post})                                                |Updates the post in the database                                  |
|DELETE|/posts/:postId|const { postId} = req.params                          |({message: "Post with postId was removed successfully."})     |Removes the post from the database                                |
|GET   |/comments/:postId|const { postId} = req.params                          |([comments])                                                  |Returns an array with all the comments of a post                  |
|POST  |/comments/new|const { title, description, userId, postId} = req.body|({comment: comment})                                          |Saves the comment in the database                                 |
|PUT   |/comments/:commentId|const { commentId } = req.params                      |({commentId: commentId})                                      |Updates the commentIdin the database                              |
|DELETE|/comments/:commentId|const { commentId } = req.params                      |({message: "Commnet with commentIdwas removed successfully."})|Removes the comment from the database                             |

---

