$(function  () {
    var todos=localStorage.todos?$.parseJSON(localStorage.todos):[];
    var selected=localStorage.selected?$.parseJSON(localStorage.selected):'All';
    var savedate=function  () {
        localStorage.todos=JSON.stringify(todos);
        render();
    }
    var render=function  () {
        $('#todo-list').empty().append(function  () {
            var ts;
            //三种状态//ui
            $('#filters .selected').removeClass('selected');
            $('#filters li a:contains('+selected+')').addClass('selected')
            //数据
            if(selected==='All'){
                ts=todos;
            }else if(selected==='Active'){
                ts=$.grep(todos,function  (v) {
                    return v.isDown===false;
                })
            }else{
                ts=$.grep(todos,function  (v) {
                    return v.isDown===true;
                })
            }
            //mian是否显示
            $('#main').css('display',ts.length?'block':'none');

            return $.map(ts,function  (v) {
                var check=v.isDown?'checked':'';
                var addc=v.isDown?'completed':'';
                return '<li data-id="'+v.id+'" class="'+addc+'"><div class="view"><input type="checkbox" '+check+' class="toggle"><label >'+v.content+'</label><buttom class="destroy"></buttom></div><input  class="edit" value="'+v.content+'"></li>';
            })  
        })
        //全选和单选同步
        var selectAll=$.grep(todos,function  (v) {
            return v.isDown;
        })
        $('#toggle-all').prop('checked',selectAll.length===todos.length?true:false);
        //计数
        $('#todo-count strong').text(todos.length-selectAll.length);
        //多选删除
        $('#clear-completed').css('display',selectAll.length?'block':'none');
        //footer是否显示
        $('#footer').css('display',todos.length?'block':'none')
    }   
    render();
    var addTodos=function  (e) {
        if(e.keyCode!==13||$.trim($(this).val())===''){
                return;
            }
            var newtodos={
            id:todos.length?Math.max.apply(null,$.map(todos,function  (v) {
                return v.id;
            }))+1:1001,
            content:$(this).val(),
            isDown:false
            }
            todos.push(newtodos)
            $(this).val('');
            savedate();
    }
    $('#new-todo').on('keyup',addTodos)
    
    var removeTodos=function  () {
        var id=parseInt($(this).closest('li').attr('data-id'));
        todos=$.grep(todos,function  (v) {
            return v.id!==id;
        })
        savedate();
    }
    $('#todo-list').on('click','.destroy',removeTodos)
    var toggle=function  () {
        var id=parseInt($(this).closest('li').attr('data-id'));
        var zd=this.checked;     
        $(todos).each(function  (i,v) {
            if(v.id===id){
                v.isDown=zd;
            }
        })
        savedate();
    }
    $('#todo-list').on('click','.toggle',toggle)

    var editing=function  () {
        $(this).closest('li').addClass('editing');
        var input=$('.edit').focus();
        input.val(input.val()).focus();
    }
    $('#todo-list').on('dblclick','label',editing)
    
    var save=function  () {
        var id=parseInt($(this).closest('li').attr('data-id'));
        var _v=$(this).val();
        $(todos).each(function  (i,v) {
            if(id===v.id){
                v.content=_v;
            }
        })
        savedate();
    }
    $('#todo-list').on('keyup','.edit',function  (e) {
        if(e.keyCode===13){
            $.proxy(save,this)();
        }
    })
    $('#todo-list').on('focusout','.edit',save)
     
    var selecteds=function  () {
         
         selected=$(this).text();
         localStorage.selected=JSON.stringify(selected)
         render();
    }
    $('#filters li a').on('click',selecteds)
    var toggleAll=function  () {
         var check=this.checked;
         $(todos).each(function  (i,v) {
             v.isDown=check;
         })
         savedate();
    }
    $('#toggle-all').on('click',toggleAll)
    var deletes=function  () {
        $('#todo-list .completed .destroy').each(function  (i,v) {
            $.proxy(removeTodos,this)();
        })
    }
    $('#clear-completed').on('click',deletes)
})


// $.get({
//     url:
//     data:

// }).done(function  () {
    
// }).fail(function  () {
    
// })