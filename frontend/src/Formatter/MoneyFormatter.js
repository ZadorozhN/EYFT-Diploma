class MoneyFormatter {
    static fromatDollars(cents){
        let dollars = cents/100
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        })
        return formatter.format(dollars)
    }

    static fromatByn(cents){
        let rubles = cents/100
        var formatter = new Intl.NumberFormat('by-BY', {
            style: 'currency',
            currency: 'BYN',
        })
        return formatter.format(rubles)
    }
}

export default MoneyFormatter