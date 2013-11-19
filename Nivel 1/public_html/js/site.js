$(function() {
    activateLinks();
});

function activateLinks() {
    $("a").not(".item-menu").click(function( event ) {
        if($(this).attr("href")!="#"){
            event.preventDefault();
            $.ajax( "obj/"+$(this).attr("href")+".html" )
                .done(function(data) {
                    $("#main_content").empty();
                    $("#main_content").append(data);
                    activateLinks();
            });
            return false;
        }
    });
}
