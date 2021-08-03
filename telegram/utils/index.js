module.exports = {
    determineStockLevel: function (quantity) {
        if (quantity) {
            return "🟢"
        }
        return "🔴"
    }
}