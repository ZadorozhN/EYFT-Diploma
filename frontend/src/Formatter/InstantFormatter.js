class InstantFormatter {
    static formatInstant(instant){
        var startInstant = new Date(instant * 1000);
        return startInstant.toLocaleString('en-GB', { hour12:false } )
    }
    
    static formatInstantMs(instant){
        var startInstant = new Date(instant);
        return startInstant.toLocaleString('en-GB', { hour12:false } )
    }
}

export default InstantFormatter