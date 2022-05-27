function processSuccess(response, callback, $form) {
    // console.log(response)
    if ($form.attr('id') && response.result === 'success') {
        yaCounter.reachGoal($form.attr('id'));
        gtag('event', $form.attr('id'));
    }
    if (callback) {
        callback({clearForm: response.result === 'success', unlockSubmitButton: true});
    }
    var delay = 1500;
    if (response.delay) {
        delay = response.delay;
    }
    if (response.text) {
        Popup.message(response.text);
    }
    if (response.errors) {
        $.each(response.errors, function (i, el) {
            if (i === '__all__') {
                ValidateForm.customFormErrorTip($form[0], el[0]);
            } else {
                ValidateForm.customErrorTip($form.find('[name=' + i + ']').get(0), el[0]);
            }
        });
    }
    if (response.redirect_to) {
        setTimeout(function () {
            if (response.redirect_to == 'self') {
                window.location.reload();
            } else {
                window.location.href = response.redirect_to;
            }
        }, delay);
    }
}

function processError(callback) {
    if (callback){
        callback({clearForm: false, unlockSubmitButton: true});
    }
    Popup.message('Возникла ошибка. Попробуйте позже.');
}

function num_word(value, words) {
    value = Math.abs(value) % 100;
    var num = value % 10;
    if (value > 10 && value < 20) return words[2];
    if (num > 1 && num < 5) return words[1];
    if (num == 1) return words[0];
    return words[2];
}

function changeTheme(theme) {
    if (theme === 'dark') {
        $('.js-theme-link').last().click()
    } else {
        $('.js-theme-link').first().click()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // popup
    Popup.init('.js-open-popup');
   
    // form
    Form.init('.form');

    Form.onSubmit = function (form, callback) {

        // var files = CustomFile.files(form);
        var dt = new FormData(form);
        // $.each(files, function (i, el) {
        //     dt.append('avatar', el, el.filename)
        // })
        var _popup_id = $(form).parents('.popup__window').attr('id');
        $.ajax({
            url: form.action,
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: dt,
            success: function (response) {
                processSuccess(response, callback, $(form));
                if (response.errors) {
                    // open last popup
                    if (_popup_id) {
                        Popup.open('#' + _popup_id);
                    }
                }

            },
            error: function () {
                processError(callback);
            }
        });

        // <- ajax response

        return false;
    };

    $('input[data-type="tel"]').each(function () {
        new Maskinput(this, 'tel');
    });
});


$(function() {
    $('.js-slick').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        fade: true,
        adaptiveHeight: true
    })

    var cursor = document.querySelector('.cursor')
    var allLinks = document.querySelectorAll('a')
    var ticketsCounter = 0
    var theme = localStorage.getItem('theme') || 'light'  

    $('body')
        .on('click', '#canvas-sm', function() {
            window.location.href = "/index.html";
        })
        .on('click', '.js-collapse-header', function(event) {
            event.preventDefault()
            var _this = $(this)
            var _thisBody = _this.next('.js-collapse-body')
            var _allHeaderLink = $('.js-collapse-header')
            var _allBody = $('.js-collapse-body')

            if (_this.hasClass('opened')) {
                _this.removeClass('opened')
                _thisBody.slideUp(200)
            } else {
            _allHeaderLink.each(function(idx,elem){$(elem).removeClass('opened')})
            _allBody.each(function(idx,elem){$(elem).slideUp(200)})

            _this.addClass('opened')
            _thisBody.slideDown(200)
            }
        })
        .on('click', '.js-theme-link', function(event) {
            event.preventDefault();
            var _this = $(this)
            var _data = _this.data('theme')
            if (_this.hasClass('active')) {
                return
            } else {
                _this.siblings('.js-theme-link').removeClass('active')
                _this.addClass('active')
            }


            if (_data === 'dark') {
                $('body').css({'filter':'invert(1)'})
                localStorage.setItem('theme', 'dark')
                try {
                    $('.js-theme-link:nth-of-type(1)').css({'background-color':'#000'})
                    $('.js-theme-link:nth-of-type(2)').css({'background-color':'#fff'})
                    $('.js-theme-link:nth-of-type').css({'border-color':'#000'})
                } catch (error) {}
            } else {
                $('body').css({'filter':'none'})
                localStorage.setItem('theme', 'light')
                try {
                    $('.js-theme-link:nth-of-type(1)').css({'background-color':'#fff'})
                    $('.js-theme-link:nth-of-type(2)').css({'background-color':'#000'})
                    $('.js-theme-link:nth-of-type').css({'border-color':''})
                } catch (error) {}
            }
        })
        .on('mousemove', function (event){
            cursor.style.top = event.pageY + 'px'
            cursor.style.left = event.pageX + 'px'
        })
        .on('mouseover', 'a, input, label, textarea, button', function() {
            allLinks.forEach(function (elem, idx) {
                cursor.classList.add('hover')
            })
        })
        .on('mouseleave', 'a, input, label, textarea, button', function() {
            cursor.classList.remove('hover')
        })
        .on('mouseover', '.dropdown__menu', function() {
            cursor.classList.add('hover')
        })
        .on('mouseleave', '.dropdown__menu', function() {
            cursor.classList.remove('hover')
        })
        .on('click', '.pagination__wrap', function(event) {
            event.preventDefault()
            var _this = $(event.target)
            var _allLink = $('.pagination__link')
            if (_this.hasClass('pagination__link')) {
                _allLink.each(function (idx, elem) {
                    if ($(elem).hasClass('current')) {
                        return
                    } else {
                        _allLink.removeClass('current')
                        _this.addClass('current')
                    }
                })
            } 
            if (_this.hasClass('prev')) {
                _allLink.each(function (idx, elem) {
                    if ($(elem).hasClass('current')) {
                        if (idx === 0) {
                            return
                        } else {
                            $(elem).removeClass('current')
                            $(elem).prev().addClass('current')
                        }
                    }
                    return
                })
            }
            if (_this.hasClass('next')) {
                _allLink.each(function (idx, elem) {
                    if ($(elem).hasClass('current')) {
                        if (idx === _allLink.length - 1) {
                            return
                        } else {
                            $(elem).removeClass('current')
                            $(elem).next().addClass('current')
                            return false
                        }
                    }
                })
            }
        })
        .on('click', '.js-slick-btn', function(event) {
            event.preventDefault()
            var _this = $(this)
            _this.hasClass('next') ? $('.js-slick').slick('slickNext') : $('.js-slick').slick('slickPrev')

        })
        .on('click', '.js-clear-input', function(event) {
            event.preventDefault()
            var _this = $(this)
            var _project = _this.parents('.js-questionnaire-new')
            var _inputs = _project.find('input')
            var _textarea = _project.find('textarea')
            
            _inputs.each(function(idx, elem) {
                elem.value =''
            })

            _textarea.each(function(idx, elem) {
                elem.value =''
            })
        })
        .on('click', '.js-counter-link', function(event) {
            event.preventDefault()
            var _this = $(this)
            var _data = _this.data('counter')
            var _counter = _this.siblings('.js-counter')
            _data === 'plus' 
                ? ticketsCounter++ 
                : ticketsCounter !== 0
                    ? ticketsCounter--      
                    : false    
            _counter.html(`${ticketsCounter}` + num_word(ticketsCounter, [' билет', ' билета', ' билетов']))    
        })
        .on('focus', '#nomination', function() {
            var _this = $(this)
            var _list = _this.parents('.dropdown__link').siblings('.dropdown__list')
            var _label = _this.siblings('.icon')
            _label.addClass('opened')
            _list.css({'display':'flex', 'flex-direction':'column'})
        })
        .on('blur', '#nomination', function() {
            var _this = $(this)
            var _list = _this.parents('.dropdown__link').siblings('.dropdown__list')
            var _label = _this.siblings('.icon')
            _label.removeClass('opened')
            _list.css({'display':''})        
        })
        .on('input', '#requisites', function(event) {
            var _this = $(this)
            var _parentBlock = _this.parents('.form__field ')
            var _label = _this.siblings('label')
            var _textElem = _this.siblings('.form__text-span ')
            var _nameFile = _this[0].files[0].name
            
            _parentBlock.removeClass('field-error')
            _textElem.text(_nameFile)
            _label.text('Файл прикреплен')
            _label.css({'background-color':'#000', 'color':'#fff'})

        })
        .on('input', '.js-textarea', function(event) {
            var _this = $(this)
            var _textareaVal = _this.val()
            var _letterLenght = _textareaVal.length
            var _letterCounter = _this.siblings('.form__counter').find('.js-letter-counter')
            _letterCounter.text(_letterLenght)
        })   
        .on('mouseenter', '.dropdown__menu', function() {
            var _this = $(this)
            _this.addClass('opened')
        })
        .on('mouseleave', '.dropdown__menu', function() {
            var _this = $(this)
            _this.removeClass('opened')
        })       
        .on('click', '.js-dropdown-option', function(event) {
            var _this = $(this)
            var _dataValue = _this.data('value')
            var _dropdownMenu = _this.parents('.dropdown__menu')
            var _input = _dropdownMenu.find('.js-dropdown-input')
            _input.val(_dataValue)
            _input.blur()
            _dropdownMenu.removeClass('opened')
        })

    // ===== STARTPAGE
    if ($('.introduce').length) {
        $('.dropdown__list').removeClass('to-top')

        if ($('.js-state-bg').length) {
            var today = 1616198400 + 86400*3,
            startDate = 1616198400,
            finishDay = 1624665600,
            allDay = ((finishDay - startDate)/86400),
            currentDay = ((today - startDate)/86400),
            step = Math.round(currentDay*100/allDay);
            step < 100 ? step = step : step = 100
            $('.js-state-bg').css({'width': step + '%'})
        } 

        // if
        
    }
    // ===== /STARTPAGE

    // AUTHORIZATION
    if ($('.authorization').length) {
        var hash = location.hash
        var _title = $('.section__info-paragraph')
        $('body').on('click', '.js-form-link', function(event) {
            var _this = $(this)
            var _data = _this.data('form')
            var _form = _this.parents('.form')

            _form.removeClass('visible')
            _form.siblings('.form').addClass('visible')

            _data === 'login' ? _title.text('Вход') : _title.text('Регистрация')
        })

        if (hash === '' || hash === '#login') {
            $('.form-login').addClass('visible')
            _title.text('Вход')
        } else {
            $('.form-registration').addClass('visible')
            _title.text('Регистрация')
        } 
    }
    // /AUTHORIZATION

    // ADD NEW PROJECT
    $('body').on('click', '.js-add-project', function() {
        var _projectNum = ($('.js-questionnaire-new').length)
        var _lastProject = $('.js-questionnaire-new').last()
        var _num = _lastProject.find('.questionnaire__item-num')
        var _title = _lastProject.find('.questionnaire__item-paragraph span')
        var _newProject = `
        <div class="questionnaire__item js-questionnaire-new">
            <div class="questionnaire__header">
                <span class="questionnaire__item-num">
                    ${_projectNum}
                </span>
                <p class="questionnaire__item-paragraph">
                    Работа №${_projectNum}
                </p>
                <a href="#" class="questionnaire__item-link">
                    Очистить
                </a>
            </div>
            <div class="questionnaire__body">
                <div class="form__field">
                    <span class="form__text-span">
                        Номинация
                    </span>
                    <div class="dropdown__menu">
                        <div class="dropdown__link">
                            <input id="nomination" type="text" data-type="txt" data-required="true"
                                name="nomination" class="form__text-input" placeholder="Выберите категорию"
                                autocomplete="off">
                            <div class="field-error-tip">
                            <img src="./img/icons/attention.svg" alt=""></div>
                            
                            <label for="nomination" class="icon">
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M26.5093 13.7681L17.9912 22.25L9.50932 13.732" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </label>
                        </div>
                        <ul class="dropdown__list">
                            <li class="option" data-value="">Спортивный видеоролик</li>
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                            <li class="option" data-value="">Спортивный видеоролик</li>                                
                        </ul>
                    </div>
                </div>
                <div class="form__field">
                    <span class="form__text-span">
                        Название работы
                    </span>
                    <input id="project-name" type="text" data-type="txt" data-required="true"
                        name="project-name" class="form__text-input" placeholder="Введите название"
                        autocomplete="off">
                    <div class="field-error-tip"><img src="./img/icons/attention.svg" alt=""></div>
                </div>
                <div class="form__field">
                    <span class="form__text-span">
                        Ссылка на работу
                    </span>
                    <input id="url" type="text" data-type="url" data-required="true" name="url"
                        class="form__text-input" placeholder="Укажите ссылку" autocomplete="off">
                    <div class="field-error-tip"><img src="./img/icons/attention.svg" alt=""></div>
                </div>
                <p class="form__description">
                    Ссылки принимаются на Google drive, Яндекс Диск, Vimeo, Youtube
                </p>
                <div class="form__field">
                    <span class="form__text-span">
                        Участники
                    </span>
                    <div class="wrap">
                        <textarea id="team" type="text" data-type="txt" data-required="true" name="team"
                            class="form__textarea" placeholder="Опишите команду"
                            autocomplete="off"></textarea>
                        <div class="field-error-tip"><img src="./img/icons/attention.svg" alt=""></div>
                        <div class="form__counter">
                            0/500 символов
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    
        _lastProject.before(_newProject)
        _num.text(_projectNum + 1) 
        _title.text(_projectNum + 1)

    })
    // /ADD NEW PROJECT

    function closeMenu(elem) {
        elem.removeClass('open')
    }

    function openMenu(elem) {
        elem.addClass('open')
    }

    $('body').on('click', '.header__burger', function () {
        var _this = $(this)
        var _mobMenu = $('.aside')

        if (_this.hasClass('open')) {
            closeMenu(_this)
            closeMenu(_mobMenu)
            $('body').removeClass('mob-nav-is-opened')
        } else {
            openMenu(_this)
            openMenu(_mobMenu)
            $('body').addClass('mob-nav-is-opened')
        }
    })

    $(window).on('resize', function () {
        if (window.innerWidth > 800) {
            var _burger = $('.header__burger')
            var _mobMenu = $('.header__right')
            if (_burger.hasClass('open')) {
                closeMenu(_mobMenu)
                closeMenu(_burger)
                $('body').removeClass('mob-nav-is-opened')
            }
        }
    })

    changeTheme(theme)
    setTimeout(function() {
        $('body').addClass('visible')
    }, 200)
})



