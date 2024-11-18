// const config = ENV[node_env]
const moment = require('moment')

export class formatDate {
    constructor() { }

    dateFileControl(date){
        return moment(date).format('YYYYMMDDHHmmSS')
    }

    dateFormat(date){
        return moment(date).format('YYYY/MM/DD')
    }

    // formato para archivo de intervalo
    dateFileControlJson(interval,period){
        return moment().add(interval,period).format('YYYY-MM-DD') 
    }

    // diff
    diffDays(date1, date2) {
        const a = moment(date1)
        const b = moment(date2)
        return a.diff(b, 'days')
    }

    addDaysYYYYMMDD(date, days){
        return moment(date).add(days,'day').format('YYYY-MM-DD')
    }
}

// module.exports = formatDate;