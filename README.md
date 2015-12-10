###这是一个什么
它叫zepto.error.js，它依赖zepto，主要支持手机端的验证工具。

####怎么使用它
你需要在元素上添加js-error类，这样工具会检测到这个元素，并查找元素上存在需要检验的过程  
例如：当元素上存在js-error和js-error-null时，工具就进行js-error-null的检测过程


~~~~javascript
//这样它检验页面中所有标记需要检验的元素
$("body").checkError()

//这样它会只检验页面中有js-error-null和js-error-email标记的元素
$("body").checkError({
	only_check: {
		js-error-null:true,
		js-error-email:true
	}
})

//这样它会只检验页面中，但不会提示
$("body").checkError({
	prompt_show: false
})
~~~~

####检测方法太少不能满足项目？没关系
~~~~javascript
//
$.addCheckFn({
	"js-error-XXX": function(){
		//我们需要在这里书写我们自己验证方式，并返回一个boolean值
		alert(1)
		return true
	}
})
~~~~