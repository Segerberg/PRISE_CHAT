/*  Paste into
Qualtrics.SurveyEngine.addOnload(function()
{ }
 */

let chatserver = '';  // https://<yourserver>/respondentchat/
let survey_id = '${e://Field/SurveyID}';
let resp_id = '${e://Field/ResponseID}';

let iframe = jQuery('<iframe/>', {
    src: chatserver + survey_id + '-' + resp_id,
    height: '410px',
    width: '335px',
    frameBorder: '0',
    id: 'iframe_main',
    allowtransparency: "true"


});
let div = jQuery('<div/>', {
    id: 'idiv',

})

div.append(iframe);
div.appendTo('#Footer');
