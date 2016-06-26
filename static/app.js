$( window ).load(function() {
    render_screen();
});

var options = {
  valueNames: [ 'name', 'description' ],
  item: '<li class="item"><h3 class="name"></h3><div class="description"></div></li>',
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
    $('html,body').animate({
            scrollTop: object.offset().top - window.innerHeight/2 + object.height()},
            75);
}

var selected_item = function() {
    return $('.selected').first();
}

var deselect = function(object) {
    object.removeClass('selected').addClass('item');
}

var play_selection = function(selection) {
    play_game(selection.find('.description').html());
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


$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        break;

        case 38: // up
        up_arrow();
        break;

        case 39: // right
        break;

        case 40: // down
        down_arrow();
        break;

        case 13: //enter
        play_selection(selected_item());
        break;


        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});