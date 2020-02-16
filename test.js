$(function() {
            $('#showContent').click(function(event){
                event.preventDefault();
                var pageSource = '<html>' + $('html').html() +'</html>';
                alert(pageSource);
            });
    });
