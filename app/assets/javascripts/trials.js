$(function() {
    $('.datetimepicker').datetimepicker({
        language: 'en',
        pick12HourFormat: true
    });

    var descriptiveContent  = "<textarea class='text optional' cols='40' id='q_ans' name='q_ans' rows='2'></textarea>",
        mainAnswerSheet     = ".container-fluid.execute-trial",
        trial_id            = "";

    var createAnswerSheet = function(question_type, question_answer, question_number){
        var questionClass = "question" + question_number;
        if ($(".fields."+questionClass, mainAnswerSheet).html() == undefined) {
            $(".q-inp", mainAnswerSheet).append('<div class="fields ' + questionClass + '"></div>');
            if (question_type == "Multi Choice"){
                var multiAnswer = "";
                $.each(question_answer, function(i, value) {
                    multiAnswer += '<input type="checkbox" name="q_ans[]" value="' + value[1] + '" />' + value[0] + '<br />';
                });
                $(".fields." + questionClass, mainAnswerSheet).append(multiAnswer);
            } else if (question_type == "Exact Answer") {
                var exactAnswer = "";
                $.each(question_answer, function(i, value) {
                    exactAnswer += '<input type="radio" name="q_ans" value="' + value[1] + '" />' + value[0] + '<br />';
                });
                $(".fields." + questionClass, mainAnswerSheet).append(exactAnswer)
            } else {
                $(".fields." + questionClass, mainAnswerSheet).append(descriptiveContent);
            }
        } else {
            $(".fields." + questionClass, mainAnswerSheet).show();
        }
    }

    var executeTrialRequest = function(URI){
        $.get(URI, function(data) {
            if (data.success){
                if (data.q_stop == true){
                    $(mainAnswerSheet).slideToggle();
                    $(".container-fluid.start-trial").slideToggle();
                    $(".fields", mainAnswerSheet).remove();
                } else {
                    if (data.q_last == true){
                        $(".btn.next").attr("disabled", "disabled");
                    } else {
                        $(".btn.next").removeAttr("disabled");
                    }
                    if (data.q_first == true){
                        $(".btn.prev").attr("disabled", "disabled");
                    } else {
                        $(".btn.prev").removeAttr("disabled");
                    }
                    $(".q-text"             , mainAnswerSheet).text(data.q_text);
                    $(".q-num"              , mainAnswerSheet).text("Question # " + data.q_num);
                    $("div.hidden.data-div" , mainAnswerSheet).data("number", data.q_num);
                    $("div.hidden.data-div" , mainAnswerSheet).data("type", data.q_type);
                    if (data.q_start == true){
                        minutes = data.trial_period;
                    }
                    $(".fields", mainAnswerSheet).hide();
                    createAnswerSheet(data.q_type, data.q_ans, data.q_num);
                }
            }
        });
    }

    $(mainAnswerSheet).hide();
    $(".start-execution").on("click", function(){
        var $this       = $(this);
            trial_id    = $this.data("id");
        var URI         = '/trials/start_trial?trial_id=' + trial_id;
        $("div.hidden.data-div", mainAnswerSheet).data("id", trial_id);
        $(".container-fluid.start-trial").slideToggle();
        $(mainAnswerSheet).slideToggle();
        executeTrialRequest(URI);
    });

    $(".btn.btn-mini.step").on("click", function(){
        var $this               = $(this),
            thisIsNotDisabled   = $this.attr("disabled") != "disabled",
            URI                 = '/trials/start_trial?trial_id=' + trial_id,
            hiddenDataDiv       = $("div.hidden.data-div", mainAnswerSheet),
            questionType        = hiddenDataDiv.data("type");

        if (thisIsNotDisabled){
            URI += '&q_num=' + hiddenDataDiv.data("number");
            URI += '&q_type=' + questionType;
            URI += '&q_' + $this.text() + '=' + "true&q_ans=";
            if (questionType == "Descriptive"){
                URI += $("#q_ans:visible", mainAnswerSheet).val();
            } else if (questionType == "Exact Answer") {
                URI += $("input[name*='q_ans']:checked:visible").val();
            } else {
                var valueAll = [];
                $('input[name*="q_ans"]:checked:visible').each(function(i, value){
                    valueAll.push($(value).val())
                });
                URI += valueAll;
            }
            if ($this.text() == "submit"){

            } else {

            }
            executeTrialRequest(URI);
        }
    });

    $(".container-fluid.result").hide();
    $(".btn.btn-success.show-results").on("click", function(){
        $(".container-fluid.list-results").slideToggle();
        $(".container-fluid.result.trial" + $(this).data("id")).slideToggle();
    });

    // timer: count down clock
    var interval,
        minutes = 0,
        seconds = 5;

    function countdown(element) {
        var dfd = $.Deferred();
        interval = setInterval(function () {
            var el = document.getElementById(element);
            if (seconds == 0) {
                if (minutes == 0) {
                    el.innerHTML = "Countdown over";
                    dfd.resolve();
                    clearInterval(interval);
                    return;
                } else {
                    minutes--;
                    seconds = 60;
                }
            }
            if (minutes > 0) {
                var minute_text = minutes + (minutes > 1 ? ' minutes' : ' minute');
            } else {
                var minute_text = '';
            }
            var second_text = seconds > 1 ? 'seconds' : 'second';
            el.innerHTML = minute_text + ' ' + seconds + ' ' + second_text + ' remaining';
            seconds--;
        }, 1000);
        return dfd.promise();
    }
});