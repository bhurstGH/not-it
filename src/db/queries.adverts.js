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
        return Advert.findByPk(id)
        .then(advert => {
            callback(null, advert);
        }).catch(err => {
            callback(err);
        })
    },
    addAdvert(newAd, callback) {
        return Advert.create({
            title: newAd.title,
            description: newAd.description
        })
        .then(advert => {
            callback(null, advert);
        }).catch(err => {
            callback(err);
        })
    },
    deleteAdvert(id, callback) {
        return Advert.destroy({
            where: {id}
        })
        .then(advert => {
            callback(null, advert);
        }).catch(err => {
            callback(err);
        })
    },
    updateAdvert(id, updatedAd, callback) {
        return Advert.findByPk(id)
        .then(advert => {
            if (!advert) {
                return callback("Ad doesn't exist");
            }

            advert.update(updatedAd)
            .then(() => {
                callback(null, advert);
            }).catch(err => {
                callback(err);
            });
        });
    }
    
}