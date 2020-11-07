

    namespace = '/prise';
    let socket = io(namespace); // SET TO SERVER URI

    socket.on('connect', function () {
        //socket.emit('my_event', {data: 'I\'m connected!'});
        socket.emit('join', {room: resp_id, survey: survey_id, question_id: qid});
    });

    let x = socket.on('my_response', function (msg, cb) {

        jQuery('#chatbox').append('<br>' + jQuery('<div/>').text(msg.data).html());
        jQuery("#chatbox").animate({scrollTop: 200000}, "slow");
        //localStorage.setItem(lskey += 1, msg.data)

        if (cb)
            cb();
    });
    jQuery('#echobtn').click(function (e) {
        socket.emit('my_room_event', {room: resp_id, data: jQuery('#emit_data').val(), question_id: 'qualtrics_id'});
        e.stopPropagation();
        jQuery('#emit_data').val('');
    });


(function (jQuery) {

        let chatbox = jQuery('.chatbox');
        let chatboxTitle = jQuery('.chatbox__title');
        let chatboxTitleClose = jQuery('.chatbox__title__close');
            jQuery(chatboxTitle).on('click', function () {
            jQuery(chatbox).toggleClass('chatbox--tray');
        });
        jQuery(chatboxTitleClose).on('click', function (e) {
            e.stopPropagation();
        });

})(jQuery);
