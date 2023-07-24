const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    origin: String,
    destination: String,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],  //uno o muchos
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Post = model("Post", PostSchema);

module.exports = Post;
  