import axios from "axios";
import ErrorHandler from "../../Handler/ErrorHandler";
import { dispense } from "Localization/Dispenser";

class BankClient {
    withdraw(login, cents) {

        const dto = {
            login: login,
            delta: cents
        }

        console.log("Withdraw for " + dto)

        axios.post('/bank/withdraw',
            dto,
            {
                "Content-Type": "application/json"
            })
            .then(function (response) {
                ErrorHandler.runStringMessage(response.data.message);
            })
            .catch(function (response) {
                ErrorHandler.runErrorStringMessage(dispense("notEnoughAmountOfMoney"));
            })  
    }

    deposit(login, cents) {

        const dto = {
            login: login,
            delta: cents
        }

        console.log("Deposit on " + dto)

        axios.post('/bank/deposit',
            dto,
            {
                "Content-Type": "application/json"
            })
            .then(function (response) {
                ErrorHandler.runStringMessage(response.data.message);
            })
            .catch(function (response) {
                ErrorHandler.runErrorStringMessage(dispense("bankErrorPleaseTryAgainLater"));
            })
    }
}

export default BankClient