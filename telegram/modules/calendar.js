const _ = require("lodash")
const moment = require("moment")
const Template = require("../template")
const Database = require("../../database/actions")


module.exports = {
    getCalendar: async (ctx) => {
        const DAYS = ["S", "M", "T", "W", "T", "F", "S"]
        const emptyCallback = "NIL"
        const calendar = []

        // Populate header
        const dayData = []
        _.forEach(DAYS, (day) => {
            dayData.push({
                text: day,
                callback_data: emptyCallback,
            })
        })
        calendar.push(dayData)
        const now = moment()
        console.log(module.exports.getDatesInMonth(now.month() + 1, now.year()))

    },
    getDayOfMonth: (date) => {
        return moment(date).date()
    },
    getMonth: (date) => {
        return moment(date).month()
    },
    getYear: (date) => {
        return moment(date).year()
    },
    getToday: () => {
        return moment().toDate()
    },
    getPreviousMonthYear: (month, year) => {
        if (month === 1) {
            return {
                month: 12,
                year: year - 1,
            }
        }
        return {
            month: month - 1,
            year: year
        }
    },
    getNextMonthYear: (month, year) => {
        if (month === 12) {
            return {
                month: 1,
                year: year + 1,
            }
        }
        return {
            month: month + 1,
            year: year
        }
    },
    getDatesInMonth: (month, year) => {
        console.log(month, year)
        const daysInMonth = moment(`${month}-${year}`, "MM-YYYY").daysInMonth()
        const firstWeekday = moment(`${month}-${year}`, "MM-YYYY").startOf("month").weekday()
        const results = []
        var buffer = []

        const prevMonthYear = module.exports.getPreviousMonthYear(month, year)
        const prevDaysInMonth = moment(`${prevMonthYear.month}-${prevMonthYear.year}`, "MM-YYYY").daysInMonth()

        // Populate overflow dates from previous month
        for (var i = firstWeekday; i > 0; i--) {
            if (buffer.length === 7) {
                results.push(buffer)
                buffer= []
            }
            buffer.push({
                text: i,
                callback_data: module.exports.getSpecificDate(
                    prevMonthYear.month,
                    prevDaysInMonth - i,
                    prevMonthYear.year,
                ),
            })
        }

        // Populate dates of current month
        for (var j = 1; j <= daysInMonth; j++) {
            if (buffer.length === 7) {
                results.push(buffer)
                buffer= []
            }
            buffer.push({
                text: j,
                callback_data: module.exports.getSpecificDate(
                    month,              // From parameters
                    j,
                    year,
                ),
            })
        }

        // Each calendar view has 42 dates, inclusive of overflow from previous and next month
        if (_.size(_.flatten(results)) < 42) {
            const daysToAdd = 42 - _.size(_.flatten(results))
            const nextMonthYear = module.exports.getNextMonthYear(month, year)

            for (var k = 1; k <= daysToAdd; k++) {
                if (buffer.length === 7) {
                    results.push(buffer)
                    buffer= []
                }
                buffer.push({
                    text: k,
                    callback_data: module.exports.getSpecificDate(
                        nextMonthYear.month, 
                        k, 
                        nextMonthYear.year,
                    ),
                })
            }
        }
        return results
    },
    getSpecificDate: (month, day, year) => {
        // return moment(`${month}-${day}-${year}`, "MM-DD-YYYY").toDate()
        return `${year}-${month}-${day}`
    },
}