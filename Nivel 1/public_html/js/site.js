$(function() {
    activateLinks();
});

function activateLinks() {
    $("a").not(".item-menu").click(function( event ) {
        if($(this).attr("href")!="#"){
            event.preventDefault();
            $("#main_content").empty();
            $("#main_content").append($(".js-"+$(this).attr("href")).html());
            activateLinks();
            return false;
        }
    });
}
