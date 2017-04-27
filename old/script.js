// (function(){
  var createElement = function (tag, attr, content) {
    if (content !== undefined) {
      var elm = '<' + tag + '>' + content + '</' + tag + '>'
    } else {
      var elm = '<' + tag + '/>'
    }
    
    return $(elm, attr).get(0).outerHTML
  }
  
  var getLinks = function (links) {
    return links.map(function (link) {
      return createElement('a', {href: link}, link)
    }).join('<br>')
  }
  
  var getID = function (data) {
    return (data.title || '').replace(/\W/g,'').toLowerCase()
  }
  
  var getSection = function (data, level, attr) {
    return '\
      <section ' + (attr || '') + '>\
        <h' + level + '>' + data.title + '</h' + level + '>\
        ' + (data.img ?
          '<figure>\
            <img style="background-image:url(' + data.img + ')" />\
            <figcaption>' + (data.caption || '') + '</figcaption>\
          </figure>'
        : '') +
        (data.text || []).map(getParagraph).join('') + '\
      </section>\
    '
  }
  
  var getSubSection = function (data) {
    return getSection(data, 4)
  }
  
  var getParagraph = function (data) {
    if (Array.isArray(data)) {
      return getLinks(data)
    } else if (typeof data === 'object') {
      return getSubSection(data)
    } else if (typeof data === 'string') {
      return '<p>' + data + '</p>'
    } else {
      throw new TypeError('Invalid paragraph data type')
    }
  }
  
  var parseArticles = function (articles) {
    $.each(articles, function(_, group){
      $('body > main > article').append(getSection(group, 2))
      
      $('body > main > aside nav > ul').append(group.title ?
        '<li><a href="#' + getID(group) + '">' + group.title + '</a><ul></ul></li>' : '')
      
      $.each(group.sections, function (index, section) {
        if (group.slider) {
          $('.slides').append('\
            <div class="slide' + (index === 0 ? ' active' : '') + '" style="\
              background-position:' + section.pos + ';\
              background-image:url(\'' + section.img + '\');\
            ">\
              <header>\
                <a href="#' + getID(section) + '"><h4>' + section.title + '</h4></a>\
                ' + (section.link ? '<p>' + getLinks(section.link) + '</p>' : '') + '\
              </header>\
            </div>\
          ')
          $('.slider-dots').append('\
            <li class="dot' + (index === 0 ? ' active' : '') + '">\
              <div></div>\
            </li>\
          ')
        }
        
        $('body > main > article > section').last().append(getSection(section, 3,
          (testing && index === 0 ? 'class="nfld" ' : '') + 'id="' + getID(section) + '"'
        ))
        
        $('body > main > aside nav > ul > li').last().find('ul').append(
          '<li><a href="#' + getID(section) + '">' + section.title + '</a></li>'
        )
      })
      
    })
  }
  
  var testing = location.hostname === '' || !!location.hostname.match('localhost')

  console.oldlog = console.log
  console.log = function () {
    if (!testing) { return }
    console.oldlog.apply(null, Array.prototype.slice.call(arguments))
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
  
  var  pif = function () { clearInterval(interval) }
  var upif = function () { interval = setInterval(nextSlide, 4500) }
  
  if (!testing) {
    upif()
  }
  
  var rippleEffect = function (n) {
    $(this).addClass('C-r').on(n || 'mousedown', function (e) {
      var b = $(this),
          t = $('<div class="C-re"></div>'),
          
          d = b.outerHeight(),
          r = d / 2
          o = b.offset(),
          x = e.pageX - o.left - r,
          y = e.pageY - o.top - r,
      
      t.css({
        height: d,
        width : d,
        top   : y,
        left  : x
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
  
  $.fn.extend({ripple: rippleEffect})
  
  $(window).resize(function () {
    $('.slide ').css('width', $('.slider').width() );
    $('.slides').css('left' , $('.slider').width() * $('.slide.active').index()  * -1)
    $('.slider-dots')
                .css('left' ,($('.slider').width() - $('.slider-dots ').width()) /  2)
  })

  $(window).on('load',function () {
    
    $.getJSON('posts.json', function (articles) {
      // Setup
      $('body').removeClass('loading')
      
      parseArticles(articles)
      
      // Slider
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
      
  //     $(window).on('hashchange', function () {
  //       $(':target').removeClass('fold nfld').addClass('nfld')
  //     })
  //     
  //     $(window).trigger('hashchange')
      
      $('body > main article section section h3').click(function () {
        var t = $(this).parent(),
            b = (t.is(':target') && !t.is('.fold')) || t.is('.nfld')
        
        t.removeClass('fold nfld').addClass(b ? 'fold' : 'nfld')
      })
      
      $('body > header > i, .slide-next, .slide-prev, body > main article section section h3').ripple()
    })
    
    setTimeout(function () {$(window).resize()}, 100)
  })
  
// })()