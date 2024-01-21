var input, search, pr, result, result_arr, locale_HTML, result_store, datalist;

function func() {
  locale_HTML = document.body.innerHTML; // сохраняем в переменную весь body (Первоначальный)
  datalist = document.createElement("datalist");
  datalist.id = "suggestions";
  document.body.appendChild(datalist);
}

setTimeout(func, 1000); // ждем подгрузки Jsona и выполняем

function FindOnPage(name, status) {
  input = document.getElementById(name).value; // получаем значение из поля в HTML

  if (input.length < 3 && status == true) {
    alert("Для поиска вы должны ввести три или более символов");
    return;
  }

  if (input.length >= 3) {
    function FindOnPageGo() {
      search = new RegExp("\\b" + input + "\\b", "gi"); // делаем из строки регулярное выражение, учитывая слова целиком
      pr = locale_HTML; // используем сохраненный оригинальный HTML

      // Исключаем тег <link> из поиска
      pr = pr.replace(/<link[^>]*>/g, "");

      // Разбиваем HTML на открывающие и закрывающие теги
      var tags = pr.match(/<\/?[^>]+(>|$)/g) || [];
      var tagsMap = {};

      tags.forEach(function (tag, index) {
        var key = "{{" + index + "}}";
        tagsMap[key] = tag;
        pr = pr.replace(tag, key);
      });

      // Разбиваем текст на куски по тегам
      result = pr.split(/({{[0-9]+}})/);
      result_arr = []; // в этом массиве будем хранить результат работы (подсветку)
      var suggestions = new Set();

      var warning = true;
      for (var i = 0; i < result.length; i++) {
        if (result[i].match(search) !== null) {
          warning = false;
          suggestions.add(result[i]); // добавляем вариант в предложения
          break; // выходим из цикла, если найдено совпадение
        }
      }
      if (warning) {
        alert("Не найдено ни одного совпадения");
      }

      for (var i = 0; i < result.length; i++) {
        // Проверяем, является ли текст тегом
        var isTag = result[i].match(/{{[0-9]+}}/);
        if (isTag) {
          result_arr[i] = tagsMap[result[i]] || result[i];
        } else {
          // Обновленный блок кода для подсветки только отдельных слов
          result_arr[i] = result[i].replace(
            search,
            '<span style="background-color:rgb(6, 148, 6);">$&</span>'
          );
        }
      }

      pr = result_arr.join("");
      document.body.innerHTML = pr; // заменяем HTML код

      suggestions.forEach(function (suggestion) {
        var option = document.createElement("option");
        option.value = suggestion;
        datalist.appendChild(option);
      });

      // Получаем первый элемент, который содержит подсвеченный текст
      var firstHighlightedElement = document.querySelector(
        'span[style*="background-color:rgb(6, 148, 6);"]'
      );

      // Проверяем, что элемент был найден
      if (firstHighlightedElement) {
        // Прокручиваем страницу до найденного элемента
        firstHighlightedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Добавляем обработчик события для снятия подсветки по клику
        firstHighlightedElement.addEventListener("click", function () {
          this.style.backgroundColor = ""; // Снимаем подсветку при клике
        });
      }
    }

    function FindOnPageBack() {
      document.body.innerHTML = locale_HTML;
      datalist.innerHTML = ""; // очищаем предложения при сбросе поиска
    }

    if (status) {
      FindOnPageBack();
      FindOnPageGo();
    } // чистим прошлое и выделяем найденное

    if (!status) {
      FindOnPageBack();
    } // снимаем выделение
  }
}
