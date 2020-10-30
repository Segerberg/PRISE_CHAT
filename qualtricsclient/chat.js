let qid = this.questionId;
$(document).ready(function () {
    let resp_id = '${e://Field/ResponseID}'
    namespace = '/test';
    var survey_id = '123';
   /* if (localStorage !== null) {
        var lskey = localStorage.length - 1;
        $.each(localStorage, function (key, value) {
            $('#chatbox').append('<br>' + $('<div/>').text(value).html());
            console.log(key, value)
        });

    } else {
        let lskey = 1;
    }
    ;*/

    const socket = io('http://127.0.0.1:5000/test');

    socket.on('connect', function () {
        //socket.emit('my_event', {data: 'I\'m connected!'});
        socket.emit('join', {room: resp_id, survey: survey_id, question_id: qid});
    });

    socket.on('my_response', function (msg, cb) {

        $('#chatbox').append('<br>' + $('<div/>').text(msg.data).html());
        $("#chatbox").animate({scrollTop: 200000}, "slow");
        //localStorage.setItem(lskey += 1, msg.data)

        if (cb)
            cb();
    });
    $('#echobtn').click(function () {
        socket.emit('my_room_event', {room: resp_id, data: $('#emit_data').val(), question_id: 'qualtrics_id'});
        $('#emit_data').val('');
    });
});

(function ($) {
    $(document).ready(function () {
        let $chatbox = $('.chatbox'),
            $chatboxTitle = $('.chatbox__title'),
            $chatboxTitleClose = $('.chatbox__title__close');
        $chatboxTitle.on('click', function () {
            $chatbox.toggleClass('chatbox--tray');
        });
        $chatboxTitleClose.on('click', function (e) {
            e.stopPropagation();
        });
    });
})(jQuery);