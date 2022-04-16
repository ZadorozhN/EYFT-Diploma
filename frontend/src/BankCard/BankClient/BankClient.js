import axios from "axios";
import ErrorHandler from "../../Handler/ErrorHandler";

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
                ErrorHandler.runErrorStringMessage("Not enough amount of money");
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
                ErrorHandler.runErrorStringMessage("Bank error. Please try again later");
            })
    }
}

export default BankClient