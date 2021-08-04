module.exports = {
    determineStockLevel: function (quantity) {
        if (quantity) {
            return "🟢"
        }
        return "🔴"
    },
    getCallbackPaths: function (path) {
        if (path === "/") {
            return [path]
        }
        return path.slice(1).split("/")     // Slice to remove preceding path
    },
}