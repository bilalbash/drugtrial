$(function() {
    $('.datetimepicker').datetimepicker({
        language: 'en',
        pick12HourFormat: true
    });

    var descriptiveContent  = "<textarea class='text optional' cols='40' id='q_ans' name='q_ans' rows='2'></textarea>",
        mainAnswerSheet     = ".container-fluid.execute-trial",
        trial_id            = "";

    var executeTrialRequest = function(URI){
        $.get(URI, function(data) {
            if (data.success){
              if (data.no_question){
                $(".container-fluid.start-trial").fadeToggle();
                $(mainAnswerSheet).removeClass("hidden").slideUp();
                alert("no questions for this trial");
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

                $(".q-text"     , mainAnswerSheet).text(data.q_text);
                $(".q-num"      , mainAnswerSheet).text("Question # " + data.q_num);
                $("div.hidden"  , mainAnswerSheet).data("number", data.q_num);
                $("div.hidden"  , mainAnswerSheet).data("type", data.q_type);
                minutes = data.trial_period;
                countdown('countdown').done(function(){
                    alert('times up');
                });

                if (data.q_type == "Descriptive"){
                    $(".fields", mainAnswerSheet).append(descriptiveContent)
                } else if (data.q_type == "Exact Answer") {
                    var exactAnswer = "";
                    $.each(data.q_ans, function(i, value) {
                        exactAnswer += '<input type="radio" name="q_ans" value="' + value[1] + '" />' + value[0] + '<br />';
                    });
                    $(".fields", mainAnswerSheet).append(exactAnswer)
                } else {
                    var multiAnswer = "";
                    $.each(data.q_ans, function(i, value) {
                        multiAnswer += '<input type="checkbox" name="q_ans[]" value="' + value[1] + '" />' + value[0] + '<br />';
                    });
                    $(".fields", mainAnswerSheet).append(multiAnswer)
                }
              }
            }
        });
    }


    $(".start-execution").on("click", function(){
        var $this       = $(this);
            trial_id    = $this.data("id");
        var URI         = '/trials/start_trial?trial_id=' + trial_id;

        $("div.hidden", mainAnswerSheet).data("id", trial_id);
        $(".container-fluid.start-trial").fadeToggle();
        $(mainAnswerSheet).removeClass("hidden").hide().slideToggle();
        executeTrialRequest(URI);
    });

    $(".btn.btn-mini.steps").on("click", function(){
        if ($(".btn.btn-mini.steps.next").attr("disabled") != "disabled"){
            var URI  =  '/trials/start_trial?trial_id=' + trial_id;
                URI  += '&q_num=' + $("div.hidden", mainAnswerSheet).data("number");
                URI  += '&q_' + $(this).text() + '=' + "true";
            if ($("div.hidden", mainAnswerSheet).data("type") == "Multi Choice"){
                var valueAll = [];
                $('input[name*="q_ans"]:checked').each(function(i, value){valueAll.push($(value).val())});
                URI += '&q_ans=' + valueAll;
            } else {
                URI += '&q_ans=' + $("#q_ans", mainAnswerSheet).val();
            }
            $(".fields", mainAnswerSheet).html("");
            executeTrialRequest(URI);
        }
    });

    // timer count down clock

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