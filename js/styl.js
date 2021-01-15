"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');  //отслеживаем события на форме и записываем их в переменную
    form.addEventListener('submit', formSend); //при отправки формы мы должны перейти в функцию formSend

    async function formSend(e) {//запрещаем стандартную отправку формы (при нажатии на кнопку ничего не будет происходить)
        e.preventDefault();
        //проверим валидацию формы
        let error = formValidate(form);

        let formData = new FormData(form);   //получаем данные формы все данные полей
        formData.append('image', formImage.files[0]); // добавляем к форме еще изображение

        if (error === 0) { // когда отсутствуют ошибки отправляем форму на почту
            form.classList.add('_sending');  // сообщаем что идет отправка формы (это займен некоторое время)
             let response = await fetch('sandmail.php', { 
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                formPreview.innerHTML = '';  // при отправке формы мы ее чистим
                form.reset(); // очищаем все поля формы
                form.classList.remove('_sending'); // делаем доступной форму опять удаляя класс
            } else {
                alert("Ошибка");
                form.classList.remove('_sending'); // делаем доступной форму опять удаляя класс если произошла ошика
            } 
        } else {
            alert('заполните обязательные поля');  // можно и попапы и мод окна но пока так
        }
    }
    function formValidate(form) {
        let error = 0;
        let formReg = document.querySelectorAll('._req');   //этот клас мы добовляем в те поля которые необходимо проверять

        for (let index = 0; index < formReg.length; index++){
            const input = formReg[index];  // пройдемся по всем переменным и получим их в переменную
            formRemoveError(input); // изначально удаляем клас ошибки
            //преступаем к проверки имейла
            if (input.classList.contains('_email')) {
                if (emailTest(input)) {  // если непрошло соответствие имейла то добавляем клас ерор
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute("type") === "checkbox" && input.checked === false) { //проверяем на тип кнопки включен чекбокс или нет
                formAddError(input);
                    error++;
            } else {
                if (input.value === "") {  //если импут не заполнен то тоже ошибка
                    formAddError(input);
                    error++;
                }
            }

        }
        return error;  //выводим сколько было ошибок
    }
    function formAddError(input) {
        input.parentElement.classList.add('_error');    //родительскому елементу добавляем  класс ошыбки
        input.classList.add('_error');   //добавляем елементу класс ошыбки
    }
    function formRemoveError(input) {
            input.parentElement.classList.remove('_error');
            input.classList.remove('_error');   //удаляем у елемента класс ошыбки
    }
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value); // проверяет на соответствие точек чтобы была сабачка и тп
    }
    // делаем превью(при загрузки картинки мы ее сможем просмотреть) получаем импут в переменную
    const formImage = document.getElementById('formImage');
    const formPreview = document.getElementById('formPreview');  //получаем див для добавки превью на странице
    //слушаем изменение в импуте файл
    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]); //когда срабат событие ми переходим в функцию uploadFile и передаем туда файл который выбран
    })
    function uploadFile(file) {
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('Разрешено только изображение');
            formImage.value = '';
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Файл должен быть менее 2 МБ.");
            return
        }
        //после проверок выводим изодражение
        var reader = new FileReader();
        reader.onload = function (e) { //если файл успешно загружен мы отправляем его на страницу
            formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`; 
        };
        reader.onerror = function (e) {
            alert('Ошибка');
        };
        reader.readAsDataURL(file);
    }
});