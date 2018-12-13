const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advert = require("../../src/db/models").Advertisement;

describe("routes : advertisement", () => {

    beforeEach(done => {
        this.advert;
        sequelize.sync({force: true}).then(res => {

            Advert.create({
                title: "Sale Ad!",
                description: "Best deals of the year!"
            })
            .then(advert => {
                this.advert = advert;
                done();
            }).catch(err => {
                console.log(err);
                done();
            });
        });
    });

    describe("GET /advertisements", () => {

        it("should return status code 200 and have 'Advertisement' in the body and list the ads", done => {

            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Sale Ad!");
                expect(body).toContain("Advertisements");
                done();
            });
            
        });
        
    });

    describe("GET /advertisements/new", () => {

        it("shoulder render a new advertisement form", done => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Advertisement");
                done();
            });
        });
        
    });

    describe("POST /advertisements/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "Everything half off!",
                description: "All inventory prices cut in half!"
            }
        };

        it("should create a new ad and redirect", done => {

            request.post(options, (err, res, body) => {
                Advert.findOne({where: {title: "Everything half off!"}})
                .then(advert => {
                    expect(res.statusCode).toBe(303);
                    expect(advert.title).toBe("Everything half off!");
                    expect(advert.description).toBe("All inventory prices cut in half!");
                    done()
                }).catch(err => {
                    console.log(err);
                    done();
                });
            });
            
        });
        
    });

    describe("GET /advertisements/:id", () => {

        it("should render the selected id's view", done => {
            request.get(`${base}${this.advert.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sale Ad!");
                done();
            });
        });
        
    });

    describe("POST /advertisements/:id/destroy", () => {
        
        it("should delete the topic with the id provided", done => {
            Advert.findAll()
            .then(adverts => {
                const advertCountBefore = adverts.length;
                expect(advertCountBefore).toBe(1);
                request.post(`${base}${this.advert.id}/destroy`, (err, res, body) => {
                    Advert.findAll()
                    .then(adverts => {
                        expect(err).toBeNull();
                        expect(adverts.length).toBe(advertCountBefore - 1);
                        done();
                    });
                });
            });
        });
        
    });

    describe("GET /advertisements/:id/edit", () => {

        it("should render an edit view for the ad", done => {
            request.get(`${base}${this.advert.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Advertisement");
                expect(body).toContain("Sale Ad!");
                done();
            });
        });
        
    });

    describe("POST /advertisements/:id/update", () => {

        it("should update the advertisement", done => {
            const options = {
                url: `${base}${this.advert.id}/update`,
                form: {
                    title: "Huge Sale Ad!",
                    description: "Even bigger!"
                }
            };

            request.post(options, (err, res, body) => {
                expect(err).toBeNull();
                Advert.findOne({
                    where: {id: this.advert.id}
                })
                .then(advert => {
                    expect(advert.title).toBe("Huge Sale Ad!");
                    done();
                });
            });
        });
        
    });
    
});