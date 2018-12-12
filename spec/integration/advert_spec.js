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
    
});