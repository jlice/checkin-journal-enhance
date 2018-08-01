// ==UserScript==
// @name         打卡日记增强
// @namespace    https://github.com/jlice/shanbay-user-scripts
// @supportURL   https://github.com/jlice/shanbay-user-scripts
// @version      0.1.3
// @description  显示时区、真实打卡日记、打卡时间、各项学习时长
// @author       文剑木然 <1121672253@qq.com>
// @match        *://www.shanbay.com/checkin/user/*
// @run-at       document-end
// @require      https://static.baydn.com/static/scripts/jquery-1.7.2.min.js
// @updateURL    https://raw.githubusercontent.com/jlice/shanbay-user-scripts/master/journal-enhancement/meta.js
// @downloadURL  https://raw.githubusercontent.com/jlice/shanbay-user-scripts/master/journal-enhancement/user.js
// ==/UserScript==


$(function(){
    var url = window.location.href
                             .replace('shanbay.com', 'shanbay.com/api/v1')
                             .replace('?page', '?ipp=10&page');
    $.get(url, function(json){
        // 显示非上海时区
        var timezone = json.data[0].user.timezone;
        if(json.data.length > 0 && timezone !== 'Asia/Shanghai'){
            $('h2').append('（' + timezone +'）');
        }
        // 修正打卡日记
        for(var i=0; i<10; i++){
            var idata = json.data[i];
            var icheckin = $('#checkin').children().eq(i);
            var number = icheckin.find('span.number');
            number.html(' ' + idata.num_checkin_days);
            var note = icheckin.find('div.note');
            var info = idata.info
            // 提示各项学习时间
            var items = {'bdc': '单词', 'listen': '听力', 'read': '文章', 'sentence': '炼句', 'speak': '口语', 'elevator': '阶梯训练', 'prepare': '训练营课程'}
            for(var k in items){
                if(k in idata.stats){
                    info = info.replace(items[k], '<a href="javascript:void(0)" style="text-decoration:none;color:#333" title="学习时间: ' + idata.stats[k].used_time + '分钟">' + items[k] + '</a>');
                }
            }
            if(json.data[i].note_length === 0){
                note.html(info);
            }else{
                note.html(info + ' , ' + idata.note);
            }
            // 显示打卡时间
            var date = icheckin.find('div.span4');
            date.html('<strong>' + idata.checkin_date + '</strong>&nbsp;&nbsp;&nbsp;&nbsp;(' +
                      idata.checkin_time.replace('T', '&nbsp;&nbsp;') + ')');
        }
    });
});
