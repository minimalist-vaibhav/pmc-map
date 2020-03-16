$(document).ready(function() {

    $.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results?results[1]:0;
}
var mall=null;
if($.urlParam('mall')){
 mall=$.urlParam('mall');
$('.centerMapHolder').load('./mall/'+mall+'.html');

 //$( function() {
         $.ajax({
            url: 'http://localhost:3004/entities/'+mall,
            type: "GET",
            dataType: "json",
            success: function(result) {
                console.log(result);
                var places=[];
                for (var i = 0; i < result.length; i++) {
                    places.push(result[i].name);
                }
                $( "#currentlyAt" ).autocomplete({
          source: places
        });
        $( "#destination" ).autocomplete({
          source: places
        });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error',errorThrown);
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

    $('.rightSideTab ul li').on('click', function() {
        var mapFloor = $(this).attr('id');
        $('.rightSideTab ul li').removeClass('active_floor_tab');
        $(this).addClass('active_floor_tab');
        $('.floor_data').css('display', 'none');
        $('.' + mapFloor).fadeIn();
    });
    var places = [{
            src: "renault",
            srcFloor: "ground",
            dst: "marks & spencer",
            dstFloor: "ground",
            path: "M265.7,676.3l84.5-43c0,0-33.7-27.4-3.9-43l167.5-90c0,0-24.3-21.1,21.9-33.7l-27-138.5c0,0-28.8-14.2-11.9-39.7c13.9-20.9,49.5-17.4,49.5-17.4l128-0.8",
            route: [{
                text: "Depart from renault",
                image: "./images/start.svg"
            }, {
                text: "Head straight",
                image: "./images/straight.png"
            }, {
                text: "Turn left",
                image: "./images/turnLeft.png"
            }, {
                text: "Head straight",
                image: "./images/straight.png"
            }, {
                text: "Turn slightly left",
                image: "./images/slightlyLeft.png"
            }, {
                text: "Head straight",
                image: "./images/straight.png"
            }, {
                text: "Turn Right",
                image: "./images/turnRight.png"
            }, {
                text: "Head straight",
                image: "./images/straight.png"
            }]
        }, {
            src: "renault",
            srcFloor: "ground",
            dst: "Creme Center",
            dstFloor: "first",
            path: "M265.7,676.3l84.5-43c0,0-33.7-27.4-3.9-43l167.5-90c0",
            route: [{
                text: "Depart from renault",
                image: "./images/start.svg"
            }, {
                text: "Head straight",
                image: "./images/straight.png"
            }, {
                text: "Turn left",
                image: "./images/turnLeft.png"
            }, {
                text: "Head straight",
                image: "./images/straight.png"
            }, {
                text: "Take Escalator",
                image: "./images/escalator.png",
                type: "link",
                src: "escalator 2",
                dst: "Creme Center"
            }]
        }, {
            src: "escalator 2",
            srcFloor: "first",
            dst: "Creme Center",
            dstFloor: "first",
            path: "M487,525l215-115h29c0,0,4-14.9,36-14c35,1,45,14,45,14h117",
            route: [{
                text: "Escalator",
                image: "./images/escalator.png"
            }, {
                text: "Head straight",
                image: "./images/straight.png"
            }, {
                text: "Turn slightly right",
                image: "./images/slightlyRight.png"
            }, {
                text: "Head straight",
                image: "./images/straight.png"
            }]
        }]
        //M265.7,676.3l84.5-43c0,0-33.7-27.4-3.9-43l167.5-90c0

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

        //alert(currentlyAt+" "+destination);

        //alert(currentlyAt+" "+destination);
        bindMap(currentlyAt, destination,floor);


    })

    function bindMap(currentlyAt, destination,floor) {
    	//alert("hello");
    	let url='http://localhost:3004/route/'+mall+'/' + currentlyAt + '/' + destination+'/';
    	if(floor){
    		url+='?floor='+floor
    	}

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(result) {
                //result=JSON.parse(JSON.stringify(result));
                // console.log(result);
                //const result = places.filter(place => (place.src==currentlyAt && place.dst==destination));
                console.log("result>>>>>>", result);
                if (result) {
                    var srcFloor = result.source_floor;
                    var path = result.path;
                    // console.log("srcFloor",srcFloor);

                    $('.rightSideTab ul li').removeClass('active_floor_tab');
                    $("#" + srcFloor).addClass('active_floor_tab');
                    $('.floor_data').css('display', 'none');
                    $('.' + srcFloor).fadeIn();
                    setTimeout(function() {
                        //	alert(srcFloor+"Src");
                        $("#" + srcFloor + "Path").attr("d", path);
                        $("#" + srcFloor + "Src").attr("cx", 261.8);
                        $("#" + srcFloor + "Src").attr("cy", 678.7);
                    }, 3000)

                    $('.selectedPlace').each(function() {
                        $(this).removeClass('selectedPlace');
                    })

                    var routeData = result.route;
                    // console.log(routeData);
                    var currentlyAtId = result.source_id;//"store-" + currentlyAt.toLowerCase().replace(/ /g, "-");
                    var destinationId = result.destination_id;//"store-" + destination.toLowerCase().replace(/ /g, "-");
                   // var destinationId = destinationId.replace(/-&/g, "");

                    if(result.escalator_location){
                       // alert("#"+srcFloor+"EscalatorLocation");
                    	$("#"+srcFloor+"EscalatorLocation").attr("d",result.escalator_location);

                    }else{
                    	$("#"+srcFloor+"EscalatorLocation").attr("d","");
                       
                    }

                    if(result.next_floor){
                    	$("#"+srcFloor+"EscalatorLocation").attr("data-floor",result.next_floor);

                    }else{
                    	$("#"+srcFloor+"EscalatorLocation").attr("data-floor","");
                       
                    }

                    if(result.next_dst){
                        if(result.next_src){
                        $("#"+srcFloor+"EscalatorLocation").attr("data-src",result.next_src);
                        }else{
                    	$("#"+srcFloor+"EscalatorLocation").attr("data-src",result.destination);
                    	}
                        $("#"+srcFloor+"EscalatorLocation").attr("data-dst",result.next_dst);

                    }else{
                    	$("#"+srcFloor+"EscalatorLocation").attr("data-src","");
                    	$("#"+srcFloor+"EscalatorLocation").attr("data-dst","");
                       
                    }


                    $("#"+currentlyAtId).addClass("selectedPlace");
                    $("#"+destinationId).addClass("selectedPlace");

                     	$('#routeDataHtml').html('');
                        var text='<li>';
                        if(result.next_floor){
                        text+='To go to ';
                        text+=result.next_dst?result.next_dst:result.destination;
                        
                       text+=' On '+result.destination_floor_name+' Floor';
                       text+=' Take '+result.next_src;
                       text+=' From '+result.source_floor_name+' Floor';


     
                        }
                       
                        text+='</li>';
                        $('#routeDataHtml').html(text);

                    //    for (index = 0; index < routeData.length; index++) { 
                    // 	var finalRoute = routeData[index];
                    // 		console.log(finalRoute);
                    // 		var text=finalRoute.text;
                    // 		if(finalRoute.type=="link"){
                    //         text='<a href="javascript:void(0);" class="changeFloor" id="goto" data-src="'+finalRoute.src+'" data-dst="'+finalRoute.dst+'">'+text+'</a>';
                    // 		}

                    // 		$('#routeDataHtml').append('<li><div class="directionIcon"><img src="'+finalRoute.image+'"></div><h4>'+text+'</h4></li>');

                    // 	}

                    $('.directionHolder').fadeIn();
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error', errorThrown);
            }
        });
        /*	const result = places.filter(place => (place.src==currentlyAt && place.dst==destination));
        	console.log("result",places);
        	if(result.length>0){
        	 var srcFloor = result[0].srcFloor;
        	 var path= result[0].path;
        	 
        	$('.rightSideTab ul li').removeClass('active_floor_tab');
        	$("#"+srcFloor).addClass('active_floor_tab');
        	$('.floor_data').css('display','none');
        	$('.' + srcFloor).fadeIn();
        	setTimeout(function(){
        	//	alert(srcFloor+"Src");
        	$("#"+srcFloor+"Path").attr("d",path);
        	$("#"+srcFloor+"Src").attr("cx",261.8);
        	$("#"+srcFloor+"Src").attr("cy",678.7);
           },1000)

        	$('.selectedPlace').each(function () {
        		$(this).removeClass('selectedPlace');
        	})

           var routeData = result[0].route;
           // console.log(routeData);
           var currentlyAtId="store-"+currentlyAt.toLowerCase().replace(/ /g, "-");
           var destinationId="store-"+destination.toLowerCase().replace(/ /g, "-");
           var destinationId=destinationId.replace(/-&/g, "");


        // alert(currentlyAtId+" "+destinationId);
        $("#"+currentlyAtId).addClass("selectedPlace");
        $("#"+destinationId).addClass("selectedPlace");

        	$('#routeDataHtml').html('');
           for (index = 0; index < routeData.length; index++) { 
        	var finalRoute = routeData[index];
        		console.log(finalRoute);
        		var text=finalRoute.text;
        		if(finalRoute.type=="link"){
                text='<a href="javascript:void(0);" class="changeFloor" id="goto" data-src="'+finalRoute.src+'" data-dst="'+finalRoute.dst+'">'+text+'</a>';
        		}

        		$('#routeDataHtml').append('<li><div class="directionIcon"><img src="'+finalRoute.image+'"></div><h4>'+text+'</h4></li>');

        	}

           $('.directionHolder').fadeIn();
        }*/
    }

});