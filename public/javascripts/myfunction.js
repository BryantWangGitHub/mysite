var actionto =function (action){
 $("#actionform").attr("action",action).submit();
};

var deletepost = function (url,domid,postid)
{
  var form = new FormData();  
  form.append("postid",postid );
  var info = { "postid":postid}; 
  $.ajax({
    url: url,
    type:'post',
    error:function(){
      alert("删除失败");
    },
    success:function(msg){
              if(msg!=undefined && msg=='1')
                $('#'+domid).remove();
              else
                alert("删除失败"+msg);

     },
    data: info,
  });
};

var greatpost = function (url,domid,postid)
{
  var form = new FormData();  
  alert(postid);
  form.append("postid",postid.id);
  var info = { "postid":postid}; 
  $.ajax({
    url: 'url',
    type:'post',
    error:function(){
      alert("删除失败");
    },
    success:function(msg){
              if(msg!=undefined && msg=='1')
                $('#'+domid).remove();
              else
                alert("删除失败"+msg);

     },
    data: info,
  });
};
var onslectimg = function (url,showback)
{
  alert('onchage');
  var form = new FormData();  
  var files = $('#file').files; 
  if(files)
  {
      form.append("file", files[0]);
  }
  $.ajax({
      url: url,
      type:'post',
      error:function(){
        alert("上传文件失败,请尝试重新提交");
      },
      success:function(msg){
        alert("成功"+msg);
        $("#"+showback).append("<img src=>img</img>")         
      },
      data : form ,
      processData: false, 
  });
};

function errprompt(str,domid)
{
    $("#errprdiv").remove();
    $("#"+domid).before("<div id='errprdiv' class='alert alert-error'><p>"+str+"</p></div>");
}
function removeprompt()
{
  $(".alert alert-error").remove();
}
function tips(select,place,info,evet)
{
  if(typeof select == "object"){
    select.popover('destroy');
    select.popover({
      placement:place,
      content:info,
      trigger:evet
    });
  }
  else if(typeof select == "string")
  {
    $(select).popover('destroy');
    $(select).popover({
      placement:place,
      content:info,
      trigger:evet
    });
  }
  else{
    alert('函数传入参数错误');
  }
}

function removetips(select)
{
  if(typeof select == "object"){
    select.popover('destroy');
  }
  else if(typeof select == "string")
  {
    $(select).popover('destroy');
  }
  else{
    alert('函数传入参数错误');
  }
}

function removedom(select)
{
  if(typeof select == "object"){
    select.remove();
  }
  else if(typeof select == "string")
  {
    $(select).remove();
  }
  else{
    alert('函数传入参数错误');
  }
}

function resetinputandimg(name)
{
  $("[name='"+name+"']").each(function(){
    if(this.id.toString()!="imglink")
      this.remove();
    else
      this.value='';
  });
  return false;
}

function addInfoToForm(formid , name ,info ){
  var rs = $("#"+formid).append("<input type='hidden' name='"+name+"' value='"+info+"'></input>");
}
