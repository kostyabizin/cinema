var mobStateInfo = [
    {
        id: 1,
        maxDate: '30.04.2021',
        title: 'Подача работ',
        date: '01/04 – 30/04', 
        subtitle: 'Ранняя пташка' 
    },
    {
        id: 2,
        maxDate: '31.05.2021',
        title: 'Подача работ',
        date: '01/04 – 30/04', 
        subtitle: 'Основной этап' 
    },
    {
        id: 3,
        maxDate: '15.06.2021',
        title: 'Подача работ',
        date: ' 01/06 – 15/06', 
        subtitle: 'Финальный этап' 
    },
    {
        id: 4,
        maxDate: '01/07',
        title: 'Жюрение',
        date: '01/07', 
        subtitle: 'Шорт-листы' 
    },
    {
        id: 5,
        maxDate: '09/07',
        title: 'Жюрение',
        date: '09/07', 
        subtitle: 'Победители' 
    },
    {
        id: 6,
        maxDate: '09/07',
        title: 'Фестиваль',
        date: '09/07', 
        subtitle: 'Церемония' 
    }

]

var num = 0
var _title = $('.js-mobstate-title')
var _date = $('.js-mobstate-date')
var _subtitle = $('.js-mobstate-subtitle')
$('body').on('click', '.introduce__mobstate-btn', function(event) {
    event.preventDefault();
    var _this = $(this)
    var _sideToSlide = _this.data('arrow')
    if (_sideToSlide === 'next') {
        if (num === $(mobStateInfo).length - 1) {
            return
        } else {
            num++
        }
    } 

    if (_sideToSlide === 'prev') {
        if (num <= 0) {
            return
        } else {
            num--
        }
    } 

    _title.text(mobStateInfo[num].title)
    _date.text(mobStateInfo[num].date)
    _subtitle.text(mobStateInfo[num].subtitle)
})
