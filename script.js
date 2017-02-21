// (function(){
  function getLinks (v) {
    return (v.link || []).map(function (v) {
      return '<a href="' + v + '">' + (v || '') + '</a>'
    }).join('<br>')
  }
  
  function getID (v) {
    return (v.title || '').toLowerCase().replace(/\.|\s/g,'')
  }
  
  function getPara (v) {
    return '<p>' + v + '</p>'
  }
  
  var parseArticles = function (articles) {
    $.each(articles,function(key, v){
      var b= key === 'projects'
      
      $('body > main article').append('\
        <section id="' + getID(v) + '"><h2>' + v.title + '</h2>' +
          (v.img ?
            '<figure>\
              <img src="' + v.img + '" />\
              <figcaption>' + (v.caption || '') + '</figcaption>\
            </figure>'
          : '') +
          (v.text || []).map(getPara).join('') +
        '</section>\
      ')
      
      $('body > main > aside > nav > ul').append(v.title ?
        '<li><a href="#' + getID(v) + '">' + v.title + '</a><ul></ul></li>' : '')
      
      $.each(v.sections, function (i,v) {
        if (b) {
          $('.slides').append('\
            <div style="background-position:' + v.pos + ';background-image:url(\'' + v.img + '\');"\
                class="slide' + (i === 0 ? ' active' : '') + '">\
              <header>\
                <a href="#' + getID(v) + '"><h4>' + (v.title || '') + '</h4></a>\
                <p>' + getLinks(v) + '</p>\
              </header>\
            </div>\
          ')
          $('.slider-dots').append('<li class="dot' + (i === 0 ? ' active' : '') + '"><div></div></li>')
        }
        
        $('body > main article > section').last().append('\
          <section ' + (testing && i === 0 ? 'class="nfld" ' : '') + 'id="' + getID(v) + '"><h3>' + v.title + '</h3>' +
            (v.img ?
              '<figure>\
                <img src="' + v.img + '" />\
                <figcaption>' + (v.caption || '') + '</figcaption>\
              </figure>'
            : '') +
            (v.text || []).map(getPara).join('') +
          '</section>\
        ')
        
        $('body > main > aside > nav > ul > li').last().find('ul').append(v.title ? '<li><a href="#' + getID(v) + '">' + v.title + '</a></li>' : '')
      })
      
    })
  }
  
  var testing = location.hostname === '' || !!location.hostname.match('localhost')

  console.oldlog = console.log
  console.log = function () {
    if (testing) {
      console.oldlog.apply(null, Array.prototype.slice.call(arguments))
    }
    return undefined
  }

  var switchSlide = function(ns, nd) {
    $('.slide, .dot').removeClass('active')
    ns.add(nd).addClass('active')
    $('.slides').css('left', $('.slider').outerWidth() * ns.index() * -1)
  }

  var nextSlide = function(){
    var ns = $('.slide.active').next('.slide'),
        nd = $('.dot.active').next('.dot')
    
    if (ns.length === 0) {
      ns = $('.slide').first()
      nd = $('.dot').first()
    }
    
    switchSlide(ns, nd)
  }

  var prevSlide = function(){
    var ns = $('.slide.active').prev('.slide'),
        nd = $('.dot.active').prev('.dot')
    
    if (ns.length === 0) {
      ns = $('.slide').last()
      nd = $('.dot').last()
    }
    
    switchSlide(ns, nd)
  }
  
  var interval
  
  function  pif() {clearInterval(interval)}
  function upif() {interval = setInterval(nextSlide,4500)}
  
  if (!testing) {
    upif()
  }
  
  jQuery.fn.extend({
    ripple: function (n) {
      $(this).addClass('C-r').on(n || 'mousedown', function (e) {
        var b = $(this),
            t = $('<div class="C-re"></div>'),
            o = b.offset(),
            x = e.pageX - o.left,
            y = e.pageY - o.top,
            d = b.outerHeight(),
            r = d / 2
        
        t.css({
          height: d     + 'px',
          width : d     + 'px',
          top   : y - r + 'px',
          left  : x - r + 'px'
        })
        
        b.append(t)
        
        window.setTimeout(function () {
          var parentNode = t[0].parentNode
          if (parentNode) {
            parentNode.removeChild(t[0])
          }
        }, 2000)
      })
    }
  })
    
  $(window).resize(function () {
    $('.slide ').css('width', $('.slider').width() );
    $('.slides').css('left' , $('.slider').width() * $('.slide.active').index()  * -1)
    $('.slider-dots')
                .css('left' ,($('.slider').width() - $('.slider-dots ').width()) /  2)
  })

  $(window).on('load',function () {
    $('body').removeClass('loading');
    
    parseArticles(articles)
    
    $('.slides').css('width', (articles['projects'].sections.length) + '01%')

    $('.slide-next').click(nextSlide)
    $('.slide-prev').click(prevSlide)
    
    $('.dot').click(function(){
      var i  = $(this).index() + 1,
          ns = $('.slide').eq(i),
          nd = $('.dot').eq(i)
      switchSlide(ns, nd)
    })
    
    if (!testing) {
      $('.slider').hover(pif, upif)
    }
    
    // Other things
    $('.slider h4, nav a').click(function () {
      $('body > main article section section').removeClass('flod nfld')
    })
    
    $('body > main article section section h3').click(function () {
      var t = $(this).parent(),
          b = (t.is(':target') && !t.is('.fold')) || t.is('.nfld')
      
      t.removeClass('fold nfld').addClass(b ? 'fold' : 'nfld')
    })
    
    $('body > header > i, .slide-next, .slide-prev, body > main article section section h3').ripple()
    
    setTimeout(function () {$(window).resize()}, 100)
  })
// })()
