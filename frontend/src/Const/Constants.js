import $ from "jquery"

const roleAdmin = "ROLE_ADMIN"
const roleUser = "ROLE_USER"
const roleArranger = "ROLE_ARRANGER"

class Constants{

    static getAdminRole(){
        return roleAdmin
    }

    static getUserRole(){
        return roleUser
    }
    
    static getArrangerRole(){
        return roleArranger
    }

    static isAnyRole(role){
        return role === roleAdmin || role === roleUser || role === roleArranger
    }
    
    static isArrangerOrHigher(role){
        return role === roleAdmin || role === roleArranger
    }
    
    static isAdmin(role){
        return role === roleAdmin
    }

    static updateRole(role){
        if(role.startsWith("ROLE_")){
            localStorage.setItem("role", role);
        } else {
            localStorage.setItem("role", "ROLE_" + role);
        }
    }
}

export default Constants;