import React,{Component} from 'react'
import {
    AsyncStorage
} from 'react-native'
import keys from '../../../res/data/keys.json'
import langsData from '../../../res/data/langs.json'
export let FLAG_LANGUAGE={flag_language:'flag_language_language',flag_key:'flag_key_key'}
export default class LanguageDao{
    constructor(flag){
        this.flag=flag;
    }
    fetch(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.flag,(error,result)=>{
                if(error){
                    reject(error)
                }else{
                    if(result){
                        try{
                            resolve(JSON.parse(result))
                        }catch(e){
                            reject(e)
                        }
                    }else{
                        let data=this.flag===FLAG_LANGUAGE.flag_language?langsData:keys;
                        this.save(data)
                        resolve(data)
                    }
                }
            })
        })
    }

    save(data){
        AsyncStorage.setItem(this.flag,JSON.stringify(data),(error)=>{
            
        })
    }

}