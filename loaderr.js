import $ from "jquery";
$('#foo').ready(function () {
    $('#loadingMessage').css('display', 'none');
    console.log("I just ran")
});
$('#foo').load(function () {
    $('#loadingMessage').css('display', 'none');
    console.log("I did too")
});