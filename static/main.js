$(document).ready(function () {
    $( function() {
        $( "#dialog" ).dialog({
          autoOpen: false,
          show: {
            effect: "blind",
            duration: 1000
          },
          hide: {
            effect: "blind",
            duration: 1000,
          },
          close: function() {
            $(this).$(".dialog__name").empty();
            $(this).$(".dialog__desc").empty();
            $(this).$(".dialog__date").empty();
            $(this).$(".dialog__status").empty();
          }
        });
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

    $.ajax({
        type: "GET",
        url: "/api/todos",
        contentType: "application/json",
        dataType: "json",
        success: (res) => updateItems(res)
    });

    $(".header__search-btn").on("click", function() {
      const q = $("#todo-search").val();

      $.ajax({
        type: "GET",
        url: "/api/todos/find",
        data: {
          q: q
        },
        dataType: "json",
        success: (res) => updateItems(res)
      });
    })

    let items = {};

    $("#status-input").on("click", function() {
      let data = {
        from: new Date($("#date-from").val()).getTime(),
        to: new Date($("#date-to").val()).getTime(),
      }

      if (data.from == NaN || data.to == NaN) return;

      if (this.checked) {
        data.status = false
      }

      $.ajax({
        type: "GET",
        url: "/api/todos/date",
        data: data,
        dataType: "json",
        success: (res) => updateItems(res)
      });
    });

    $("#today-filter").on("click", function() {
      const now = new Date();

      const data = {
        from: now.getTime(),
        to: now.getTime(),
      };

      $.ajax({
        type: "GET",
        url: "/api/todos/date",
        data: data,
        dataType: "json",
        success: function (res) {
          updateItems(res);
          $("#date-from").datepicker("setDate", now);
          $("#date-to").datepicker("setDate", now);
          $("#status-input").prop("checked", false);
        }
      });
    });

    $("#week-filter").on("click", function() {
      let from = new Date();
      let to = new Date();
      to.setDate(to.getDate() + 7) 

      const data = {
        from: from.getTime(),
        to: to.getTime(),
      };

      $.ajax({
        type: "GET",
        url: "/api/todos/date",
        data: data,
        dataType: "json",
        success: function (res) {
          updateItems(res);
          $("#date-from").datepicker("setDate", from);
          $("#date-to").datepicker("setDate", to);
          $("#status-input").prop("checked", false);
        }
      });
    });

    $("#date-range-filter").on("click", function() {
      const data = {
        from: new Date($("#date-from").val()).getTime(),
        to: new Date($("#date-to").val()).getTime(),
      }

      if (data.from == NaN || data.to == NaN) return;

      $.ajax({
        type: "GET",
        url: "/api/todos/date",
        data: data,
        dataType: "json",
        success: (res) => updateItems(res)
      });
    });

    $("#date-sort").on("click", function() {
      updateItems(Object.values(items).sort((a, b) => new Date(a.date) < new Date(b.date)));
      $("#date-sort").addClass("hide");
      $("#name-sort").removeClass("hide");
    });

    $("#name-sort").on("click", function() {
      updateItems(Object.values(items).sort((a, b) => a.name > b.name));
      $("#name-sort").addClass("hide");
      $("#date-sort").removeClass("hide");
    });

    $(".content__list").on("click", ".content__item-name", function() {
      const itemId = $(this).data("item-id");
      const item = items[itemId];

      $("#dialog").dialog("open");
      $(".dialog__name").text(item.name);
      $(".dialog__desc").text(item.fullDesc);
      $(".dialog__date").text(new Date(item.date).toLocaleDateString("ru", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
      }));
      $(".dialog__status").text(item.status ? "Выполнено" : "Не выполнено");
    });

    function updateItems(newItems) {
      items = {}
      for (let item of newItems) {
        items[item.id] = item
      }
      renderItems(items);
    }

    function renderItems(items) {
      const list = $(".content__list");

      list.empty();

      for (let item of Object.values(items)) {
        list.append(
          `<div class="content__item">
              <div class="content__item-left">
                  <h4 class="content__item-name" data-item-id="${item.id}">${item.name}</h4>
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