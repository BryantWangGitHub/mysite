function checkempty(select)
{
  var text = new String($(select).val());
  if(typeof select == "object"){
    text = new String(select.val());
  }
  else if(typeof select == "string")
  {
    text = new String($(select).val());
  }
  else
  {
    alert('参数传入错误');
    return false;
  }
  text = $.trim(text);
  if(text.length < 1){
    return false;
  }
  return true;
}

function onclk(select){
  if(!checkempty(select)){
    errprompt("输入不能为空","sayform");
    return false;
  }
  else{
    removeprompt();
    document.form[0].submit();
  }
}
function textonblur(select)
{
  var $text = $(select);
  if(!checkempty(select))
  {
    tips(select,'left',"不能为空",'focus');
    $text.focus();
  }
  else
  {
    removetips(select);
  }
}
function addinput(select,no,iflink)
{
  if(iflink)
  {
    //显示图片
    $(select).after("<br/><img name='imgsrc'  id='img"+no+"' src='"+ $(select).val()+"'  alt='图破了- -' width='100' height='100' ></img>");
    var $img = $('#img'+no); 
    //图片后追加图片链接输入框
    var dom="<br/><input id='imglink"+no+"' name='imgsrc' ></input>";
    $img.after(dom);
    var $newdom = $("#imglink"+no); 
    //输入框增加imginputblur方法
    $newdom.attr('onblur',"imginputblur('#imglink"+no+"')");
    var fieldom="<input id='imglinkfile"+no+"' name='imgfile' =></input>"
    var $filedom= $("#imglinkfile"+no);
    $filedom.attr('onchange',"imginputblur('#imglinkfile"+no+"')");

  }
  /**如果为文件，上传至后台进行校验并返回结果*/
  else
  {
    var form = new FormData();
    var files = $(select).files;
    if(files)
    {
      form.append("imgfile", files[0]);
    }
    $.ajax({
      url: '/uploadimg',
      type:'post',
      error:function(){
        alert("上传文件失败,请尝试重新提交");
      },
      success:function(msg){
                alert("成功"+msg);
                $(select).append("<img src=>img</img>")
              },
      data : form ,
      processData: false,
    });
  }
    


}
function imginputblur(select)
{
  var $text = $(select);
  var no = $("#sayform div.modal-body input").length;
  if(!checkempty(select))
  {
    if($text.attr('index') != '1'){
      removedom($text);
    }
  }
  else
  {
    //$('#imglink').after("<br/><input id='imglink"+no+"',onblur='imginputblur('#imglink"+no+"')' ,onblur='imginputblur('mglink"+no+"')',name='imgsrc'></input>&nbsp;<i class='icon-search icon-remove' ,onclick='removedom('#mglink"+no+"')'></i>");
    if($text.attr('type')=="text")
      addinput(select,no,1);
    else($text.attr('type')=="file")
      addinput(select,no,0);
  }
}

!function($) {
  $.fn.validation = function(options) {
    return this.each(function() {
      globalOptions = $.extend({}, $.fn.validation.defaults, options);
      validationForm(this)
    });
  };

  $.fn.validation.defaults = {
    validRules : [
    {name: 'required', validate: function(value) {return ($.trim(value) == '');}, defaultMsg: '请输入内容。'},
    {name: 'number', validate: function(value) {return (!/^[0-9]\d*$/.test(value));}, defaultMsg: '请输入数字。'},
    {name: 'mail', validate: function(value) {return (!/^[a-zA-Z0-9]{1}([\._a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+){1,3}$/.test(value));}, defaultMsg: '请输入邮箱地址。'},
    {name: 'char', validate: function(value) {return (!/^[a-z\_\-A-Z]*$/.test(value));}, defaultMsg: '请输入英文字符。'},
    {name: 'chinese', validate: function(value) {return (!/^[\u4e00-\u9fff]$/.test(value));}, defaultMsg: '请输入汉字。'},
    {name: 'lengthMax', validate: function(value) {return (new String(value).length > 140);}, defaultMsg: '不得大于140个字'}
    ]
  };

  var formState = false, fieldState = false, wFocus = false, globalOptions = {};

  var validateField = function(field, valid) { // 验证字段
    console.log('into validateField');
    var el = $(field), error = false, errorMsg = '';
    for (i = 0; i < valid.length; i++) {
      var x = true, flag = valid[i], msg = (el.attr(flag + '-message')==undefined)?null:el.attr(flag + '-message');;
      if (flag.substr(0, 1) == '!') {
        x = false;
        flag = flag.substr(1, flag.length - 1);
      }

      var rules = globalOptions.validRules;
      for (j = 0; j < rules.length; j++) {
        var rule = rules[j];
        if (flag == rule.name) {
          if (rule.validate.call(field, el.val()) == x) {
            error = true;
            errorMsg = (msg == null)?rule.defaultMsg:msg;
            tips(el,'left',errorMsg,'focus');
            el.focus();
            break;
          }
        }
      }
      if (error) {break;}
    }

    //var controls = el.parents('.controls'), controlGroup = el.parents('.control-group'), errorEl = controls.children('.help-block, .help-inline');

    if (error) {
      /*
         if (!controlGroup.hasClass('error')) {
         if (errorEl.length > 0) {
         var help = errorEl.text();
         controls.data('help-message', help);
         errorEl.text(errorMsg);
         } else {
         controls.append('<span class="help-inline">'+errorMsg+'</span>');
         }
         controlGroup.addClass('error');
         }*/

    } else {
      /*
         if (fieldState) {
         if (errorEl.length > 0) {
         var help = controls.data('help-message');
         if (help == undefined) {
         errorEl.remove();
         } else {
         errorEl.text(help);
         }
         }
         controlGroup.attr('class','control-group');
         } else {
         if (errorEl.length > 0) {
         var help = errorEl.text();
         controls.data('help-message', help);
         }
         }*/
      removetips(el)
    }
    return !error;
  };

  var validationForm = function(obj) { // 表单验证方法
    $(obj).submit(function() { // 提交时验证
      console.log('into submit');
      if (formState) { // 重复提交则返回
        return false;
      }
      formState = true;
      var validationError = false;
      var waitToRemove = [];
      $('input, textarea', this).each(function () {
        var el = $(this), valid = (el.attr('check-type')==undefined)?null:el.attr('check-type').split(' ');
        var ifrequare = null;
        if (valid != null && valid.length > 0) {
          if (!validateField(this, valid)) {
            if (wFocus == false) {
              scrollTo(0, el[0].offsetTop - 50);
              wFocus = true;
            }

            validationError = true;
          }
          console.log('valid='+valid);
          /**如果不为必输，删除输入并提交*/
          if(valid.indexOf("required") < 0){
            console.log('非必输input id='+el.atrr('id'));  
            //el.remove();
            waitToRemove.push(el);
          }
        }
        else{
          console.log("不属于配置类input id="+el.attr('id'));
          if(el.val()==null||el.val()==''||$.trim(el.val()).length < 1)
          {
            //el.remove();
            waitToRemove.push(el);
            //console.log("remove check "+$("#"+el.attr('id')).length);
          }
        }
      });

      wFocus = false;
      fieldState = true;

      if (validationError) {
        formState = false; 

        $('input, textarea').each(function() {
          var el = $(this), valid = (el.attr('check-type')==undefined)?null:el.attr('check-type').split(' ');
          if (valid != null && valid.length > 0) {
            el.focus(function() { // 获取焦点时
            });
            el.blur(function() { // 失去焦点时
              validateField(this, valid);
            });
          }
        });

        return false;
      }
      /*删除不需要提交到后台的input信息*/
      waitToRemove.forEach(function(dom,index){
        console.log("remove id="+dom.attr('id'));
        dom.remove(); 
      });

      $("[data-loading-text='Loading...']").button('loading');
      return true;
    });


  };
}(window.jQuery);
