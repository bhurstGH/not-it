'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    body: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });
    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
  };
  Post.prototype.getPoints = function() {
    if (this.votes.length === 0) return 0;
    return this.votes
    .map((v) => {
      return v.value;
    }).reduce((prev, next) => {
      return prev + next;
    });
  };
  // helper function so the code is a bit DRYer
  const voteHelper = (votes, id, voteValue) => {
    let hasVote = votes.filter((vote) => {
      return vote.userId === id && vote.value === voteValue;
    });
    if (hasVote.length === 1 && hasVote[0].userId == id) {
      return true;
    } else {
      return false;
    }
  }
  Post.prototype.hasUpvoteFor = function(id) {
    return voteHelper(this.votes, id, 1);
  };
  Post.prototype.hasDownvoteFor = function(id) {
    return voteHelper(this.votes, id, -1);
  };
  
  return Post;
};