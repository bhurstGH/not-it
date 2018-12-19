const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User =require("../../src/db/models").User;

describe("Topic", () => {
    
    beforeEach( (done) => {
        
        this.topic;
        this.post;
        this.user;
        sequelize.sync({force: true}).then((res) => {
            
            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Expeditions to Alpha Centauri",
                    description: "A compilation from recent visits to the star system.",
                    posts: [{
                        title: "My first visit to Proxima Centauri b",
                        body: "I saw some rocks.",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
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
        
        it("should create and store a valid topic in the database", (done) => {
            Topic.create({
                title: "Spaaaaaaace",
                description: "I'm in spaaaaace!"
            })
            .then((topic) => {
                expect(topic.title).toBe("Spaaaaaaace");
                expect(topic.description).toBe("I'm in spaaaaace!");
                done();
            }).catch((err) => {
                console.log(err);
                done();
            });
        });
        
    });

    describe("#getPosts()", () => {
        
        it("should return associated posts when called", (done) => {
            Post.create({
                title: "Are you in space?",
                body: "You're in spaaaace!",
                topicId: this.topic.id,
                userId: this.user.id
            }).then((post) => {
                    
                this.topic.getPosts()
                .then((posts) => {
                    expect(posts.length).toBe(2);
                    expect(posts[1].body).toBe("You're in spaaaace!");
                    expect(posts[1].topicId).toBe(this.topic.id);
                    done();
                })
            })
        });
        
    });

})