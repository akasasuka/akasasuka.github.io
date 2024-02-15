//==========-*-*-*-  时间算法  -*-*-*-
		var sueseo = '花咲季    ~hasawa~'
		
		function elkstia(){
			var nowtime=Math.floor((new Date()).getTime()/1000)
			var tinmii = nowtime - 1420038000 
			var mii = tinmii/1%60
			var i=0
			var j=0
			var z=0
			var tinfii = tinmii/60
			var fii = tinfii
			while (fii>60) {
				fii -= 60
				i += 1
				z += 1
				if (i == 4){
					fii -=1
					i=0
					j += 1
			}}
			var zii = Math.floor(z/1%26)
			fii = Math.floor(fii)
			mii = Math.floor(mii)
			var lui = Math.floor(z/26%30)
			var lni = Math.floor(z/(26*30)%12)
			var loi = Math.floor(z/(26*30*12))
			var lniba = Math.floor(z/(26*30)%7)
			var sazr = Math.floor((lui+2*lniba)%7)

			return [2030+loi,1+lni,1+lui,zii,fii,mii,sazr,1+lniba]
			//返回 年-月-日-时-分-秒-星期(str)-月种
		}
		
		//厄尔科斯旧历
		function elksoutia(){
			var nowtime = Math.floor((new Date()).getTime()/1000)
			var tinmii = nowtime - 1420038000
			var mii = Math.floor(tinmii/1%60)
			var fii = Math.floor(tinmii/60%60)
			var z = Math.floor(tinmii/(60*60))
			var zii = Math.floor(z%24)
			var lui = Math.floor(z/24%30)
			var lni = Math.floor(z/(24*30)%12)
			var loi = Math.floor(z/(24*30*12))
			var lniba = Math.floor(z/(24*30)%7)
			var sazr = Math.floor((lui+2*lniba)%7)
			return [2030+loi,1+lni,1+lui,zii,fii,mii,sazr,1+lniba]
			//返回 年-月-日-时-分-秒-星期(str)-月种
		}
		
		//作息时间
		function suatia(sueseo,time){
			if (sueseo.includes('hasawa')){
				if (time == 7){ return ['qielia! (⑅˃◡˂⑅)','黎明来了'] }
				else if (12 > time > 7){ return ['sa salia ヾ(❀╹◡╹)ﾉ~','早上好'] /* 白天*/ }
				else if (17 > time >= 12){ return ['sa salia ヾ(❀╹◡╹)ﾉ~','早上好'] /* 白天*/ }
				else if (time == 17){ return ['lu lolia ꒰ঌ( ⌯\' \'⌯)໒꒱','黄昏到了'] }
				else if (22 > time > 17){ return ['fu felia (¦3[▓▓]','晚安'] /* 晚上*/ }
				else if (7 > time >= 3){ return ['dudafelia (づ◡ど)','晚上好'] /* 重夜*/ }
				else { return ['wajalia (～￣▽￣)～','日间'] }
			} else if (sueseo.includes('sijima')){
				if (time == 7){ return ['sio endi (,,•́ . •̀,,)','潮汐'] }
				else if (26 > time > 7){ return ['oka endi ⸜(๑\'ᵕ\'๑)⸝⋆*','眠夜'] }
				else if (time == 0){ return ['fuula endi (⑅˃◡˂⑅)','苏醒'] }
				else { return ['zan endi ✧*｡٩(ˊᗜˋ*)و✧*','皙白'] }
			} else if (sueseo.includes('kalisu')){
				if (9 > time >= 6){ return ['abulu ieo! ✧*｡٩(ˊᗜˋ*)و✧*','早上好'] /* 空间震*/  }
				else if (11 > time >= 9){ return ['sa salia ヾ(❀╹◡╹)ﾉ~','早上好'] /* 白天*/  }
				else if (12 > time >= 11){ return ['lulia ꒰ঌ( ⌯\' \'⌯)໒꒱','午安'] /* 中午*/  }
				else if (17 > time >= 12){ return ['felia (¦3[▓▓]','晚安'] /* 晚上*/  }
				else if (21 > time >= 17){ return ['kukaufelia (づ◡ど)','晚上好'] /* 深夜*/  }
				else { return ['wajalia (～￣▽￣)～','早上好'] /* 日间*/  }
			}
		}
		
		//字段处理
		function wisjikan(jk){
			jk = jk+''
			if (jk.length==1){ return '0'+jk }
			else{ return jk }
		}

		function wissazr(list){
			if (list[6] == 1){ return '星期一 ~foia sazr~' }
			else if (list[6] == 2){ return '星期二 ~hasa sazr~' }
			else if (list[6] == 3){ return '星期三 ~kasa sazr~' }
			else if (list[6] == 4){ return '星期四 ~qinesa sazr~' }
			else if (list[6] == 5){ return '星期五 ~snLialia sazr~' }
			else if (list[6] == 6){ return '星期六 ~lisrli sazr~' }
			else { return '星期日 ~wanma sazr~' }
		}
		
		function wislniba(list){
			if (list[7] ==1){  return 'tue' }
			else if (list[7] ==2){  return 'lei' }
			else if (list[7] ==3){  return 'zei' }
			else if (list[7] ==4){  return 'klo' }
			else if (list[7] ==5){  return 'liu' }
			else if (list[7] ==6){  return 'neu' }
			else {  return 'fba' }
		}

		function msgtia(){
		//现在的时间是
			var timelist = elkstia()
			var outimelist = elksoutia()
			var msg = ''
			var seolist = suatia(sueseo,outimelist[3])
			msg = msg+outimelist[0]+'年'+outimelist[1]+'月'+outimelist[2]+'日'+'【'+wisjikan(outimelist[3])+' : '+wisjikan(outimelist[4])+' : '+wisjikan(outimelist[5])+'】'
			//msg = msg+timelist[0]+'年'+timelist[1]+'月'+timelist[2]+'日'+'【'+wisjikan(timelist[3])+' : '+wisjikan(timelist[4])+' : '+wisjikan(timelist[5])+'】'
			return msg
		}
        function time() {
			if(document.getElementById("time")!=null){
				document.getElementById("time").innerText=msgtia();
			}
			setTimeout("time()",1000);
        }
