const Advert = require("./models").Advertisement;

module.exports = {

    getAllAdverts(callback) {
        return Advert.findAll()
        .then(adverts => {
            callback(null, adverts);
        }).catch(err => {
            callback(err);
        })
    },
    getAdvert(id, callback) {

    },
    addAdvert(newAd, callback) {

    }
    
}