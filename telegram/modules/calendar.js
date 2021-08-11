const { Markup } = require("telegraf")
const _ = require("lodash")
const moment = require("moment")
const Constants = require("../constants")
const Template = require("../template")


module.exports = {
    sendCalendarMessage: async function (ctx) {
        return await ctx.reply(Template.calendarMessage(), Markup.inlineKeyboard(module.exports.getCalendar()))
    },
    sendConfirmationMessage: async function (ctx, date) {
        return await ctx.replyWithHTML(Template.dateConfirmationMessage(date), Template.confirmationButtons())
    },
    getCalendar: function (month) {
        const now = month ? moment().add(1, "months") : moment()

        var calendar = [[{
            text: `${now.format("MMMM")} ${now.year()}`,
            callback_data: "NIL"
        }]]

        // Populate header
        const dayData = []
        _.forEach(Constants.DAYS(), function (day) {
            dayData.push({
                text: day,
                callback_data: "NIL",
            })
        })
        calendar.push(dayData)

        // Merge header with dates
        const dates = module.exports.getDatesInMonth(now.month() + 1, now.year())
        const toggleButtons = module.exports.getToggleButtons()
        calendar = _.concat(calendar, dates, toggleButtons)

        return calendar
    },
    getToggleButtons: function () {
        const buttons = [[
            { text: "<", callback_data: "Previous" },
            { text: " ", callback_data: "NIL" },
            { text: ">", callback_data: "Next" }
        ]]
        return buttons
    },
    getDayOfMonth: function (date) {
        return moment(date).date()
    },
    getMonth: function (date) {
        return moment(date).month()
    },
    getYear: function (date) {
        return moment(date).year()
    },
    getToday: function () {
        return moment().toDate()
    },
    getPreviousMonthYear: function (month, year) {
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
    getNextMonthYear: function (month, year) {
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
    getDatesInMonth: function (month, year) {
        const daysInMonth = moment(`${month}-${year}`, "MM-YYYY").daysInMonth()
        const firstWeekday = moment(`${month}-${year}`, "MM-YYYY").startOf("month").weekday()
        const results = []
        var buffer = []

        // const prevMonthYear = module.exports.getPreviousMonthYear(month, year)
        // const prevDaysInMonth = moment(`${prevMonthYear.month}-${prevMonthYear.year}`, "MM-YYYY").daysInMonth()

        // Populate overflow dates from previous month
        for (var i = firstWeekday; i > 0; i--) {
            if (buffer.length === 7) {
                results.push(buffer)
                buffer.length = 0
            }
            buffer.push({
                text: " ",
                callback_data: "NIL",
                // callback_data: module.exports.getSpecificDate(
                //     prevMonthYear.month,
                //     prevDaysInMonth - i,
                //     prevMonthYear.year,
                // ),
            })
        }

        // Populate dates of current month
        for (var j = 1; j <= daysInMonth; j++) {
            if (buffer.length === 7) {
                results.push(buffer)
                buffer.length = 0
            }
            buffer.push({
                text: j,
                callback_data: module.exports.getSpecificDate(
                    month,
                    j,
                    year,
                ),
            })
        }

        // Each calendar view has 42 dates, inclusive of overflow from previous and next month
        if (_.size(_.flatten(results)) < 42) {
            const daysToAdd = 42 - _.size(_.flatten(results))
            // const nextMonthYear = module.exports.getNextMonthYear(month, year)

            for (var k = 1; k <= daysToAdd; k++) {
                if (buffer.length === 7) {
                    results.push(buffer)
                    buffer.length = 0
                }
                buffer.push({
                    text: " ",
                    callback_data: "NIL",
                    // callback_data: module.exports.getSpecificDate(
                    //     nextMonthYear.month, 
                    //     k, 
                    //     nextMonthYear.year,
                    // ),
                })
            }
        }
        return results
    },
    getSpecificDate: function (month, day, year) {
        // return moment(`${month}-${day}-${year}`, "MM-DD-YYYY").toDate()
        month = month < 10 ? "0" + month : month
        day = day < 10 ? "0" + day : day
        return `${day}-${month}-${year}`
    },
}