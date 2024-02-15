		var sueseo = '花咲季    ~hasawa~'
        //获取月份日数值
        function lniNului(lni){
            //传入月份，返回相应日数值
            let d = -1;
            if(lni==1){ d=0;}
            if(lni==2){ d=31;}
            if(lni==3){ d=59;}
            if(lni==4){ d=90;}
            if(lni==5){ d=120;}
            if(lni==6){ d=151;}
            if(lni==7){ d=181;}
            if(lni==8){ d=212;}
            if(lni==9){ d=243;}
            if(lni==10){ d=273;}
            if(lni==11){ d=304;}
            if(lni==12){ d=334;}
            return d;
        }
        //获取月份日数值+实际日数值
        function lniNuluip(lni,lui){
            //传入月份，返回相应日数值
            let d = -1;
            switch(lni){	//月份日数值+实际日数值
                case 1:d=334+31-lui;break;
                case 2:d=306+28-lui;break;
                case 3:d=275+31-lui;break;
                case 4:d=245+30-lui;break;
                case 5:d=214+31-lui;break;
                case 6:d=184+30-lui;break;
                case 7:d=153+31-lui;break;
                case 8:d=122+31-lui;break;
                case 9:d=92+30-lui;break;
                case 10:d=61+31-lui;break;
                case 11:d=31+30-lui;break;
                case 12:d=0+31-lui;break;
            }
            return d;
        }
        

        //计算年份
        function reNului(loi,lni,lui){
            //总天数
            //总天数=年份偏差值*365+闰日+月份日数值+实际日数值
            let loihensa = Math.abs(loi-2015);//年份偏差值
            let lnihensa = parseInt(loihensa/4);	//闰日，不算当年
            
            
            if(loi-2015>=0){ 
                let tlui=loihensa*365+lnihensa+lniNului(lni+1)+parseInt(lui)-1; 
                let reloi=2030+parseInt(tlui/360); 
                let relni=parseInt(tlui/30)%12; //parseInt((tlui%360+1)/30)+1;  //Math.floor(tlui/30%12);
                let relui=(tlui+1)%30;if(relui==0){relui=30;}
                let relniba=parseInt(tlui/30)%7;
                let resazr=((relui-1)+2*relniba)%7;if(resazr==0){resazr=7;}  //(relui+2*relniba)%7;
                return [reloi,relni+1,relui,relniba+1,resazr];
            }else{ 
                let tlui=(loihensa-1)*365+lnihensa+lniNuluip(lni+1,lui);
                let reloi=2029-parseInt(tlui/360); 
                let relni=12-parseInt(tlui/30)%12;
                let relui=30-tlui%30;
                let relniba=6-parseInt(tlui/30)%7;
                let resazr=((relui-1)+2*relniba)%7;
                return [reloi,relni,relui,relniba+1,resazr];
            }
        }
        //返回 年-月-日-月种-星期


		//字段处理
		function wissazr(list){
			if (list[4] == 1){ return '星期一 ~foia sazr~' }
			else if (list[4] == 2){ return '星期二 ~hasa sazr~' }
			else if (list[4] == 3){ return '星期三 ~kasa sazr~' }
			else if (list[4] == 4){ return '星期四 ~qinesa sazr~' }
			else if (list[4] == 5){ return '星期五 ~snLialia sazr~' }
			else if (list[4] == 6){ return '星期六 ~lisrli sazr~' }
			else { return '星期日 ~wanma sazr~' }
		}
		function wislniba(list){
			if (list[3] ==1){  return 'tue' }
			else if (list[3] ==2){  return 'lei' }
			else if (list[3] ==3){  return 'zei' }
			else if (list[3] ==4){  return 'klo' }
			else if (list[3] ==5){  return 'liu' }
			else if (list[3] ==6){  return 'neu' }
			else {  return 'fba' }
		}


        function time(){
            var date2 =new Date();
            let nian =date2.getFullYear();
            let yue =date2.getMonth();
            let ri =date2.getDate();
            var list =reNului(nian,yue,ri);
            var time2 = document.getElementById("time");
            time2.innerText=""+list[0]+"年"+list[1]+"月"+list[2]+"日  月种："+wislniba(list)+"  "+wissazr(list);
            
            var sue = document.getElementById("sueseo");
            sue.innerText=sueseo;
            var sue2= document.getElementById("sueseo2");
            sue2.innerText=sueseo;
            
            setTimeout("time()",1000*60*60);
            //alert(list);
        }