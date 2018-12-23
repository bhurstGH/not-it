const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("Post", () => {
    
    beforeEach( (done) => {
        
        this.topic;
        this.post;
        this.user;
        this.user2;
        this.user3;

        sequelize.sync({force: true}).then((res) => {
            
           User.bulkCreate([
                {
                    email: "starman@tesla.com",
                    password: "Trekkie4lyfe"
                }, {
                    email: "a@a.com",
                    password: "123456"
                }, {
                    email: "b@b.com",
                    password: "654321"
                }
            ], {returning: true})
           .then((users) => {
               this.user = users[0];
               this.user2 = users[1];
               this.user3 = users[2];
               Topic.create({
                title: "Expeditions to Alpha Centauri",
                description: "A compilation of reports from recent visits to the star system.",
                posts: [{
                  title: "My first visit to Proxima Centauri b",
                  body: "I saw some rocks.",
                  userId: this.user.id,
                  votes: [{
                      value: 1,
                      userId: this.user.id
                  },{
                      value: -1,
                      userId: this.user2.id
                  }, {
                      value: 1,
                      userId: this.user3.id
                  }]
                }]
              }, {
                include: [{
                  model: Post,
                  as: "posts",
                  include: [{
                      model: Vote,
                      as: "votes"
                  }]
                }]
              })
              .then((topic) => {
                this.topic = topic; 
                this.post = topic.posts[0]; 

                done();
              })
           })
        });
    });

    describe("#create()", () => {

        it("should create a post object with title, body, and assigned topic and user id", (done) => {
            Post.create({
                title: "Pros of Cryosleep during the journey",
                body: "1. Not having to answer the 'are we there yet?' question.",
                topicId: this.topic.id,
                userId: this.user.id
            })
            .then((post) => {
                expect(post.title).toBe("Pros of Cryosleep during the journey");
                expect(post.body).toBe("1. Not having to answer the 'are we there yet?' question.");
                expect(post.topicId).toBe(this.topic.id);
                expect(post.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a post with missing fields", (done) => {
            Post.create({
                title: "Pros of Cryosleep during the journey",
            })
            .then((post) => {
                done();
            }).catch((err) => {
                expect(err.message).toContain("Post.body cannot be null");
                expect(err.message).toContain("Post.topicId cannot be null");
                done();
            })
        });
        
    });

    describe("#setTopic()", () => {
        
        it("should associate a topic and a post", (done) => {
            Topic.create({
                title: "Challenges of interstellar travel",
                description: "1. The Wi-Fi is terrible"
            })
            .then((newTopic) => {
                expect(this.post.topicId).toBe(this.topic.id);
                this.post.setTopic(newTopic)
                .then((post) => {
                    expect(post.topicId).toBe(newTopic.id);
                    done();
                })
            })
        })
        
    })

    describe("#getTopic()", () => {
        
        it("should return the associated topic", (done) => {
            this.post.getTopic()
            .then((associatedTopic) => {
                expect(associatedTopic.title).toBe("Expeditions to Alpha Centauri");
                done();
            });
        });
        
    });

    describe("#setUser()", () => {
        
        it("should associate a post and a user together", (done) => {
            
            User.create({
                email: "ada@example.com",
                password: "password"
            })
            .then((newUser) => {
                expect(this.post.userId).toBe(this.user.id);
                this.post.setUser(newUser)
                .then((post) => {
                    expect(this.post.userId).toBe(newUser.id);
                    done();
                });
            });
            
        });
        
    });

    describe("#getUser()", () => {
        
        it("should return the associated topics", (done) => {
            
            this.post.getUser()
            .then((associatedUser) => {
                expect(associatedUser.email).toBe("starman@tesla.com");
                done();
            });
            
        });
        
    });

    describe("#getPoints()", () => {
        
        it("should return the number of votes a post has", (done) => {
            expect(this.post.getPoints()).toBe(1); //+1, -1, +1 = 1.
            done();
        })
        
    });

    describe("#hasUpvoteFor()", () => {
        
        it("should return true if the user has already upvoted", (done) => {
            expect(this.post.hasUpvoteFor(this.user.id)).toBe(true);
            expect(this.post.hasUpvoteFor(this.user2.id)).toBe(false);
            done();
        })
        
    });

    describe("#hasDownvoteFor()", () => {
        
        it("should return true if the user has already downvoted", (done) => {
            expect(this.post.hasDownvoteFor(this.user2.id)).toBe(true);
            expect(this.post.hasDownvoteFor(this.user3.id)).toBe(false);
            done();
        })
        
    })
    
})