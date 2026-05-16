import sequelize from "../db/config.js"
import User  from "./User.js"
import Post  from "./Post.js"
import Comment  from "./Comment.js"
import Follower  from "./Follower.js"
import Collection  from "./Collection.js"
import Interest  from "./Interest.js"
import Photo  from "./Photo.js"
import Rating  from "./Rating.js"
import Tag  from "./Tag.js"

//un usuario tiene muchas publicaciones
User.hasMany(Post, { foreignKey: 'idUser'})
Post.belongsTo(User, { foreignKey: 'idUser'})

//una publicación tiene muchas etiquetas y una etiqueta pertenece a muchas publicaciones
Post.belongsToMany(Tag, { through: 'PostTags', foreignKey: 'idPost'})
Tag.belongsToMany(Post, { through: 'PostTags', foreignKey: 'idTag'})

//una publicación tiene muchas fotos
Post.hasMany(Photo, { foreignKey: 'idPost'})
Photo.belongsTo(Post, { foreignKey: 'idPost'})

//una foto tiene muchos comentarios
Post.hasMany(Comment, { foreignKey: 'idPhoto'})
Photo.belongsTo(Photo, { foreignKey: 'idPhoto'})

//un usuario escribe muchos comentarios
User.hasMany(Comment, { foreignKey: 'idUser'})
Comment.belongsTo(User, { foreignKey: 'idUser'})

//una foto tiene muchas valoraciones
Photo.hasMany(Rating, { foreignKey: 'idPhoto'})
Rating.belongsTo(Photo, { foreignKey: 'idPhoto'})

//un usuario hace muchas valoraciones
User.hasMany(Rating, { foreignKey: 'idUser'})
Rating.belongsTo(User, { foreignKey: 'idUser'})

//un usuario puede seguir a muchos usuarios y ser seguido por muchos
User.belongsToMany(User, {
  through: Follower,
  as: 'following',        
  foreignKey: 'idFollower',
  otherKey: 'idFollowee',
})
User.belongsToMany(User, {
  through: Follower, 
  as: 'followers',       
  foreignKey: 'idFollowee',
  otherKey: 'idFollower',
})


export async function connectDatabase(){
    try{
        await sequelize.authenticate();
        console.log("conexion a bd establecida")
        await sequelize.sync({ alter: true })
        console.log("sincronizando los modelos")
    }catch (err){
        console.error("error en la conexion a la bd", err)
    }
}