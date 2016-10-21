window.onload = function () {


	/* 参数设置(默认) */
	windowOnTop = true;
	finishAutoRest = true;
	clockTime = 3;
	clockSRestTime = 5;
	clockLRestTime = 15;
	lRestInterval = 4;
	soundRemind = true;
	tick = true;
	soundMission = null;
	soundRest = null;
	soundMissionDef = null;
	soundRestDef = null;
	autoRest = true;
	/* 参数设置结束 */


	var oNav = document.getElementById("nav");
 	var oNavAs = oNav.getElementsByTagName("a");
 	var oPanle = document.getElementById("panle");
 	var oPanles = new Array();
 	for (var i = 0; i < oPanle.childNodes.length; i++) {
 		if (oPanle.childNodes[i].nodeType == 1 & i != 1) {
 			oPanles.push(oPanle.childNodes[i]);
 		}
 	}
 	for (var i = 0; i < oNavAs.length; i++) {
 		oNavAs[i].index = i;
 		oNavAs[i].onclick = function () {
 			for (var i = 0; i < oNavAs.length; i++) {
 				oNavAs[i].className = "";
 				this.className = "on";
 				oPanles[i].className = "hidden";
 				oPanles[this.index].className = "";
 			}
 		}	
 	}

 	
 	var oSet = document.getElementById("set");
 	var oMenuBtns = oSet.getElementsByClassName("button");
 	var oMenuSet = document.getElementById("menu-set");
 	var oMenuSetPanles = new Array();
 	for (var i = 0; i < oMenuSet.childNodes.length; i++) {
 		if (oMenuSet.childNodes[i].nodeType == 1) {
 			oMenuSetPanles.push(oMenuSet.childNodes[i]);
 		}
 	}
 	for (var i = 0; i < oMenuBtns.length; i++) {
 		oMenuBtns[i].index = i;
 		oMenuBtns[i].onclick = function () {
 			for (var i = 0; i < oMenuBtns.length; i++) {
 				oMenuBtns[i].className = "button";
 				this.className = "button on";
 				oMenuSetPanles[i].className = "hidden";
 				oMenuSetPanles[this.index].className = "";
 			}
 		}
 	}

 	
 	var oRadios = oPanle.getElementsByClassName("radio");
 	var oRadiosUls = oPanle.getElementsByClassName("radio-ul");
 	for (var i = 0; i < oRadios.length; i++) {
 		(function (index) {
 			oRadios[index].index = index;
 			oRadios[index].onclick = function () {
 				if (oRadiosUls[this.index].offsetLeft >= 0) {
 					startMove(oRadiosUls[this.index], {left : -50});
 				} else {
 					startMove(oRadiosUls[this.index], {left : 0});
 				}
 			}
 		})(i)
 	}


 	var oMain = oPanles[0];
 	var oBtn = oMain.getElementsByTagName("div")[0];
 	oBtn.onclick = function () {
 		if (oAddMission.className != "") {
 			oAddMission.className = "";
 		}
 	}


 	var oAddMission = document.getElementById("addMission");
 	var oAddMissionNavClose = document.getElementById("addMission-nav-close");
 	var oCount = document.getElementsByTagName("strong")[0];
 	var oCountValue;
 	var oAddMissionFootButtonConfirm = document.getElementById("addMission-foot-button-confirm");
 	var oMissionName = document.getElementById("missionName");
 	var oMissionNameValue;
 	var subOrAdd = function () {
 		document.getElementById("addMission-main-button-sub").onclick = function () {
   			if (parseInt(oCount.innerHTML) > 1) {
   				oCount.innerHTML = parseInt(oCount.innerHTML) - 1;
   			}
   		}
 		document.getElementById("addMission-main-button-add").onclick = function () {
   			oCount.innerHTML = parseInt(oCount.innerHTML) + 1;
   		}
 	}
 	subOrAdd();
 	oAddMission.onclick = function (e) {
		var e = e || window.event;
    	var elem = e.target || e.srcElement;
    	if (elem.id == "addMission-nav-close" || elem.id == "addMission-foot-button-cancel") {
   			oAddMission.className = "noClick";
   			oCount.innerHTML = 1;
   			oMissionName.value = "";
   			return;
   		}
   		if (elem.id == "addMission-main-button-sub" || elem.id == "addMission-main-button-add" || elem.id == "addMission-foot-button-confirm") {
   			return;
   		}
   		while(elem) {
   			if (elem.id == "addMission") {
   				if (oAddMission.className != "") {
   					oAddMission.className = "";
   				}
   				return;
   			} else {
   				elem = elem.parentNode;
   				oAddMission.className = "noClick";
   			}
   		}
 	}


 	function Sleep(d){
 	  for(var t = Date.now();Date.now() - t <= d;);
 	}


 	au = document.createElement("audio");
 	au.preload="auto";
 	function PlaySound(src) {
 		au.src = src;
 		au.play();
 	}
 	

 	function Mission(index, missionName, workTime, restTime, count) {
		this.index = index;
		this.missionName = missionName;
		this.workTime = workTime;
		this.restTime = restTime;
		this.count = count;
		this.beginTime = new Date('2016/11/11 00:00:00');
		this.endTime = new Date('2016/11/11 00:00:00');
		this.endTime.setSeconds(workTime);
		this.workLeftTime = parseInt((this.endTime.getTime() - this.beginTime.getTime()) / 1000);
		this.endTime.setSeconds(restTime);
		this.restLeftTime = parseInt((this.endTime.getTime() - this.beginTime.getTime()) / 1000);
		this.finishCount = 0;
		this.isWorking = true;
		this.oSpan1;
		this.oSpan2;
		this.oSpan3;
		this.oSpan4;
		this.oSpan5;
		working = false;
		SetTime = function (obj) {
			// PlaySound("../番茄时钟/audio/tick.mp3");
			// console.log(1);
	 		if (obj.isWorking) {
				// console.log(2);
				obj.workLeftTime--;
				if (obj.workLeftTime < 0) {
		 			PlaySound("../番茄时钟/audio/work.mp3");
					// console.log(3);
			 		clearTimeout(timekeeper);
		 			obj.finishCount++;
		 			// console.log(obj.oSpan1);
		 			obj.oSpan1.innerHTML = obj.finishCount + "/" + obj.count;
		 			// console.log(obj.oSpan1.innerHTML);
		 			obj.restLeftTime = obj.restTime;
		 			obj.isWorking = false;
		 			obj.oSpan2.style.display = "none";
		 			obj.oSpan3.style.display = "none";
		 			obj.oSpan4.style.display = "inline-block";
	 			}
	 		} else {
				// console.log(4);
				obj.restLeftTime--;
		 		if (obj.restLeftTime < 0) {
		 			PlaySound("../番茄时钟/audio/rest.mp3");
		 			// console.log(5);
			 		if (obj.finishCount == obj.count) {
			 			obj.oSpan2.style.display = "none";
			 			obj.oSpan3.style.display = "none";
			 			obj.oSpan4.style.display = "none";
			 			obj.oSpan5.style.display = "inline-block";
			 			oH1.innerHTML = "番茄计时器";
			 			working = false;
			 			return;
			 		} else {
				 		clearTimeout(timekeeper);
				 		obj.workLeftTime = obj.workTime;
				 		obj.isWorking = true;
				 		obj.oSpan2.style.display = "inline-block";
			 			obj.oSpan3.style.display = "inline-block";
			 			obj.oSpan4.style.display = "none";
			 		}
		 		}
	 		}
			// console.log(6);
	 		obj.ShowTime();
	 		timekeeper = setTimeout(function () {
		 		SetTime(obj);
		 	}, 1000);
		 	console.count();
	 	}
	 	// var timekeeper = setInterval(function () {
	 	// 	SetTime(obj);
	 	// }, 1000);
	}

	Mission.prototype = {
		constructor : Mission,
		GetMissionName : function () {
			return this.missionName;
		},
		GetIndex : function () {
			return this.index;
		},
		SetWorkTime : function () {
			this.endTime.setSeconds(this.workTime);
			this.workLeftTime = parseInt((this.endTime.getTime() - this.beginTime.getTime()) / 1000);
		},
		SetRestTime : function () {
			this.endTime.setSeconds(this.restTime);
			this.restLeftTime = parseInt((this.endTime.getTime() - this.beginTime.getTime()) / 1000);
		},
		GetCount : function () {
			return this.count;
		},
		GetWorkTime : function () {
			return this.workTime;
		},
		GetRestTime : function () {
			return this.restTime;
		},
		CreateMissionList : function () {
			var oUl = document.createElement("ul");
			var oLi = document.createElement("li");
			var oSpan1 = document.createElement("span");
			oSpan2 = document.createElement("span");
			oSpan3 = document.createElement("span");
			var oSpan4 = document.createElement("span");
			var oSpan5 = document.createElement("span");
			this.oSpan1 = oSpan1;
			this.oSpan2 = oSpan2;
			this.oSpan3 = oSpan3;
			this.oSpan4 = oSpan4;
			this.oSpan5 = oSpan5;
			var oStrong = document.createElement("strong");
			var oSpan2A = document.createElement("a");
			var oSpan3A = document.createElement("a");
			// var oSpan4A = document.createElement("a");
			// var oSpan5A = document.createElement("a");
			var oSpan2I = document.createElement("i");
			var oSpan3I = document.createElement("i");
			var oSpan4I = document.createElement("i");
			var oSpan5I = document.createElement("i");
			var oDiv = document.createElement("div");
			oSpan1.innerHTML = this.finishCount + "/" + this.count;
			if (oMissionName.value) {
				oStrong.innerHTML = oMissionName.value;
			} else {
				oStrong.innerHTML = oMissionName.placeholder;
			}
			oSpan2I.className = "iconfont";
			oSpan3I.className = "iconfont";
			oSpan4I.className = "iconfont";
			oSpan5I.className = "iconfont";
			oSpan2I.innerHTML = "&#xe609;";  //开始按钮
			oSpan3I.innerHTML = "&#xe636;";  //删除按钮
			oSpan4I.innerHTML = "&#xe64b; 休息一下!";  //时钟按钮
			oSpan5I.innerHTML = "&#xe602; 任务完成!";  //完成按钮
			oSpan1.className = "span1";
			oSpan2.className = "span2";
			oSpan4.className = "span4";
			oSpan5.className = "span5";
			oSpan2A.appendChild(oSpan2I);
			oSpan3A.appendChild(oSpan3I);
			// oSpan4A.appendChild(oSpan4I);
			// oSpan5A.appendChild(oSpan5I);
			oSpan2.appendChild(oSpan2A);
			oSpan3.appendChild(oSpan3A);
			// oSpan4.appendChild(oSpan4A);
			// oSpan5.appendChild(oSpan5A);
			oSpan4.appendChild(oSpan4I);
			oSpan5.appendChild(oSpan5I);
			oDiv.appendChild(oSpan1);
			oDiv.appendChild(oSpan2);
			oDiv.appendChild(oSpan3);
			oDiv.appendChild(oSpan4);
			oDiv.appendChild(oSpan5);
			oLi.appendChild(oStrong);
			oLi.appendChild(oDiv);
			oUl.appendChild(oLi);
			oDivMissionList.appendChild(oUl);
			oCount.innerHTML = 1;
   			oMissionName.value = "";
			oAddMission.className = "noClick";
		},
		ShowTime : function () {
			missionWorkTimeM = parseInt(this.workLeftTime / 60);
			missionWorkTimeS = parseInt(this.workLeftTime % 60);
			missionRestTimeM = parseInt(this.restLeftTime / 60);
			missionRestTimeS = parseInt(this.restLeftTime % 60);
		 	oH1 = document.getElementsByTagName("h1")[0];
		 	if (this.isWorking) {
		 		if (missionWorkTimeM < 10 && missionWorkTimeM.toString().length < 2) {
		 			missionWorkTimeM = "0" + missionWorkTimeM;
		 		}
		 		if (missionWorkTimeS < 10 && missionWorkTimeS.toString().length < 2) {
		 			missionWorkTimeS = "0" + missionWorkTimeS;
		 		}
		 		oH1.innerHTML = missionWorkTimeM + "  :  " + missionWorkTimeS;
		 	} else {
		 		if (missionRestTimeM < 10 && missionRestTimeM.toString().length < 2) {
		 			missionRestTimeM = "0" + missionRestTimeM;
		 		}
		 		if (missionRestTimeS < 10 && missionRestTimeS.toString().length < 2) {
		 			missionRestTimeS = "0" + missionRestTimeS;
		 		}
		 		oH1.innerHTML = missionRestTimeM + "  :  " + missionRestTimeS;
		 	}
		},
		EventStart : function () {
			var that = this;
			this.oSpan2.onclick = function () {
				if (!working) {
					working = true;
					var oParent = this.parentNode.parentNode.parentNode;
					console.log(this);
					var innerText = "\&#x" + escape(this.getElementsByTagName("i")[0].innerHTML).slice(2).toLowerCase() + ";";
					if (innerText == "&#xe609;") {  //开始按钮
						this.getElementsByTagName("i")[0].innerHTML = "&#xe602;";  //完成按钮
						// var timekeeper = setInterval(function () {
						// 	SetTime(obj);
						// }, 1000);
						SetTime(that);
						// Sleep(1000);
					} else {  //完成按钮
						oDivMissionList.removeChild(oParent);
						if (oDivMissionList.childNodes.length == 0) {
							oH1.innerHTML = "番茄计时器";
						}
					}
					this.nextSibling.getElementsByTagName("i")[0].innerHTML = "&#xe62e;";  //停止按钮
					this.nextSibling.className = "span3";
					// console.log(this.nextSibling);
				}
			}
		},
		EventStop : function () {
			var that = this;
		 	oSpan3.onclick = function () {
				var oParent = this.parentNode.parentNode.parentNode;
				var innerText = "\&#x" + escape(this.getElementsByTagName("i")[0].innerHTML).slice(2).toLowerCase() + ";";
				if (innerText == "&#xe62e;") {  //停止按钮
					this.className = "";
					this.previousSibling.getElementsByTagName("i")[0].innerHTML = "&#xe609;";
					this.getElementsByTagName("i")[0].innerHTML = "&#xe636;";  //垃圾桶
					clearTimeout(timekeeper);
					that.workLeftTime = that.workTime;
					that.restLeftTime = that.restTime;
					working = false;
				} else {  //删除按钮
					oDivMissionList.removeChild(oParent);
					if (oDivMissionList.childNodes.length == 0) {
						oH1.innerHTML = "番茄计时器";
					}
				}
			}
		},
		// Timekeeping : function () {
		// 	if (isWorking) {
		// 		this.workLeftTime--;
		// 		this.ShowTime();
		// 	} else {
		// 		this.restLeftTime--;
		// 		this.ShowTime();
		// 	}
		// }
	}

 	var missionIndex = 0;
 	var missionItem = new Array();
 	oAddMissionFootButtonConfirm.onclick = function () {
 		if (oMissionName.value == "") {
		 	oMissionNameValue = oMissionName.placeholder;
		} else {
			oMissionNameValue = oMissionName.value;
		}
		// console.log(oMissionName.placeholder);
		// console.log(oMissionName.value);
		// console.log(oMissionNameValue);
		oCountValue = parseInt(oCount.innerHTML);
 		missionItem.push(new Mission(missionIndex, oMissionNameValue, clockTime, clockSRestTime, oCountValue));
 		if (!document.getElementById("missionList")) {
	 		oDivMissionList = document.createElement("div");
			oDivMissionList.id = "missionList";
			oMain.appendChild(oDivMissionList);
 		}
 		missionItem[missionIndex].CreateMissionList();
 		// missionItem[missionIndex].SetWorkTime();
 		// missionItem[missionIndex].SetRestTime();
 		missionItem[missionIndex].ShowTime();
 		missionItem[missionIndex].EventStart();
 		missionItem[missionIndex].EventStop();

 		console.log("index: " + missionItem[missionIndex].index);
	 	console.log("missionName: " + missionItem[missionIndex].missionName);
	 	console.log("workTime: " + missionItem[missionIndex].workTime);
	 	console.log("restTime: " + missionItem[missionIndex].restTime);
	 	console.log("count: " + missionItem[missionIndex].count);
	 	console.log("workLeftTime: " + missionItem[missionIndex].workLeftTime);
	 	console.log("restLeftTime: " + missionItem[missionIndex].restLeftTime);
	 	console.log(missionItem[missionIndex]);

	 	// var SetTime = function (obj) {
	 	// 	if (obj.isWorking) {
	 	// 		obj.workLeftTime--;
	 	// 	} else {
	 	// 		obj.restLeftTime--;
	 	// 	}
	 	// 	obj.ShowTime();
	 	// }
	 	// var obj = missionItem[missionIndex];
	 	// var timekeeper = setInterval(function () {
	 	// 	SetTime(obj);
	 	// }, 1000);
		// AddMission();
		// if (missionName == "") {
		// 	missionName = oMissionName.placeholder;
		// }
 	// 	missionItem.push(new Mission(missionIndex, missionName, clockTime, clockSRestTime, oMissionCount));
 	// 	missionItem[missionIndex].SetWorkTime();
 	// 	missionItem[missionIndex].SetRestTime();
 	// 	console.log("index: " + missionItem[missionIndex].index);
 	// 	console.log("missionName: " + missionItem[missionIndex].missionName);
 	// 	console.log("workTime: " + missionItem[missionIndex].workTime);
 	// 	console.log("restTime: " + missionItem[missionIndex].restTime);
 	// 	console.log("count: " + missionItem[missionIndex].count);
 	// 	console.log("workLeftTime: " + missionItem[missionIndex].workLeftTime);
 	// 	console.log("restLeftTime: " + missionItem[missionIndex].restLeftTime);
		// oAddMission.className = "noClick";
		// Span2ClickEvent();
		// Span3ClickEvent();
		// ShowTime();
		missionIndex ++;
 	}

 // 	function ShowTime() {
 // 		oH1 = document.getElementsByTagName("h1")[0];
	// 	missionTimeM = parseInt(missionItem[0].workLeftTime / 60);
	// 	missionTimeS = parseInt(missionItem[0].workLeftTime % 60);
 // 		if (missionTimeM < 10) {
 // 			missionTimeM = "0" + missionTimeM;
 // 		}
 // 		if (missionTimeS < 10) {
 // 			missionTimeS = "0" + missionTimeS;
 // 		}
 // 		oH1.innerHTML = missionTimeM + "  :  " + missionTimeS;
 // 	}


 // 	function ShowWorkTime() {
	// 	missionTimeM = parseInt(missionItem[0].workLeftTime / 60);
	// 	missionTimeS = parseInt(missionItem[0].workLeftTime % 60);
 // 		if (missionTimeM < 10) {
 // 			missionTimeM = "0" + missionTimeM;
 // 		}
 // 		if (missionTimeS < 10) {
 // 			missionTimeS = "0" + missionTimeS;
 // 		}
 // 		oH1.innerHTML = missionTimeM + "  :  " + missionTimeS;
 // 		if (missionItem[0].workLeftTime == 0) {
 // 			clearTimeout(timeout);
 // 			finishCount++;
 // 			oSpan1.innerHTML = finishCount + "/" + oMissionCount;
 // 			return;
 // 		}
 // 		missionItem[0].workLeftTime --;
	// 	timeout = setTimeout(ShowWorkTime, 1000);
 // 	}


 // 	function Span3ClickEvent() {
 // 		oSpan3.onclick = function () {
	// 		var oParent = this.parentNode.parentNode.parentNode;
	// 		var innerText = "\&#x" + escape(this.getElementsByTagName("i")[0].innerHTML).slice(2).toLowerCase() + ";";
	// 		if (innerText == "&#xe62e;") {  //停止按钮
	// 			this.previousSibling.getElementsByTagName("i")[0].innerHTML = "&#xe609;";
	// 			this.getElementsByTagName("i")[0].innerHTML = "&#xe636;";  //垃圾桶
	// 			clearTimeout(timeout);
	// 			ShowTime();
	// 		} else {
	// 			oDivMissionList.removeChild(oParent);
	// 			if (oDivMissionList.childNodes.length == 0) {
	// 				oH1.innerHTML = "番茄计时器";
	// 			}
	// 		}
	// 	}
 // 	}


 // 	function Span2ClickEvent() {
 // 		oSpan2.onclick = function () {
	// 		var oParent = this.parentNode.parentNode.parentNode;
	// 		var innerText = "\&#x" + escape(this.getElementsByTagName("i")[0].innerHTML).slice(2).toLowerCase() + ";";
	// 		if (innerText == "&#xe609;") {  //开始按钮
	// 			this.getElementsByTagName("i")[0].innerHTML = "&#xe602;";
	// 			ShowWorkTime();
	// 		} else {
	// 			oDivMissionList.removeChild(oParent);
	// 			clearTimeout(timeout);
	// 			ShowTime();
	// 			if (oDivMissionList.childNodes.length == 0) {
	// 				oH1.innerHTML = "番茄计时器";
	// 			}
	// 		}
	// 		this.nextSibling.getElementsByTagName("i")[0].innerHTML = "&#xe62e;";  //停止按钮
	// 	}
 // 	}


 // 	function AddMission() {
 // 		if (!document.getElementById("missionList")) {
	//  		oDivMissionList = document.createElement("div");
	// 		oDivMissionList.id = "missionList";
 // 		}
	// 	var oUl = document.createElement("ul");
	// 	var oLi = document.createElement("li");
	// 	oSpan1 = document.createElement("span");
	// 	oSpan2 = document.createElement("span");
	// 	oSpan3 = document.createElement("span");
	// 	oSpan4 = document.createElement("span");
	// 	var oStrong = document.createElement("strong");
	// 	var oSpan2A = document.createElement("a");
	// 	var oSpan3A = document.createElement("a");
	// 	var oSpan4A = document.createElement("a");
	// 	var oSpan2I = document.createElement("i");
	// 	var oSpan3I = document.createElement("i");
	// 	var oSpan4I = document.createElement("i");
	// 	oMissionName = document.getElementById("missionName");
	// 	missionName = oMissionName.value;
	// 	oMissionCount = parseInt(oCount.innerHTML);
	// 	finishCount = 0;
	// 	oDiv = document.createElement("div");
	// 	oSpan1.innerHTML = finishCount + "/" + oMissionCount;
	// 	if (oMissionName.value) {
	// 		oStrong.innerHTML = oMissionName.value;
	// 	} else {
	// 		oStrong.innerHTML = oMissionName.placeholder;
	// 	}
	// 	oSpan2I.className = "iconfont";
	// 	oSpan3I.className = "iconfont";
	// 	oSpan4I.className = "iconfont";
	// 	oSpan2I.innerHTML = "&#xe609;";
	// 	oSpan3I.innerHTML = "&#xe636;";
	// 	oSpan4I.innerHTML = "&#xe64b;";
	// 	oSpan1.className = "span1";
	// 	oSpan2.className = "span2";
	// 	oSpan3.className = "span3";
	// 	oSpan4.className = "span4";
	// 	oSpan2A.appendChild(oSpan2I);
	// 	oSpan3A.appendChild(oSpan3I);
	// 	oSpan4A.appendChild(oSpan4I);
	// 	oSpan2.appendChild(oSpan2A);
	// 	oSpan3.appendChild(oSpan3A);
	// 	oSpan4.appendChild(oSpan4A);
	// 	oDiv.appendChild(oSpan1);
	// 	oDiv.appendChild(oSpan2);
	// 	oDiv.appendChild(oSpan3);
	// 	oLi.appendChild(oStrong);
	// 	oLi.appendChild(oDiv);
	// 	oUl.appendChild(oLi);
	// 	oDivMissionList.appendChild(oUl);
	// 	oMain.appendChild(oDivMissionList);
	// 	oMissionName.value = "";
	// 	oCount.innerHTML = "1";
	// }
}

/**
 * 获得指定类名的元素
 * @param  {DOM} parent 指定类名元素的父节点
 * @param  {String} child  指定的类名
 * @return {Array}        指定类名的元素组成的数组
 */
 function getByClassName(parent, child) {
 	var allTag = parent.getElementsByTagName('*');
 	var tarClass = new Array();
 	for (var i = 0; i < allTag.length; i++) {
 		if (allTag[i].className == child) {
 			tarClass.push(allTag[i]);
 		}
 	}
 	return tarClass;
 }

 /* 运动框架 */

/**
 * 获取元素样式
 * @param  {[type]} obj  元素对象
 * @param  {[type]} attr 样式
 * @return {[type]}      [description]
 */
 function getStyle(obj, attr) {
 	if (obj.currentStyle) {
 		return obj.currentStyle[attr];
 	} else {
 		return getComputedStyle(obj, null)[attr];
 	}
 }

/**
 * 运动框架
 * @param  {[type]} obj  运动对象
 * @param  {[type]} json 运动值对
 * @param  {[type]} fun  运动完成后执行的函数
 * @return {[type]}      [description]
 */
 function startMove(obj, json, fun) {
 	var finishFlag = true;
 	clearInterval(obj.timer);
 	obj.timer = setInterval(function() {
 		flag = true;
 		var speed = 0,
 		currStyle = null;
 		for (var attr in json) {
 			if (attr == 'opacity') {
 				var isOpacity = true;
 				currStyle = Math.round(parseFloat(getStyle(obj, attr)) * 100);
 			} else {
 				currStyle = parseInt(getStyle(obj, attr));
 			}
 			speed = (json[attr] - currStyle) / 8;
 			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
 			if (currStyle != json[attr]) {
 				finishFlag = false;
 			}
 			if (isOpacity) {
 				obj.style.filter = 'alpha(opacity:' + (currStyle + speed) + ')';
 				obj.style[attr] = (currStyle + speed) / 100;
 			} else {
 				obj.style[attr] = currStyle + speed + 'px';
 			}
 			if (finishFlag) {
 				clearInterval(obj.timer);
 				if (fun) {
 					fun();
 				}
 			}
 		}
 	}, 30);
 }

 /* 运动框架结束 */