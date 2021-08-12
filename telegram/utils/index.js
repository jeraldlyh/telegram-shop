const _ = require("lodash")


module.exports = {
    determineStockLevel: function (quantity) {
        if (quantity) {
            return "🟢"
        }
        return "🔴"
    },
    convertValueToFloat: function (value) {
        return parseFloat(value.toFixed(2))
    },
    ...require("./route"),
    ...require("./scene")
}