function create_chat_window(id) {
    let si = '{{survey_id}}';
    //console.log(si)
    if ($('#' + id).length) {
        //console.log("Chat window " + id + " already exists")
        socket.emit('join', {room: id, survey: si});
        $("#" + id).show();
    } else {
        socket.emit('join', {room: id, survey: si});

        let panel = jQuery('<div/>', {
            id: id,
            class: 'col-xs-6 chat-panel'
        });

        let glyph = jQuery('<span/>', {
            class: 'pull-right',
            id: 'glyphid_' + id,
            style: 'color:yellow'
        })

        let panelheading = jQuery('<div/>/', {
            class: 'panel-heading chat-box-panel read',
            id: 'chat-box-panel-id_' + id
        });
        panelheading.html(id)

        let panelbody = jQuery('<div/>', {
            class: 'panel-body chat-body'
        })

        let container = jQuery('<div/>', {
            id: 'cid' + id,
            class: 'container'
        });

        let panelfooter = jQuery('<div/>', {
            class: 'panel-footer'
        });

        let inputgroup = jQuery('<div/>', {
            class: 'input-group'
        });

        let input = jQuery('<input/>', {
            id: 'inputid_' + id,
            class: 'form-control',
            type: 'text'
        });

        let span = jQuery('<span/>', {
                class: 'input-group-btn'
            }
        );
        let button = jQuery('<a/>', {
            id: 'btnid_' + id,

            class: 'btn btn-default send',
            type: 'button',
        });
        button.html('Send');
        button.on('click', emit_test(id));
        span = span.append(button);
        inputgroup = inputgroup.append(input).append(span);
        panelfooter = panelfooter.append(inputgroup);
        panelbody = panelbody.append(container);

        panel.append(panelheading.append(glyph)).append(panelbody).append(panelfooter).appendTo('#myid');
    }
}

$(document).ready(function () {
    $(document).on('click', '.send', function () {
        emit_test(this.id);
        let inputid = this.id.replace('btnid_', '#inputid_');
        $(inputid).val('');

    });
    $(document).on('click', '.chatt-button', function () {

        let chattid = this.id.replace('chatbtnid_', '');
        create_chat_window(chattid)
        claimChat(chattid)
        //$("#chatbtnid_" + chattid).removeClass('btn-warning');
        //$("#chatbtnid_" + chattid).addClass('btn-default');


    });
    $(document).on('click', '.chat-box-panel', function () {
        let chattid = this.id.replace('chat-box-panel-id_', '');
        $("#" + chattid).hide();
        unClaimChat(chattid)
        $('#liid_' + chattid).show();


        //create_chat_window(chattid)
    });

});


namespace = '/prise';
const socket = io(namespace);
$(document).ready(function () {

    socket.on('connect', function () {
        //socket.emit('my_room_event', {room: '3', data: ('En forskare finns här ')});
    });

    get_chat_data();

});

function emit_test(id) {
    let newid = id.replace('btnid_', '');
    socket.emit('my_room_event', {room: newid, data: $('#inputid_' + newid).val(), 'from_respondent': false});
}


socket.on('my_response', function (msg, cb) {
    $('#cid' + msg.room).append('<br>' + $('<div/>').text(msg.data).html());
    if (msg.from_respondent) {
        if ($("#" + msg.room).is(":visible")) {
            $('#buzzer').get(0).play();
        }
        $('#glyphid_' + msg.room).addClass('glyphicon glyphicon-bell')
    } else {
        $('#glyphid_' + msg.room).removeClass('glyphicon glyphicon-bell')
    }
    $("#cid" + msg.room).animate({scrollTop: 200000}, "slow");


    if (cb)
        cb();
});

function claimChat(id) {
    let curusr = '{{ current_user.username }}'
    $.get('/_claimchat', {user: curusr, id: id}).done(function (response) {

    })
};

function unClaimChat(id) {
    $.get('/_unclaimchat', {id: id}).done(function (response) {
        //console.log('UNCLAIM',response)

        //$("#liid_" + id).append('<span class="label label-success">'+response+'</span>')
    })

}


function get_chat_data() {
    let si = '{{survey_id}}';
    let curusrid = '{{ current_user.id }}'
    $.get('/_chatlist', {survey_id: si}).done(function (response) {
        //console.log("RESPONSE", response)

        $.each(response, function (key, val) {
            $.each(val, function (key, val) {
                if (val.user_id) {
                    console.log("VALUSERID: ", val.user_id, 'CURRID: ', parseInt(curusrid));
                    $('#liid_' + val.participant_id).hide();
                } else {
                    $('#liid_' + val.participant_id).show();
                }


                if (!$('#liid_' + val.participant_id).length) {

                    let cbutton = jQuery('<a/>', {
                        id: 'chatbtnid_' + val.participant_id,
                        class: 'btn btn-default chatt-button',
                        type: 'button',
                    }).html(val.participant_id);
                    let li = jQuery('<li>', {
                        class: 'list-group-item',
                        id: 'liid_' + val.participant_id,
                    });

                    li.append(cbutton);
                    li.append('<span class="pull-right label label-default" style="font-size: 12px">' + val.user_suggestion) + '</span>'
                    $(".participants").prepend(li);
                    create_chat_window(val.participant_id);
                    $("#" + val.participant_id).hide();
                    if (!val.active) {
                        $('#chat-box-panel-id_' + val.participant_id).prepend(' <span class="glyphicon glyphicon-remove-sign pull-left" style="color: red">&nbsp;</span>')
                        $('#cid' + val.participant_id).append('<br>' + $('<div/>').text('CHAT ENDED').html());
                        console.log('not active', val.participant_id)
                    }

                } else {

                }

            })
        });
        return response;

    }).fail(function () {
        $('#chatlist').text("{{ ('Error: Could not contact server.') }}");
    });
}


setInterval(function () {
    get_chat_data()
}, 5000);


// Warning before leaving the page (back button, or outgoinglink)
window.onbeforeunload = function () {
    return "Are you sure you wan't to leave the page? Leaving will clear all chat history!";
};
