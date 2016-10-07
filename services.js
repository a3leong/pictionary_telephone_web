module.exports = {
  service_test: function() {
    return ("Success");
  },


  socket_pool: function(socket_array) {
    this.socket_pool = socket_array;

    this.add_socket = function(ws) {
      this.socket_pool.push(ws);
    }

    this.close_sockets = function(ws) {
      for(ws in this.socket_pool) {
        ws.close();
      }
    }

    this.broadcast = function(message) {
      for(var i=0;i<this.socket_pool.length;i++) {
        this.socket_pool[i].send(message);
      };
    }

    this.socket_count = function() {
      return this.socket_pool.length;
    };
  },

  game_timer: function(socket_pool) {
    this.socket_pool = socket_pool;

    this.send_remaining_time = function(remaining_time) {
      this.socket_pool.broadcast(JSON.stringify({
        type: 'timer',
        data: { time_left: remaining_time }
      }));
    };

    this.timer_callback = function(time_in_seconds, callback, context, broadcast=true) {
      var _this = this; // To hold old self
      var remaining_time = time_in_seconds;

      var interval_id = setInterval(function(){
        console.log(remaining_time);
        if(--remaining_time <= 0) {
          clearInterval(interval_id);
          callback(context);
        }
        if(broadcast) { _this.send_remaining_time(remaining_time); }
      },1000);
    };
  },

  game_instance: function(game_id, player_sockets = []) {
    this.game_running = false;
    this.round_number = 0;
    this.game_id = game_id;
    this.player_sockets = new module.exports.socket_pool(player_sockets);
    this.game_timer = new module.exports.game_timer(this.player_sockets);
    this.draw_round_time = 30;
    this.phrase_round_time = 10;
    this.image_data = [];
    this.phrase_data = [];  // TODO handle ordering on recieving
    this.context = this;

    this.get_config = function() {
      // player_count is the players id as well if it hasn't been set yet
      return {
        type: 'gamestate',
        data:{
          state: 'config',
          game_id: this.game_id,
          player_count: this.get_player_count(),
          draw_round_time: this.draw_round_time,
          phrase_round_time: this.phrase_round_time
        } 
      };      
    }

    this.add_player = function(ws) {
      this.player_sockets.add_socket(ws);
      // Send all data because new player needs info, simpler to just resend to all
      this.send_message(JSON.stringify(this.get_config()));
    };

    this.get_player_count = function() {
      return this.player_sockets.socket_count();
    };

    this.send_message = function(message) {
      this.player_sockets.broadcast(message);
    };

    this.send_gamestate = function(state, data = null) {
        this.send_message(JSON.stringify({
          type: "gamestate",
          data: data
        }));
    };

    this.send_setup_info = function() {
        this.send_message(JSON.stringify({
          type: "gamestate",
          state: "config",
          draw_round_time: this.draw_round_time,
          phrase_round_time: this.phrase_round_time
        }));
    };

    this.is_game_over = function() {
      if(this.round_number < this.get_player_count()) {
        return false;
      } else {
        return true;
      }
    }

    this.start_game = function(){
      this.game_running = true;
      this.update_game(this.context);
    };

    this.update_game = function(context){
      if(context.is_game_over()) {
        console.log(context.round_number);
        context.game_running = false;
        context.send_results(context);
      }
      else {
        if((context.round_number++)%2==0){
          context.start_phrase_round(context);
        } else {
          context.start_draw_round(context);
        }
      }
    }

    this.start_phrase_round = function(context){
      // message.send(JSON.stringify({
      //   type: "gamestate",
      //   data: {state: "phrase"}
      // }));
      this.game_timer.timer_callback(this.phrase_round_time, this.update_game, context, broadcast=true);
    };

    this.start_draw_round = function(context){
      // message.send(JSON.stringify({
      //   type: "gamestate",
      //   data: {state: "draw"}
      // }));
      this.game_timer.timer_callback(this.draw_round_time, this.update_game, context, broadcast=true);
    };

    this.send_results = function(context){
      console.log("Game over");
      // message.send(JSON.stringify({
      //   type: "gamestate",
      //   state: "results"
      // }));
      // // TODO: fix later
      // this.send_message(this.image_data);
    };
  }
}