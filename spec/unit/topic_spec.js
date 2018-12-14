const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
    
    beforeEach( (done) => {
        
        this.topic;
        this.post;
        sequelize.sync({force: true}).then((res) => {
            
            Topic.create({
                title: "Expeditions to Alpha Centauri",
                description: "A compilation of reports from recent visits to the star system."
            })
            .then((topic) => {
                this.topic = topic;

                Post.create({
                    title: "My first visit to Proxima Centauri B",
                    body: "I saw some rocks.",
                    topicId: this.topic.id
                })
                .then((post) => {
                    this.post = post;
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
            
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
                topicId: this.topic.id
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