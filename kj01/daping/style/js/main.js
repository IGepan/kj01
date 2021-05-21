/**
 * 关闭下拉菜单点击
 */
$(document).ready(function(){
    $(document).off('click.bs.dropdown.data-api');
    dropdownOpen();//调用
});
function dropdownOpen() {

    var $dropdownLi = $('.dropdown');

    $dropdownLi.mouseover(function() {
        $(this).addClass('open');
    }).mouseout(function() {
        $(this).removeClass('open');
    });
};