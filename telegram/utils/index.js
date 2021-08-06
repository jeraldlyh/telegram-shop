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
    }
}