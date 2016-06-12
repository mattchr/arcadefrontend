$( window ).load(function() {
  $.getJSON('api/v1/roms/list', add_roms_to_list);
});

var options = {
  valueNames: [ 'name', 'description' ],
  item: '<li><h3 class="name"></h3></li>'
};

var userList;

var add_roms_to_list = function(roms) {
    var values = roms.map(function(x) {
        return {
            name: '<a onclick="play_game(\'' + x.internal_name + '\');">' + x.full_name + '</a>',
            description: x.internal_name
            };
    })
    userList = new List('users', options, values);
}

var play_game = function(internal_name) {
    $.get('/api/v1/roms/play/' + internal_name);
}