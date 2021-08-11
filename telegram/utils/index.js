const _ = require("lodash")


module.exports = {
    determineStockLevel: function (quantity) {
        if (quantity) {
            return "🟢"
        }
        return "🔴"
    },
    ...require("./route"),
    ...require("./scene")
}