const advertQueries = require("../db/queries.adverts.js");

module.exports = {

    index(req, res, next) {
        advertQueries.getAllAdverts( (err, adverts) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("advertisements/index", {adverts});
            }
        })
    }
    
}