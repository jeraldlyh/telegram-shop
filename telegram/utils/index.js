const _ = require("lodash")


module.exports = {
    determineStockLevel: function (quantity) {
        if (quantity) {
            return "🟢"
        }
        return "🔴"
    },
    getPathData: function (path) {
        if (path === "/") {
            return [path]
        }
        return path.slice(1).split("/")     // Slice to remove preceding path
    },
    getRouteData: function (ctx) {
        const callbackData = ctx.callbackQuery.data.split(" ")
        const method = callbackData[0]
        const data = callbackData[1]
        return [method, data]
    },
    getQueryParameters: function (query) {
        const parameters = query.split("&")
        const data = _.map(parameters, function (o) {
            return o.split("=")
        })
        return _.flatten(data)
    },
    cleanUpMessage: async function (ctx, isObjectState, condition, update) {     // isObjectState to handle special cases in product scene
        for (const message of ctx.session.cleanUpState) {
            if (condition) {
                if (condition.includes(message.type)) {
                    ctx.telegram.deleteMessage(ctx.chat.id, isObjectState ? message.id : message)
                }
            } else {
                ctx.telegram.deleteMessage(ctx.chat.id, isObjectState ? message.id : message)
            }
        }

        if (update) {           // Update clean up state to prevent deletion errors
            ctx.session.cleanUpState = _.filter(ctx.session.cleanUpState, function (message) {
                if (!condition.includes(message.type)) {
                    return message
                }
            })
        }
    },
    updateCleanUpState: function (ctx, data) {
        ctx.session.cleanUpState = _.concat(ctx.session.cleanUpState, data)
    }
}