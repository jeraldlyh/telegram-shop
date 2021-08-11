const _ = require("lodash")


module.exports = {
    getPathData: function (path) {
        // Slice to remove preceding path i.e. /category/Electronics
        return path.length > 1 ? path.slice(1).split("/") : path
    },
    getRouteData: function (request) {
        const callbackData = request.split(" ")
        const method = callbackData[0]
        const data = callbackData[1] ? callbackData[1] : callbackData
        return [method, data]
    },
    getQueryParameters: function (query) {
        const parameters = query.split("&")
        const data = _.map(parameters, function (o) {
            return o.split("=")
        })
        return _.flatten(data)
    },
}