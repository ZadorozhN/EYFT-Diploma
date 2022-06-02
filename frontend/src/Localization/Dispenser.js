
import dictionaryEng from './DictionaryEng.js'
import dictionaryRu from './DictionaryRu.js'

function dispense(key) {
    let lang = localStorage.getItem("lang")

    let word

    if(lang == "ru"){
        word = dictionaryRu[key];
    } else {
        word = dictionaryEng[key];
    }

    if(word == undefined)
    {
        alert(`"${key}":"",`)
        word = key;
    }

    return word;
}


export { dispense }