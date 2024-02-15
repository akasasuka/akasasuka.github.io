var Home = location.href,
    Pages = 4,
    xhr,
    xhrUrl = '';

var Diaspora = {
    L: function(url, f, err) {
        if (url == xhrUrl) {
            return false;
        }
        xhrUrl = url;
        if (xhr) {
            xhr.abort();
        }
        xhr = $.ajax({
            type: 'GET',
            url: url,
            timeout: 10000,
            success: function(data) {
                f(data);
                xhrUrl = '';
            },
            error: function(a, b, c) {
                if (b == 'abort') {
                    err && err()
                } else {
                    window.location.href = url;
                }
                xhrUrl = '';
            }
        });
    },
    P: function() {
        return !!('ontouchstart' in window);
    },
    PS: function() {
        if (!(window.history && history.pushState)){
            return;
        }
        history.replaceState({u: Home, t: document.title}, document.title, Home);
        window.addEventListener('popstate', function(e) {
            var state = e.state;
            if (!state) return;
            document.title = state.t;

            if (state.u == Home) {
                $('#preview').css('position', 'fixed');
                setTimeout(function() {
                    $('#preview').removeClass('show');
                    $('#container').show();
                    window.scrollTo(0, parseInt($('#container').data('scroll')));
                    setTimeout(function() {
                        $('#preview').html('');
                        $(window).trigger('resize');
                    }, 300);
                }, 0);
            } else {
                Diaspora.loading();
                Diaspora.L(state.u, function(data) {
                    document.title = state.t;
                    $('#preview').html($(data).filter('#single'));
                    Diaspora.preview();
                    setTimeout(function() { Diaspora.player(); }, 0);
                });
            }
        });
    },
    HS: function(tag, flag) {
        var id = tag.data('id') || 0,
            url = tag.attr('href'),
            title = tag.attr('title') + " - " + $("#config-title").text();

        if (!$('#preview').length || !(window.history && history.pushState)) location.href = url;
        Diaspora.loading()
        var state = {d: id, t: title, u: url};
        Diaspora.L(url, function(data) {
            if (!$(data).filter('#single').length) {
                location.href = url;
                return
            }
            switch (flag) {
                case 'push':
                    history.pushState(state, title, url)
                    break;
                case 'replace':
                    history.replaceState(state, title, url)
                    break;
            }
            document.title = title;
            $('#preview').html($(data).filter('#single'))
            switch (flag) {
                case 'push':
                    Diaspora.preview()
                    break;
                case 'replace':
                    window.scrollTo(0, 0)
                    Diaspora.loaded()
                    break;
            }
            setTimeout(function() {
                Diaspora.player();
                $('#top').show();
                comment = $("#gitalk-container");
                if (comment.data('ae') == true){
                    comment.click();
                }
            }, 0)
            var math = document.getElementById("single")
            //MathJax.Hub.Queue(["Typeset", MathJax.Hub, math])
        })
    },
    preview: function() {
        // preview toggle
        $("#preview").one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
            var previewVisible = $('#preview').hasClass('show');
            if (!!previewVisible) {
                $('#container').hide();
				$('#primary').hide();
				$('#pager').hide();
            }else{
                $('#container').show();
            }
            Diaspora.loaded();
        });
        setTimeout(function() {
            $('#preview').addClass('show');
            $('#container').data('scroll', window.scrollY);
            setTimeout(function() {
                $('#preview').css({
                    'position': 'static',
                    'overflow-y': 'auto'
                });
            }, 500);
        }, 0);
    },
    player: function() {
        var p = $('#audio');
        if (!p.length) {
            $('.icon-play').css({
                'color': '#dedede',
                'cursor': 'not-allowed'
            })
            return
        }
        var sourceSrc= $("#audio source").eq(0).attr('src')
        if (sourceSrc == '' && p[0].src == ''){
            audiolist = $('#audio-list li');
            mp3 = audiolist.eq([Math.floor(Math.random() * audiolist.size())])
            p[0].src = mp3.data('url')
        }

        if (p.eq(0).data("autoplay") == true) {
            //p[0].play();
        }

        p.on({
            'timeupdate': function() {
                var progress = p[0].currentTime / p[0].duration * 100;
                $('.bar').css('width', progress + '%');
                if (progress / 5 <= 1) {
                    p[0].volume = progress / 5;
                }else {
                    p[0].volume = 1;
                }
            },
            'ended': function() {
                $('.icon-pause').removeClass('icon-pause').addClass('icon-play')
            },
            'playing': function() {
                $('.icon-play').removeClass('icon-play').addClass('icon-pause')
            }
        })
    },
    loading: function() {
        var w = window.innerWidth;
        var css = '<style class="loaderstyle" id="loaderstyle'+ w +'">'+
            '@-moz-keyframes loader'+ w +'{100%{background-position:'+ w +'px 0}}'+
            '@-webkit-keyframes loader'+ w +'{100%{background-position:'+ w +'px 0}}'+
            '.loader'+ w +'{-webkit-animation:loader'+ w +' 3s linear infinite;-moz-animation:loader'+ w +' 3s linear infinite;}'+
            '</style>';
        $('.loaderstyle').remove()
        $('head').append(css)
        $('#loader').removeClass().addClass('loader'+ w).show()
    },
    loaded: function() {
        $('#loader').removeClass().hide()
    },
    F: function(id, w, h) {
        var _height = $(id).parent().height(),
            _width = $(id).parent().width(),
            ratio = h / w;
        if (_height / _width > ratio) {
            id.style.height = _height +'px';
            id.style.width = _height / ratio +'px';
        } else {
            id.style.width = _width +'px';
            id.style.height = _width * ratio +'px';
        }
        id.style.left = (_width - parseInt(id.style.width)) / 2 +'px';
        id.style.top = (_height - parseInt(id.style.height)) / 2 +'px';
    }
};

$(function() {
    if (Diaspora.P()) {
        $('body').addClass('touch')
    }
    if ($('#preview').length) {
        var cover = {};
        cover.t = $('#cover');
        cover.w = cover.t.attr('width');
        cover.h = cover.t.attr('height');
        ;(cover.o = function() {
            $('#mark').height(window.innerHeight)
        })();
        if (cover.t.prop('complete')) {
            // why setTimeout ?
            setTimeout(function() { cover.t.load() }, 0)
        }
        cover.t.on('load', function() {
            ;(cover.f = function() {
                var _w = $('#mark').width(), _h = $('#mark').height(), x, y, i, e;
                e = (_w >= 1000 || _h >= 1000) ? 1000 : 500;
                if (_w >= _h) {
                    i = _w / e * 50;
                    y = i;
                    x = i * _w / _h;
                } else {
                    i = _h / e * 50;
                    x = i;
                    y = i * _h / _w;
                }
                $('.layer').css({
                    'width': _w + x,
                    'height': _h + y,
                    'marginLeft': - 0.5 * x,
                    'marginTop': - 0.5 * y
                })
                if (!cover.w) {
                    cover.w = cover.t.width();
                    cover.h = cover.t.height();
                }
                Diaspora.F($('#cover')[0], cover.w, cover.h)
            })();
            setTimeout(function() {
                $('html, body').removeClass('loading')
            }, 1000)
            $('#mark').parallax()
            var vibrant = new Vibrant(cover.t[0]);
            var swatches = vibrant.swatches()
            if (swatches['DarkVibrant']) {
                $('#vibrant polygon').css('fill', swatches['DarkVibrant'].getHex())
                $('#vibrant div').css('background-color', swatches['DarkVibrant'].getHex())
            }
            if (swatches['Vibrant']) {
                $('.icon-menu').css('color', swatches['Vibrant'].getHex())
				$('.icon-search').css('color', swatches['Vibrant'].getHex())
            }
        })
        if (!cover.t.attr('src')) {
            alert('Please set the post thumbnail')
        }
        $('#preview').css('min-height', window.innerHeight)
        Diaspora.PS()
        $('.pview a').addClass('pviewa')
        var T;
        $(window).on('resize', function() {
            clearTimeout(T)
            T = setTimeout(function() {
                if (!Diaspora.P() && location.href == Home) {
                    cover.o()
                    cover.f()
                }
                if ($('#loader').attr('class')) {
                    Diaspora.loading()
                }
            }, 500)
        })
    } else {
        $('#single').css('min-height', window.innerHeight)
        setTimeout(function() {
            $('html, body').removeClass('loading')
        }, 1000)
        window.addEventListener('popstate', function(e) {
            if (e.state) location.href = e.state.u;
        })
        //Diaspora.player();
        $('.icon-icon, .image-icon').attr('href', '/')
        $('#top').show()
    }
    $(window).on('scroll', function() {
        if ($('.scrollbar').length && !Diaspora.P() && !$('.icon-images').hasClass('active')) {
            var wt = $(window).scrollTop(),
                tw  = $('#top').width(),
                dh = document.body.scrollHeight,
                wh  = $(window).height();
            var width = tw / (dh - wh) * wt;
            $('.scrollbar').width(width)
            if (wt > 80 && window.innerWidth > 800) {
                $('.subtitle').fadeIn()
            } else {
                $('.subtitle').fadeOut()
            }
        }
    })
    $(window).on('touchmove', function(e) {
        if ($('body').hasClass('mu')) {
			$('#primary').hide();
			$('#pager').hide();
            e.preventDefault()
        }
    })
	
	//搜搜
	var searchFunc = function(path, search_id, content_id) {
		'use strict'; //使用严格模式
		$.ajax({
			url: path,
			dataType: "xml",
			success: function( xmlResponse ) {
				// 从xml中获取相应的标题等数据
				var datas = $( "entry", xmlResponse ).map(function() {
					return {
						title: $( "title", this ).text(),
						content: $("content",this).text(),
						url: $( "url" , this).text()
					};
				}).get();
				//ID选择器
				var $input = document.getElementById(search_id);
				var $resultContent = document.getElementById(content_id);
				$input.addEventListener('input', function(){
					var str='<ul class=\"search-result-list\">';                
					var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
					$resultContent.innerHTML = "";
					if (this.value.trim().length <= 0) {
						return;
					}
					// 本地搜索主要部分
					datas.forEach(function(data) {
						var isMatch = true;
						var content_index = [];
						var data_title = data.title.trim().toLowerCase();
						var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
						var data_url = data.url;
						var index_title = -1;
						var index_content = -1;
						var first_occur = -1;
						// 只匹配非空文章
						if(data_title != '' && data_content != '') {
							keywords.forEach(function(keyword, i) {
								index_title = data_title.indexOf(keyword);
								index_content = data_content.indexOf(keyword);
								if( index_title < 0 && index_content < 0 ){
									isMatch = false;
								} else {
									if (index_content < 0) {
										index_content = 0;
									}
									if (i == 0) {
										first_occur = index_content;
									}
								}
							});
						}
						// 返回搜索结果
						if (isMatch) {
						//结果标签
							str += "<li><a href='"+ data_url +"' class='search-result-title' target='_blank'>"+ data_title +"</a>";
							var content = data.content.trim().replace(/<[^>]+>/g,"");
							if (first_occur >= 0) {
								// 拿出含有搜索字的部分
								var start = first_occur - 6;
								var end = first_occur + 6;
								if(start < 0){
									start = 0;
								}
								if(start == 0){
									end = 10;
								}
								if(end > content.length){
									end = content.length;
								}
								var match_content = content.substr(start, end); 
								// 列出搜索关键字，定义class加高亮
								keywords.forEach(function(keyword){
									var regS = new RegExp(keyword, "gi");
									match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
								})
								str += "<p class=\"search-result\">" + match_content +"...</p>"
							}
						}
					})
					$resultContent.innerHTML = str;
				})
			}
		})
	};
	var path = "/search.xml";
	if(document.getElementById('local-search-input') !== null){
		searchFunc(path, 'local-search-input', 'local-search-result');
	}
	
	
    var typed = null;
    $('body').on('click', function(e) {
        var tag = $(e.target).attr('class') || '',
            rel = $(e.target).attr('rel') || '';
        // .content > ... > img
        if (e.target.nodeName == "IMG" && $(e.target).parents('div.content').length > 0) {
            tag = 'pimg';
        }
        if (!tag && !rel) return;
        switch (true) {
            // nav menu
            case (tag.indexOf('switchmenu') != -1):
                window.scrollTo(0, 0)
				
				$('html, body').toggleClass('mu');
				if(typed !== null)
					{typed.destroy(); typed = null;}
				else{
					if($("#hitokoto").data('st') == false){
						$.get("https://v1.hitokoto.cn/", function (data) {
						var data = data;
						var str =  data.hitokoto + " ——  By "		
						var options = {
						  strings: [ 
							//str + "Who??^1000",
							//str + "It's me^2000",
							//str +'Haha, make a joke',
							str + data.from,
						  ],
						  //typeSpeed: 90,
						  //startDelay: 500,
						  //backDelay: 500,
						  //backSpeed: 50,//回退速度
						  //loop: true,
						}
						typed = new Typed(".hitokoto .typed", options);
						})
					}
				}	
                return false;
                break;
			//search	
			case (tag.indexOf('switchsearch') != -1):
                $('body').removeClass('mu')
				if(typed !== null){typed.destroy(); typed = null;}
                setTimeout(function() {
                    Diaspora.HS($(e.target), 'push')
                    $('.toc').fadeIn(1000);
					searchFunc(path, 'local-search-input', 'local-search-result');
                }, 300)
                return false;
                break;	
            // next page
            case (tag.indexOf('more') != -1):
                tag = $('.more');
                if (tag.data('status') == 'loading') {
                    return false
                }
                var num = parseInt(tag.data('page')) || 1;
                if (num == 1) {
                    tag.data('page', 1)
                }
                if (num >= Pages) {
                    return
                }
                tag.html('加载中...').data('status', 'loading')
                Diaspora.loading()
                Diaspora.L(tag.attr('href'), function(data) {
                    var link = $(data).find('.more').attr('href');
                    if (link != undefined) {
                        tag.attr('href', link).html('加载更多').data('status', 'loaded')
                        tag.data('page', parseInt(tag.data('page')) + 1)
                    } else {
                        $('#pager').remove()
                    }
                    var tempScrollTop = $(window).scrollTop();
                    $('#primary').append($(data).find('.post'))
                    $(window).scrollTop(tempScrollTop + 100);
                    Diaspora.loaded()
                    $('html,body').animate({ scrollTop: tempScrollTop + 400 }, 500);
                }, function() {
                    tag.html('加载更多').data('status', 'loaded')
                })
                return false;
                break;
            // home
            case (tag.indexOf('icon-home') != -1):
                $('.toc').fadeOut(100);
                if ($('#preview').hasClass('show')) {
                    history.back();
                } else {
                    location.href = $('.icon-home').data('url')
                }
                return false;
                break;
            // qrcode
            case (tag.indexOf('icon-scan') != -1):
                if ($('.icon-scan').hasClass('tg')) {
                    $('#qr').toggle()
                } else {
                    $('.icon-scan').addClass('tg')
                    $('#qr').qrcode({ width: 128, height: 128, text: location.href}).toggle()
                }
                return false;
                break;
            // audio play
            case (tag.indexOf('icon-play') != -1):
                $('#audio')[0].play()
                $('.icon-play').removeClass('icon-play').addClass('icon-pause')
                return false;
                break;
            // audio pause
            case (tag.indexOf('icon-pause') != -1):
                $('#audio')[0].pause()
                $('.icon-pause').removeClass('icon-pause').addClass('icon-play')
                return false;
                break;
            // history state
            case (tag.indexOf('cover') != -1):
                Diaspora.HS($(e.target).parent(), 'push')
                return false;
                break;
            // history state
            case (tag.indexOf('posttitle') != -1):
                Diaspora.HS($(e.target), 'push')
                return false;
                break;
            // prev, next post
            case (rel == 'prev' || rel == 'next'):
                if (rel == 'prev') {
                    var t = $('#prev_next a')[0].text
                } else {
                    var t = $('#prev_next a')[1].text
                }
                $(e.target).attr('title', t)
                Diaspora.HS($(e.target), 'replace')
                return false;
                break;
            // toc
            case (tag.indexOf('toc-text') != -1 || tag.indexOf('toc-link') != -1
                  || tag.indexOf('toc-number') != -1):
                hash = '';
                if (e.target.nodeName == 'SPAN'){
                  hash = $(e.target).parent().attr('href')
                }else{
                  hash = $(e.target).attr('href')
                }
                to  = $(decodeURI(hash))
                $("html,body").animate({
                  scrollTop: to.offset().top - 50
                }, 300);
                return false;
                break;
            // quick view
            case (tag.indexOf('pviewa') != -1):
                $('body').removeClass('mu')
				if(typed !== null){typed.destroy(); typed = null;}
                setTimeout(function() {
                    Diaspora.HS($(e.target), 'push')
                    $('.toc').fadeIn(1000);
                }, 300)
                return false;
                break;
            // photoswipe
            case (tag.indexOf('pimg') != -1):
                var pswpElement = $('.pswp').get(0);
                if (pswpElement) {
                    var items = [];
                    var index = 0;
                    var imgs = [];
                    $('.content img').each(function(i, v){
                        // get index
                        if (e.target.src == v.src) {
                            index = i;
                        }
                        var item = {
                            src: v.src,
                            w: v.naturalWidth,
                            h: v.naturalHeight
                        };
                        imgs.push(v);
                        items.push(item);
                    });
                    var options = {
                        index: index,
                        shareEl: false,
                        zoomEl: false,
                        allowRotationOnUserZoom: true,
                        history: false,
                        getThumbBoundsFn: function(index) {
                            // See Options -> getThumbBoundsFn section of documentation for more info
                            var thumbnail = imgs[index],
                                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                                rect = thumbnail.getBoundingClientRect(); 

                            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                        }
                    };
                    var lightBox= new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                    lightBox.init();
                }
                return false;
                break;
            // comment
            case - 1 != tag.indexOf("comment"): 
				if($('#gitalk-container').data('enable') == true){
					Diaspora.loading(),
					comment = $('#gitalk-container');
					gitalk = new Gitalk({
					  clientID: comment.data('ci'),
					  clientSecret: comment.data('cs'),
					  repo: comment.data('r'),
					  owner: comment.data('o'),
					  admin: comment.data('a'),
					  id: decodeURI(window.location.pathname),
					  distractionFreeMode: comment.data('d')
					})
					$(".comment").removeClass("link")
					gitalk.render('gitalk-container')
					Diaspora.loaded();
				}else{
					$('#gitalk-container').html("评论已关闭");
				}
                return false;
                break;
            default:
                return true;
                break;
        }
    })
    // 是否自动展开评论
    comment = $("#gitalk-container");
    if (comment.data('ae') == true){
        comment.click();
    }
})

window.onload=function(){
		time();
	            //setInterval("time()",1000);
}
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
		function ousuatia(sueseo,time){
			if (sueseo.includes('hasawa')){
				if (time == 7){ return ['qielia! (⑅˃◡˂⑅)','黎明来了'] }
				else if (12 > time && time > 7){ return ['sa salia ヾ(❀╹◡╹)ﾉ~','早上好'] /* 白天*/ }
				else if (time == 12 ){ return ['lulia ꒰ঌ( ⌯\' \'⌯)໒꒱','午安'] /* 中午*/  }
				else if (17 > time && time > 12){ return ['setolia ヾ(❀╹◡╹)ﾉ~','你没事吧?'] /* 白天*/ }
				else if (time == 17){ return ['lu lolia ꒰ঌ( ⌯\' \'⌯)໒꒱','黄昏到了'] }
				else if (21 > time && time > 17){ return ['fu felia (¦3[▓▓]','晚安'] /* 晚上*/ }
				else if (7 > time && time > 5){ return ['dudafelia (づ◡ど)','晚上好'] /* 重夜*/ }
				else if (time == 5){ return ['papana (,,•́ . •̀,,)','辛苦了'] /* 重夜*/ }
				else { return ['wajalia (～￣▽￣)～','日间安康'] }
			} else if (sueseo.includes('sijima')){
				if (time == 7){ return ['sio endi (,,•́ . •̀,,)','潮汐来了'] }
				else if (7 > time > 2){ return ['zan endi ✧*｡٩(ˊᗜˋ*)و✧*','皙白安康'] }
				else if (time == 0){ return ['fuula endi (⑅˃◡˂⑅)','苏醒'] }
				else { return ['wajalia endi ⸜(๑\'ᵕ\'๑)⸝⋆*','日间安康'] }
			} else if (sueseo.includes('kalisu')){
				if (8 >= time > 6){ return ['abulu ieo! ✧*｡٩(ˊᗜˋ*)و✧*','空间震'] /* 空间震*/  }
				else if (11 > time > 8){ return ['sa salia ヾ(❀╹◡╹)ﾉ~','早上好'] /* 白天*/  }
				else if (time == 11){ return ['lulia ꒰ঌ( ⌯\' \'⌯)໒꒱','午安'] /* 中午*/  }
				else if (17 > time > 11){ return ['felia (¦3[▓▓]','晚安'] /* 晚上*/  }
				else if (20 > time >= 17){ return ['kukaufelia (づ◡ど)','晚上好'] /* 深夜*/  }
				else { return ['wajalia (～￣▽￣)～','日间安康'] /* 日间*/  }
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
			var seolist = ousuatia(sueseo,outimelist[3])
			msg = msg+outimelist[0]+'年'+outimelist[1]+'月'+outimelist[2]+'日'+'  '
			if (Math.random() > 0.5){ msg+=seolist[0] }
			else { msg+=seolist[1] }
			//msg+='【'+wisjikan(outimelist[3])+' : '+wisjikan(outimelist[4])+' : '+wisjikan(outimelist[5])+'】'
			return msg
		}
        function time() {
			if(document.getElementById("time")!=null){
				document.getElementById("time").innerText=msgtia();
			}
        }
		$("#submit").click(function hito(){
			txt = $("#zito").val();
			var resi = "";
			$.ajax({
            url:"https://delok.sikan.moe/",
            dataType:"json",
            data:{ tintext:txt },
            success: function (d) {
						
						var data = d;
							if (data!=null){
							var list =  data.neiso;
							var tem = 10;
							if(list.length<10){ tem=list.length; }
							for (var i=0;i<tem;i++){
								resi+=list[i]["zito"];
								resi+=" -- ";
								resi+=list[i]["chines"];
								if(list[i]["text"]!=null){
									resi+="；";
									resi+=list[i]["text"];
								};
								resi+="\n";
							};
						}

						document.getElementById("sikan").innerText=resi;

            }
        });
			

		})
