$(document).ready(function() {

    console.log("Scriptjs is linked properly");

});

function onEditTask(theForm) {
    console.log("Testing: " + $(theForm.taskField).val());
    console.log("Testing2: " + $(theForm.submit).val());
    var buttonPressed = $(theForm.submit).val();

    console.log("Form submitted: " + buttonPressed);

    if (buttonPressed == "edit") {
        $(theForm.taskField).removeAttr('readonly');
        $(theForm.taskField).toggleClass('readonly active');
        $(theForm.submit).attr('value', 'save');
        $(theForm.submit).html('<big>SAVE</big>');

        return false;
    } else if (buttonPressed == "save") {
        return true;
    } else {
        return false;
    }
}

function onEditProject(theForm) {
    console.log("Testing: " + $(theForm.projectField).val());
    console.log("Testing2: " + $(theForm.submit).val());
    var buttonPressed = $(theForm.submit).val();

    console.log("Form submitted: " + buttonPressed);

    if (buttonPressed == "edit") {

        $(theForm.projectField).removeAttr('readonly');
        $(theForm.projectField).focus();
        $(theForm.projectField).toggleClass('readonly active');
        $(theForm.submit).attr('value', 'save');
        $(theForm.submit).html('<big>SAVE</big>');

        return false;
    } else if (buttonPressed == "save") {
        return true;
    } else {
        return false;
    }
}