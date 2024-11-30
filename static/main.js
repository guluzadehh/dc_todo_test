$(document).ready(function () {
    $( function() {
        $( "#dialog" ).dialog({
          autoOpen: false,
          show: {
            effect: "blind",
            duration: 1000
          },
          hide: {
            effect: "explode",
            duration: 1000
          }
        });
     
        // $( "#opener" ).on( "click", function() {
        //   $( "#dialog" ).dialog( "open" );
        // });
    });

    $( function() {
        var dateFormat = "mm/dd/yy",
          from = $( "#date-from" )
            .datepicker({
              changeMonth: true,
              numberOfMonths: 1
            })
            .on( "change", function() {
              to.datepicker( "option", "minDate", getDate( this ) );
            }),
          to = $( "#date-to" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
          })
          .on( "change", function() {
            from.datepicker( "option", "maxDate", getDate( this ) );
          });
     
        function getDate( element ) {
          var date;
          try {
            date = $.datepicker.parseDate( dateFormat, element.value );
          } catch( error ) {
            date = null;
          }
     
          return date;
        }
    });

    $(".content__today").text(new Date().toLocaleDateString("ru", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }));

});