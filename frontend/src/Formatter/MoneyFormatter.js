class MoneyFormatter {
    static setLocale(locale){
        localStorage.setItem("locale", locale);
    }

    static formatDollars(cents){
        let dollars = cents/100
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        })
        return formatter.format(dollars)
    }

    static formatByn(cents){
        let rubles = cents/100
        var formatter = new Intl.NumberFormat('by-BY', {
            style: 'currency',
            currency: 'BYN',
        })
        return formatter.format(rubles)
    }

    static format(cents){
        let locale = localStorage.getItem("locale");

        if(locale === "By"){
            return MoneyFormatter.formatByn(cents);
        } else if (locale === "En") {
            return MoneyFormatter.formatDollars(cents);
        }

        return MoneyFormatter.formatByn(cents);
    }
}

export default MoneyFormatter