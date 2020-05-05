function svgZoomPan(id) {
    var instance = new SVGPanZoom(document.getElementById(id), {
        eventMagnet: document.getElementById('SVGContainer'),
        zoom: {
            minZoom: 1,
            maxZoom: 3,
            events: {
                mouseWheel: true,
                doubleClick: true,
                pinch: true
            },

            callback: function callback(multiplier) {
                console.log(multiplier);
                zoom = multiplier
              
            }
        }

    });

    document.getElementById('zoomin').addEventListener('click', function() {
        instance.zoomIn(null, 0.5);
    });
    document.getElementById('zoomout').addEventListener('click', function() {
        if (zoom > 1.25) {
            instance.zoomOut(null, 0.5);
            var zoom = 1
        } else {
            instance.reset();

        }
    });
    document.getElementById('resetSVG').addEventListener('click', function() {
        instance.reset();
    });
}

$(document).ready(function() {

    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results ? results[1] : 0;
    }
    var mall = null;
    if ($.urlParam('mall')) {
        mall = $.urlParam('mall');
        var zoom = 1

        $('.centerMapHolder').load('./mall/' + mall + '.html', function() {
            svgZoomPan("groundFloor");
        });

        //$( function() {
        $.ajax({
            url: 'http://13.126.93.141:3002/entities/' + mall,
            type: "GET",
            dataType: "json",
            success: function(data) {
                var result = data.places;
                var floors = data.floors;
                if(floors.length <=0){
                    window.location.href="/" // redirect to homepage if map not found
                }
                var floorsHtml = "";
                for (var i = 0; i < floors.length; i++) {

                    floorsHtml += '<li id="' + floors[i].id + '" class="selectFloor ' + (floors[i].display_name == "G" ? "active_floor_tab" : "") + '"><h4 >' + floors[i].display_name + '</h4></li>';

                }

                $("#floors").html(floorsHtml);

                var places = [];
                for (var i = 0; i < result.length; i++) {
                    places.push(result[i].name);
                }
                $("#currentlyAt").autocomplete({
                    source: places
                });
                $("#destination").autocomplete({
                    source: places
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error', errorThrown);
            }
        });


        // } );
    }


    $('.wayfinderBoxTab input').focus(function() {
        $(this).parent().addClass('active_field')
    });
    $('.wayfinderBoxTab input').blur(function() {
        var input_value = $(this).val();
        if (input_value == "") {
            $(this).parent().removeClass('active_field')
        } else if (input_value != "") {
            $(this).parent().addClass('active_field')
        }
    });

    $('.wayfinderBoxTab input').each(function() {
        var val = $(this).val();
        if (val == "") {
            $(this).parent().removeClass('active_field')
        } else if (val != "") {
            $(this).parent().addClass('active_field')
        }
    });


    var clicks = 0;
    $("#like").click(function() {
        clicks++;
        $('.figure').html(clicks);
    });


    var zoomValue = 5;
    $('#big').on('click', function() {
        if (zoomValue < 9) {

            zoomValue++;
            $(".mapTabHolder svg").css("transform", "scale(1." + zoomValue + ")");
            $("#small").removeClass("disabled");
        } else {

            $("#big").addClass("disabled");
        }
    });

    $('#small').on('click', function() {
        if (zoomValue > 0) {
            zoomValue--;
            $(".mapTabHolder svg").css("transform", "scale(1." + zoomValue + ")");
            $("#big").removeClass("disabled");
        } else {

            $("#small").addClass("disabled");
        }
    });
    $(document).on("click", ".selectFloor", function() {

        //$('.selectFloor').bind('click',function() {
        var mapFloor = $(this).attr('id');
        //  alert(mapFloor);
        $('.rightSideTab ul li').removeClass('active_floor_tab');
        $(this).addClass('active_floor_tab');
        $('.floor_data').css('display', 'none');
        $('.' + mapFloor).fadeIn();
        svgZoomPan(mapFloor + "Floor");

    });

   
    $("#search").bind("click", function() {

        var currentlyAt = $("#currentlyAt").val();
        var destination = $("#destination").val();
        //alert(currentlyAt+" "+destination);
        bindMap(currentlyAt, destination);


    })

    $(document).on("click", "#goto, .escalatorLocation", function() {
        //$("#goto").bind("click",function(){
        var currentlyAt = $(this).attr("data-src");
        var destination = $(this).attr("data-dst");
        var floor = $(this).attr("data-floor");

        bindMap(currentlyAt, destination, floor);


    })

    function bindMap(currentlyAt, destination, floor) {
        //alert("hello");
        let url = 'http://13.126.93.141:3002/route/' + mall + '/' + currentlyAt + '/' + destination + '/';
        if (floor) {
            url += '?floor=' + floor
        }

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(result) {
                if (result) {
                    var srcFloor = result.source_floor;
                    var path = result.path;
                    // console.log("srcFloor",srcFloor);

                    $('.rightSideTab ul li').removeClass('active_floor_tab');
                    $("#" + srcFloor).addClass('active_floor_tab');
                    $('.floor_data').css('display', 'none');
                    $('.' + srcFloor).fadeIn();
                    svgZoomPan(srcFloor + "Floor");

                    setTimeout(function() {
                        //  alert(srcFloor+"Src");
                        $("#" + srcFloor + "Path").attr("d", path);
                        $("#" + srcFloor + "Src").attr("cx", 261.8);
                        $("#" + srcFloor + "Src").attr("cy", 678.7);
                    }, 3000)

                    $('.selectedPlace').each(function() {
                        $(this).removeClass('selectedPlace');
                    })

                    var routeData = result.route;
                    // console.log(routeData);
                    var currentlyAtId = result.source_id; //"store-" + currentlyAt.toLowerCase().replace(/ /g, "-");
                    var destinationId = result.destination_id; //"store-" + destination.toLowerCase().replace(/ /g, "-");
                  
                    if (result.escalator_location) {
                        $("#" + srcFloor + "EscalatorLocation").attr("d", result.escalator_location);

                    } else {
                        $("#" + srcFloor + "EscalatorLocation").attr("d", "");

                    }

                    if (result.next_floor) {
                        $("#" + srcFloor + "EscalatorLocation").attr("data-floor", result.next_floor);

                    } else {
                        $("#" + srcFloor + "EscalatorLocation").attr("data-floor", "");

                    }

                    if (result.next_dst) {
                        if (result.next_src) {
                            $("#" + srcFloor + "EscalatorLocation").attr("data-src", result.next_src);
                        } else {
                            $("#" + srcFloor + "EscalatorLocation").attr("data-src", result.destination);
                        }
                        $("#" + srcFloor + "EscalatorLocation").attr("data-dst", result.next_dst);

                    } else {
                        $("#" + srcFloor + "EscalatorLocation").attr("data-src", "");
                        $("#" + srcFloor + "EscalatorLocation").attr("data-dst", "");

                    }


                    $("#" + currentlyAtId).addClass("selectedPlace");
                    $("#" + destinationId).addClass("selectedPlace");

                    $('#routeDataHtml').html('');
                    var text = '<li>';
                    if (result.next_floor) {
                        text += 'To go to ';
                        text += result.next_dst ? result.next_dst : result.destination;

                        text += ' On ' + result.destination_floor_name + ' Floor';
                        text += ' Take ' + result.next_src;
                        text += ' From ' + result.source_floor_name + ' Floor';



                    }

                    text += '</li>';
                    $('#routeDataHtml').html(text);


                    $('.directionHolder').fadeIn();
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error', errorThrown);
            }
        });
       
    }

});