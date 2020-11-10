/* Insert in  Qualtrics.SurveyEngine.addOnUnload wherever you want to signal that a respondent has finished  */

let endpoint = 'https://yourdomain.com/_endchat';
let id ='${e://Field/ResponseID}';

jQuery.get(endpoint, {resp_id:id});