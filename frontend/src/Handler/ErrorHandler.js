import $ from "jquery"

var showCounter = 0;
var successShowCounter = 0;

class ErrorHandler{

    static runError(data){
        const hideValue = ++showCounter
        $("#alert-danger").show();
        if(data.status === 403){
            $("#alert-danger").html("Not authorized or blocked")
        } else {
            if(data.responseJSON){
                if(data.responseJSON.code){
                    $("#alert-danger").html(data.responseJSON.code)
                } else {
                    $("#alert-danger").html("Check the data firtsly")
                }     
            }
            else {
                $("#alert-danger").html("No connection")
            }
        }

        setTimeout(function() { 
            if(showCounter == hideValue){
                $("#alert-danger").hide();
            }
        }, 3000);
    }
    
    static runSuccess(data){
        const hideValue = ++successShowCounter
        $("#alert-success").show();
        $("#alert-success").html(data.message)        

        setTimeout(function() { 
            if(successShowCounter == hideValue){
                $("#alert-success").hide();
            }
        }, 3000);
    }
        
    static runStringMessage(message){
        const hideValue = ++successShowCounter
        $("#alert-success").show();
        $("#alert-success").html(message)        

        setTimeout(function() { 
            if(successShowCounter == hideValue){
                $("#alert-success").hide();
            }
        }, 3000);
    }
    
    static runErrorStringMessage(message){
        const hideValue = ++successShowCounter
        $("#alert-danger").show();
        $("#alert-danger").html(message)        

        setTimeout(function() { 
            if(successShowCounter == hideValue){
                $("#alert-danger").hide();
            }
        }, 3000);
    }
}

export default ErrorHandler;