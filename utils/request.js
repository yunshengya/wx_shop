 
// 封装微信网络请求
let request =  (url,method="get",data={})=>{
  // 只有promise对象才能使用async await
  // new 一个promise其实就是一个回调函数
  return new Promise((resolve,reject)=>{
  // resolve成功之后做的事
  // reject失败之后做的事
  // 对象不能传值,url,method,data只有方法可以传值
  // 然后返回一个promise
  wx.request({
    url:"http://192.168.1.106:3000/"+url,
    method,
    data,
   success: (res) => { //成功之后返回的结果
   			// resolve 成功之后做的事情  只需要拿到data的数据
   			resolve(res.data)
   		},
   		fail: (err) => {
   			// reject 失败之后做的事情
   			reject(err)
   		}
  })
})
}
 
export default {
	get(url,data){
		return  request(url,"get",data)
	},
	post(url,data){
		return  request(url,"post",data)
	},
	delete(url,data){
		return  request(url,"delete",data)
	},
	put(url,data){
		return  request(url,"put",data)
	},
}