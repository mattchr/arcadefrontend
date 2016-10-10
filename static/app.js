$( window ).load(function() {
    var app = new ArcadeFrontEndApp();
    app.render_screen();
});

var ArcadeFrontEndApp = function() {
    var self = this;
    $(document).keydown(function(e) {
        var launch_game = function() {
                self.play_selection(self.selected_item());
            };
        var key_handler_lookup = {
            37: function() {},                      // left
            38: function() {self.up_arrow()},                           // up
            39: function() {},                      // right
            40: function() {self.down_arrow()},                         // down
            13: launch_game,
            49: launch_game,                         // P1 start
            17: launch_game,                        // P1 button one
            34: function() {self.page_down()},
            33: function() {self.page_up()}
        };
        if (!(e.which in key_handler_lookup)) {
            return;
        }
        key_handler_lookup[e.which]();

        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
};

ArcadeFrontEndApp.prototype = {
    render_screen: function() {
        var self = this;
        $.getJSON('api/v1/roms/list', function(roms) {
            self.add_roms_to_list(roms);
        });
    },

    add_roms_to_list: function(roms) {
        var self = this;
        var values = roms.map(function(x) {
            return {
                name:  x.full_name,
                description: x.internal_name
                };
        });
        userList = new List('users', {
          valueNames: [ 'name', 'description' ],
          item: '<li class="item"><h3 class="name"></h3><div class="description"></div><div class="marquee"></div></li>',
        }, values);
        $('.item').click(function (event) {
            self.select($(event.target));
        });
        $('.item').dblclick(function (event) {
            self.play_selection($(event.target));
        });
    },
    select: function(object) {
        var self = this;
        self.deselect(self.selected_item());
        object.removeClass('item').addClass('selected');
        object.click(function() {
            self.deselect(object);
            object.click(function (event) {
                select($(this));
            });
        });
        var internal_name = object.find('.description').first();
        object.find('.marquee').error(function () {
            $(this).hide();
        });

        $.get('/api/v1/artwork/marquee/' + self.get_rom_name(object), function(data) {
            if (!data) {
                return;
            }
            object.find('.marquee').html('<img src="/api/v1/artwork/marquee/' + self.get_rom_name(object) + '" height=100px></img>');
        });
        $('html,body').animate({
            scrollTop: object.offset().top - window.innerHeight/2 + object.height()},
            75);
    },
    get_rom_name: function(object) {
        var self = this;
        return object.find('.description').first().html().replace(/ /g,'');
    },
    selected_item: function() {
        var self = this;
        return $('.selected').first();
    },
    deselect: function(object) {
        var self = this;
        object.removeClass('selected').addClass('item');
        object.find('.marquee').html('');
    },
    play_selection: function(selection) {
        var self = this;
        self.play_game(self.get_rom_name(selection));
    },
    play_game: function(internal_name) {
        var self = this;
        $.get('/api/v1/roms/play/' + internal_name);
    },
    up_arrow: function() {
        var self = this;
        var selected = self.selected_item();
        var previous = selected.prev('.item');
        if (!previous.length) {
            return;
        }
        self.select(previous);
        self.deselect(selected);
    },
    down_arrow: function() {
        var self = this;
        var selected = self.selected_item();
        if (selected.length == 0) {
            self.select($('.item').first());
            return;
        }
        var next = selected.next('.item');
        if (!next.length) {
            return;
        }
        self.select(next);
        self.deselect(selected);
    },
    page_down: function() {
        var self = this;

    },
    page_up: function() {
        var self = this;

    }
};