
import {
    AsyncStorage
} from 'react-native'
export let FLAG_STORAGE = { flag_popular: 'popular', flag_trending: 'trending' }
import GitHubTrending from 'GitHubTrending'
export default class DataRepository {
    constructor(flag) {
        this.flag = flag;
        if (flag === FLAG_STORAGE.flag_trending) this.trending = new GitHubTrending();
    }
    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            //获取本地数据
            
            this.fetchLocalRepository(url)
                .then(result => {
                    if (result) {
                        resolve(result)
                    } else {
                        this.fetchNetRepository(url)
                            .then(result => {
                                resolve(result)
                            }).catch(e => {
                                resolve(e)
                            })
                    }
                }).catch(e => {
                    this.fetchNetRepository(url)
                        .then(result => {
                            reject(result)
                        }).catch(e => {
                            reject(e)
                        })
                })
        })
    }

    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
             
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e)
                    }
                } else {
                    reject(error)
                }
            })
        })

    }

    // fetchNetRepository(url) {
    //     return new Promise((resolve, reject) => {
    //         if (this.flag === FLAG_STORAGE.trending) {
    //             this.trending.fetchTrending(url)
    //                 .then(result => {
    //                     if (!result) {
    //                         reject(new Error('responseData is null'))
    //                         return
    //                     }
    //                     this.saveRepository(url,result)
    //                     resolve(result)
    //                 })
    //         } else {

    //             fetch(url)
    //                 .then(response => response.json())
    //                 .then(result => {
    //                     if (!result) {
    //                         reject(new Error('responseData is null'))
    //                         return
    //                     }
    //                     resolve(result.items)
    //                     this.saveRepository(url, result.items)
    //                     // resolve(result)
    //                 })
    //                 .catch(error => {
    //                     reject(error)
    //                 })

    //         }

    //     })
    // }



        fetchNetRepository(url){
            return new Promise((resolve,reject)=>{
                if(this.flag==FLAG_STORAGE.flag_trending){
                    
                    this.trending.fetchTrending(url)
                        .then(result=>{
                            if(!result){
                               
                                reject(new Error('数据为空'))
                                return;
                            }
                           
                            this.saveRepository(url,result);
                            resolve(result)
                        })
                }else{
                 
                fetch(url)
                    .then((response)=>response.json())
                    .catch((error)=>{
                        reject(error);
                    }).then((responseData)=> {
                        if(!responseData || !responseData.items){
                            reject(new Error('数据为空'));
                            return
                        }
                        resolve(responseData.items)
                        this.saveRepository(url,responseData.items)
                    }).done();
                }

            })
        }



    saveRepository(url, items, callback) {
        if (!url || !items) {
            return;
        }
        let wrapData = { items: items, update_date: new Date().getTime() };
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback)
    }

    checkData(longTime) {
        return false
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime)
        if (cDate.getMonth() !== tDate.getMonth()) return false;
        if (cDate.getDay() !== tDate.getDay()) return false;
        if (cDate.getHours() - tDate.getHours() > 4) return false;
        return true

    }
}