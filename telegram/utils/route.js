const _ = require("lodash")


module.exports = {
    getRouteData: function (request) {
        const callbackData = request.split("/")
        const method = callbackData[0].trim()
        const data = _.slice(callbackData, 1, callbackData.length)
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