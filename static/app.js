$( window ).load(function() {
    render_screen();
});

var options = {
  valueNames: [ 'name', 'description' ],
  item: '<li class="item"><h3 class="name"></h3><div class="description"></div><div class="marquee"></div></li>',
};

var userList;

var render_screen = function() {
    $.getJSON('api/v1/roms/list', add_roms_to_list);
}

var add_roms_to_list = function(roms) {
    var values = roms.map(function(x) {
        return {
            name:  x.full_name,
            description: x.internal_name
            };
    })
    userList = new List('users', options, values);
    $('.item').click(function (event) {
        select($(this));
    });
    $('.item').dblclick(function (event) {
        console.log("double click");
        play_selection($(this));
    })
}

var select = function(object) {
    deselect(selected_item());
    object.removeClass('item').addClass('selected');
    object.click(function() {
        deselect(object);
        object.click(function (event) {
            select($(this));
        });
    });
    var internal_name = object.find('.description').first();
    object.find('.marquee').error(function () {
        $(this).hide();
    });

    $.get('/api/v1/artwork/marquee/' + get_rom_name(object), function(data) {
        if (!data) {
            return;
        }
        object.find('.marquee').html('<img src="/api/v1/artwork/marquee/' + get_rom_name(object) + '" height=100px></img>');
    });
    $('html,body').animate({
            scrollTop: object.offset().top - window.innerHeight/2 + object.height()},
            75);
}

var get_rom_name = function(object) {
    return object.find('.description').first().html().replace(/ /g,'');
}

var selected_item = function() {
    return $('.selected').first();
}

var deselect = function(object) {
    object.removeClass('selected').addClass('item');
    object.find('.marquee').html('');
}

var play_selection = function(selection) {
    play_game(get_rom_name(selection));
}

var play_game = function(internal_name) {
    console.log('playing ' + internal_name);
    $.get('/api/v1/roms/play/' + internal_name);
}

var up_arrow = function() {
    var selected = selected_item();
    var previous = selected.prev('.item');
    if (!previous.length) {
        return;
    }
    select(previous);
    deselect(selected);
}

var down_arrow = function() {
    var selected = selected_item();
    if (selected.length == 0) {
        select($('.item').first());
        return;
    }
    var next = selected.next('.item');
    if (!next.length) {
        return;
    }
    select(next);
    deselect(selected);
}

var page_down = function() {

};

var page_up = function() {

};

$(document).keydown(function(e) {
    var launch_game = function() {
            play_selection(selected_item());
        };
    var key_handler_lookup = {
        37: function() {},                      // left
        38: up_arrow,                           // up
        39: function() {},                      // right
        40: down_arrow,                         // down
        13: launch_game,
        49: launch_game,                         // P1 start
        17: launch_game,                        // P1 button one
        34: page_down,
        33: page_up
    };
    if (!(e.which in key_handler_lookup)) {
        return;
    }
    key_handler_lookup[e.which]();

//   e switch(e.which) {
//        case 37: // left
//        break;
//
//        case 38: // up
//        up_arrow();
//        break;
//
//        case 39: // right
//        break;
//
//        case 40: // down
//        down_arrow();
//        break;
//
//        case 13: //enter
//        play_selection(selected_item());
//        break;
//
//
//        default: return; // exit this handler for other keys
//    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});