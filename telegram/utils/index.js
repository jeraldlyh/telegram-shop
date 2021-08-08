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
    },
    disableWaitingStatus: function (ctx) {
        ctx.session.isWaiting.status = false
    },
    isTextMode: function (ctx) {
        return ctx.session.isWaiting && ctx.session.isWaiting.status
    },
    getCartMessageByID: function (ctx) {
        return _.find(ctx.session.cleanUpState, function (o) {
            return o.type === "cart"
        }).id
    },
    replaceCartMessageInState: function (ctx, data) {
        ctx.session.cleanUpState = _.map(ctx.session.cleanUpState, function (message) {         // Convert old cart message ID into text to prune
            if (message.type === "cart") {
                message.type = "user"
            }
            return message
        })
        module.exports.updateCleanUpState(ctx, data)
    },
    updateSystemMessageInState: function (ctx, message) {
        module.exports.updateCleanUpState(ctx, { id: message.message_id, type: "system" })
    },
    updateUserMessageInState: function (ctx, message) {
        module.exports.updateCleanUpState(ctx, { id: message.message_id, type: "user" })
    }
}