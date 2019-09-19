import axios from 'axios';
import $ from 'jquery';

$(document).ready(function() {
    $("section").hide();
    axios.get('/fitbit-data')
    .then(function(res) {
        $("#access").show();
        $("#access code").html(JSON.stringify(res.data));
    }).catch(function(error) {
        $("#no-access").show();
    });
});