$(function () {
    var body = document.body
    var parentBlock = $('.js-logo-placemove')
    var rem = +((window.getComputedStyle(document.body).getPropertyValue('font-size')).slice(0, -2))
    var canvasHeight = parentBlock.height() - 4 * rem
    var canvasWidth = parentBlock.width() - 2 * rem
    var img = new Image()
    img.src = '/cinema/img/canvas.png';
    var canvas
    var ctx

    if ($('#canvas-lg').length) { 
        canvas = document.getElementById("canvas-lg")
        ctx = canvas.getContext("2d")   
       

        if (window.width > 800) {
            var bigSquare = {
                x1: 0,
                y1: 0,
                x2: 30,
                y2: 18,
                w: 30,
                h: 18
            }
        
            var smallSquare = {
                x1: 44,
                y1: 22,
                x2: 59,
                y2: 31
            }
        } else {
            var bigSquare = {
                x1: 1,
                y1: 1,
                x2: 21,
                y2: 11,
                w: 20,
                h: 10
            }
    
            var smallSquare = {
                x1: 15,
                y1: 20,
                x2: 25,
                y2: 25
            }   
        }
    }

    

    if( $('#canvas-sm').length) { 
        canvas = document.getElementById("canvas-sm")
        ctx = canvas.getContext("2d")  
        var bigSquare = {
            x1: 1,
            y1: 1,
            x2: 21,
            y2: 11,
            w: 20,
            h: 10
        }

        var smallSquare = {
            x1: 0,
            y1: 39,
            x2: 10,
            y2: 44
        }   
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight
    ctx.strokeStyle = '#11FF00'
    ctx.lineWidth = .1 * rem

    function _drawImage() {
        var x1 = ((bigSquare.x1*rem) + rem)
        var y1 = ((bigSquare.y1*rem) + rem)
        var x2 = ((bigSquare.w - 2)*rem)
        var y2 = ((bigSquare.h - 2)*rem)

        img.onload = function () {
            ctx.drawImage(img, x1, y1, x2, y2)        
        }

        ctx.drawImage(img, x1, y1, x2, y2)        
    }

    function drawBigSquare() {
        ctx.beginPath()
        ctx.moveTo(`${bigSquare.x1 * rem}`, `${bigSquare.y1 * rem}`)
        ctx.lineTo(`${bigSquare.x2 * rem}`, `${bigSquare.y1 * rem}`)
        ctx.lineTo(`${bigSquare.x2 * rem}`, `${bigSquare.y2 * rem}`)
        ctx.lineTo(`${bigSquare.x1 * rem}`, `${bigSquare.y2 * rem}`)
        ctx.lineTo(`${bigSquare.x1 * rem}`, `${bigSquare.y1 * rem}`)
        ctx.stroke()
        ctx.closePath()
    }

    function drawSmallSquare() {
        ctx.beginPath()
        ctx.moveTo(`${smallSquare.x1 * rem}`, `${smallSquare.y1 * rem}`)
        ctx.lineTo(`${smallSquare.x2 * rem}`, `${smallSquare.y1 * rem}`)
        ctx.lineTo(`${smallSquare.x2 * rem}`, `${smallSquare.y2 * rem}`)
        ctx.lineTo(`${smallSquare.x1 * rem}`, `${smallSquare.y2 * rem}`)
        ctx.lineTo(`${smallSquare.x1 * rem}`, `${smallSquare.y1 * rem}`)
        ctx.stroke()
        ctx.closePath()
    }

    function drawLine() {
        ctx.beginPath()
        ctx.moveTo(`${bigSquare.x1 * rem}`, `${bigSquare.y1 * rem}`)
        ctx.lineTo(`${smallSquare.x1 * rem}`, `${smallSquare.y1 * rem}`)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.moveTo(`${bigSquare.x2 * rem}`, `${bigSquare.y1 * rem}`)
        ctx.lineTo(`${smallSquare.x2 * rem}`, `${smallSquare.y1 * rem}`)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.moveTo(`${bigSquare.x2 * rem}`, `${bigSquare.y2 * rem}`)
        ctx.lineTo(`${smallSquare.x2 * rem}`, `${smallSquare.y2 * rem}`)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.moveTo(`${bigSquare.x1 * rem}`, `${bigSquare.y2 * rem}`)
        ctx.lineTo(`${smallSquare.x1 * rem}`, `${smallSquare.y2 * rem}`)
        ctx.stroke()
        ctx.closePath()
    }

    draw()

    function draw() {
        drawLine()
        drawBigSquare()
        drawSmallSquare()
        _drawImage()
        // requestAnimationFrame(draw)
    }

    function redraw(event) {
        var canvasParam = canvas.getBoundingClientRect()
        var minLeftX = ((event.clientX - canvasParam.left - (bigSquare.w / 2) * rem) / rem)
        var minRightX = (minLeftX + bigSquare.w)
        var maxRightX = (canvasParam.width / rem)
        var minTopY = (((event.clientY - canvasParam.top - (bigSquare.h / 2) * rem)) / rem)
        var minBottomY = (minTopY + bigSquare.h)
        var maxBottomY = (canvasParam.height / rem)

        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        if (event.clientX > canvasParam.left + (bigSquare.w / 2) * rem) {
            bigSquare.x1 = minLeftX
            bigSquare.x2 = minRightX
            if (event.clientX > canvasParam.right - (bigSquare.w / 2) * rem) {
                bigSquare.x2 = maxRightX
                bigSquare.x1 = bigSquare.x2 - bigSquare.w
            }
        } else {
            bigSquare.x1 = 0
        }

        if (event.clientY > canvasParam.top + (bigSquare.h / 2) * rem) {
            bigSquare.y1 = minTopY
            bigSquare.y2 = minBottomY
            if (event.clientY > canvasParam.bottom - (bigSquare.h / 2) * rem) {
                bigSquare.y2 = maxBottomY
                bigSquare.y1 = bigSquare.y2 - bigSquare.h
            }
        } else {
            bigSquare.y1 = 0
        }

    }


    body.addEventListener('mousemove', function (event) {
        redraw(event)
        draw()
    })

    $(window).on('resize', function(event) {
        canvas.remove()
        setTimeout(function() {
            rem = +((window.getComputedStyle(document.body).getPropertyValue('font-size')).slice(0, -2))
            canvasHeight = $('.js-logo-placemove').height() - 4 * rem
            canvasWidth = $('.js-logo-placemove').width() - 2 * rem
            canvas.width = canvasWidth
            canvas.height = canvasHeight    
            ctx.strokeStyle = '#11FF00'
            ctx.lineWidth = .1*rem    
            parentBlock.html(canvas)
            draw()
        }, 0)
    })


})