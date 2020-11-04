let qid = this.questionId;
    let resp_id = '${e://Field/ResponseID}'
    let survey_id = '${e://Field/SurveyID}';
    let socket = io('http://127.0.0.1:5000/prise'); // SET TO SERVER URI

    socket.on('connect', function () {
        //socket.emit('my_event', {data: 'I\'m connected!'});
        socket.emit('join', {room: resp_id, survey: survey_id, question_id: qid});
    });

    socket.on('my_response', function (msg, cb) {

        jQuery('#chatbox').append('<br>' + jQuery('<div/>').text(msg.data).html());
        jQuery("#chatbox").animate({scrollTop: 200000}, "slow");
        //localStorage.setItem(lskey += 1, msg.data)

        if (cb)
            cb();
    });
    jQuery('#echobtn').click(function () {
        socket.emit('my_room_event', {room: resp_id, data: jQuery('#emit_data').val(), question_id: 'qualtrics_id'});
        jQuery('#emit_data').val('');
    });


(function ($) {

        let $chatbox = jQuery('.chatbox'),
            $chatboxTitle = jQuery('.chatbox__title'),
            $chatboxTitleClose = jQuery('.chatbox__title__close');
        $chatboxTitle.on('click', function () {
            $chatbox.toggleClass('chatbox--tray');
        });
        $chatboxTitleClose.on('click', function (e) {
            e.stopPropagation();
        });

})(jQuery);