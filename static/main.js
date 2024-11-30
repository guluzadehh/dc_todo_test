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


    function updateItems(items) {
      const list = $(".content__list");

      list.empty();

      for (let item of items) {
        list.append(
          `<div class="content__item">
              <div class="content__item-left">
                  <h4 class="content__item-name">${item.name}</h4>
                  <p class="content__item-desc">${item.shortDesc}</p>
              </div>
              <div class="content__item-right">
                  <span class="content__item-status">${item.status ? "Выполнено" : "Не выполнено"}</span>
                  <span class="content__item-date">${new Date(item.date).toLocaleDateString("ru", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}</span>
              </div>
          </div>`
        );
      }
    }
});