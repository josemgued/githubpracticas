if (typeof jQuery === "undefined") {
    throw new Error("jQuery plugins need to be before this file");
}

$.AdminBSB = {};
$.AdminBSB.options = {
    colors: {
        red: '#F44336',
        pink: '#E91E63',
        purple: '#9C27B0',
        deepPurple: '#673AB7',
        indigo: '#3F51B5',
        blue: '#2196F3',
        lightBlue: '#03A9F4',
        cyan: '#00BCD4',
        teal: '#009688',
        green: '#4CAF50',
        lightGreen: '#8BC34A',
        lime: '#CDDC39',
        yellow: '#ffe821',
        amber: '#FFC107',
        orange: '#FF9800',
        deepOrange: '#FF5722',
        brown: '#795548',
        grey: '#9E9E9E',
        blueGrey: '#607D8B',
        black: '#000000',
        white: '#ffffff'
    },
    leftSideBar: {
        scrollColor: 'rgba(0,0,0,0.5)',
        scrollWidth: '4px',
        scrollAlwaysVisible: false,
        scrollBorderRadius: '0',
        scrollRailBorderRadius: '0',
        scrollActiveItemWhenPageLoad: true,
        breakpointWidth: 1170
    },
    dropdownMenu: {
        effectIn: 'fadeIn',
        effectOut: 'fadeOut'
    }
}

/* Left Sidebar - Function =================================================================================================
*  You can manage the left sidebar menu options
*  
*/
$.AdminBSB.leftSideBar = {
    activate: function () {
        var _this = this;
        var $body = $('body');
        var $overlay = $('.overlay');

        //Close sidebar
        $(window).click(function (e) {
            var $target = $(e.target);
            if (e.target.nodeName.toLowerCase() === 'i') { $target = $(e.target).parent(); }

            if (!$target.hasClass('bars') && _this.isOpen() && $target.parents('#leftsidebar').length === 0) {
                if (!$target.hasClass('js-right-sidebar')) $overlay.fadeOut();
                $body.removeClass('overlay-open');                
            }
        });
        /*
        var $openCloseBar = $('.navbar .navbar-header .bars');
        $openCloseBar.dblclick(function (e) {
            if ($body.hasClass("ls-closed")){
                $body.removeClass("ls-closed");
                $openCloseBar.fadeOut();
            } else {
                $body.addClass("ls-closed");
                $openCloseBar.fadeIn();
            }
        });
        */
        
        $.each($('.menu-toggle.toggled'), function (i, val) {
            $(val).next().slideToggle(0);
        });

        //When page load
        $.each($('.menu .list li.active'), function (i, val) {
            var $activeAnchors = $(val).find('a:eq(0)');

            $activeAnchors.addClass('toggled');
            $activeAnchors.next().show();
        });

        //Collapse or Expand Menu
        $('.menu-toggle').on('click', function (e) {
            var $this = $(this);
            var $content = $this.next();

            if ($($this.parents('ul')[0]).hasClass('list')) {
                var $not = $(e.target).hasClass('menu-toggle') ? e.target : $(e.target).parents('.menu-toggle');

                $.each($('.menu-toggle.toggled').not($not).next(), function (i, val) {
                    if ($(val).is(':visible')) {
                        $(val).prev().toggleClass('toggled');
                        $(val).slideUp();
                    }
                });
            }

            $this.toggleClass('toggled');
            $content.slideToggle(320);
        });

        //Set menu height
        _this.setMenuHeight();
        _this.checkStatuForResize(true);
        $(window).resize(function () {
            _this.setMenuHeight();
            _this.checkStatuForResize(false);
        });

        //Set Waves
        Waves.attach('.menu .list a', ['waves-block']);
        Waves.init();
    },
    setMenuHeight: function (isFirstTime) {
        if (typeof $.fn.slimScroll != 'undefined') {
            var configs = $.AdminBSB.options.leftSideBar;
            var height = ($(window).height() - ($('.legal').outerHeight() + $('.user-info').outerHeight() + $('.navbar').innerHeight()));
            var $el = $('.list');

            $el.slimscroll({
                height: height + "px",
                color: configs.scrollColor,
                size: configs.scrollWidth,
                alwaysVisible: configs.scrollAlwaysVisible,
                borderRadius: configs.scrollBorderRadius,
                railBorderRadius: configs.scrollRailBorderRadius
            });

            //Scroll active menu item when page load, if option set = true
            if ($.AdminBSB.options.leftSideBar.scrollActiveItemWhenPageLoad) {
                /*
                if (!$('.menu .list li.active').length){
                    return;
                }*/
                var activeItemOffsetTop = $('.menu .list li.active')[0].offsetTop
                if (activeItemOffsetTop > 150) $el.slimscroll({ scrollTo: activeItemOffsetTop + 'px' });
            }
        }
    },
    checkStatuForResize: function (firstTime) {
        var $body = $('body');
        var $openCloseBar = $('.navbar .navbar-header .bars');
        var width = $body.width();

        if (firstTime) {
            $body.find('.content, .sidebar').addClass('no-animate').delay(1000).queue(function () {
                $(this).removeClass('no-animate').dequeue();
            });
        }
        $body.addClass('ls-closed');
        $openCloseBar.fadeIn();
        /*
        if (width < $.AdminBSB.options.leftSideBar.breakpointWidth) {
           $body.addClass('ls-closed');
            $openCloseBar.fadeIn();
        }
        else {
            $body.removeClass('ls-closed');
            $openCloseBar.fadeOut();
        }*/
    },
    isOpen: function () {
        return $('body').hasClass('overlay-open');
    }
};
//==========================================================================================================================

/* Right Sidebar - Function ================================================================================================
*  You can manage the right sidebar menu options
*  
*/
$.AdminBSB.rightSideBar = {
    activate: function () {
        var _this = this;
        var $sidebar = $('#rightsidebar');
        var $overlay = $('.overlay');

        //Close sidebar
        $(window).click(function (e) {
            var $target = $(e.target);
            if (e.target.nodeName.toLowerCase() === 'i') { $target = $(e.target).parent(); }

            if (!$target.hasClass('js-right-sidebar') && _this.isOpen() && $target.parents('#rightsidebar').length === 0) {
                if (!$target.hasClass('bars')) $overlay.fadeOut();
                $sidebar.removeClass('open');
            }
        });

        $('.js-right-sidebar').on('click', function () {
            $sidebar.toggleClass('open');
            if (_this.isOpen()) { $overlay.fadeIn(); } else { $overlay.fadeOut(); }
        });
    },
    isOpen: function () {
        return $('.right-sidebar').hasClass('open');
    }
}
//==========================================================================================================================

/* Searchbar - Function ================================================================================================
*  You can manage the search bar
*  
*/
var $searchBar = $('.search-bar');
$.AdminBSB.search = {
    activate: function () {
        var _this = this;

        //Search button click event
        $('.js-search').on('click', function () {
            _this.showSearchBar();
        });

        //Close search click event
        $searchBar.find('.close-search').on('click', function () {
            _this.hideSearchBar();
        });

        //ESC key on pressed
        $searchBar.find('input[type="text"]').on('keyup', function (e) {
            if (e.keyCode == 27) {
                _this.hideSearchBar();
            }
        });
    },
    showSearchBar: function () {
        $searchBar.addClass('open');
        $searchBar.find('input[type="text"]').focus();
    },
    hideSearchBar: function () {
        $searchBar.removeClass('open');
        $searchBar.find('input[type="text"]').val('');
    }
}
//==========================================================================================================================

/* Navbar - Function =======================================================================================================
*  You can manage the navbar
*  
*/
$.AdminBSB.navbar = {
    activate: function () {
        var $body = $('body');
        var $overlay = $('.overlay');

        //Open left sidebar panel
        $('.bars').on('click', function () {
            $body.toggleClass('overlay-open');
            if ($body.hasClass('overlay-open')) { $overlay.fadeIn(); } else { $overlay.fadeOut(); }
        });

        //Close collapse bar on click event
        $('.nav [data-close="true"]').on('click', function () {
            var isVisible = $('.navbar-toggle').is(':visible');
            var $navbarCollapse = $('.navbar-collapse');

            if (isVisible) {
                $navbarCollapse.slideUp(function () {
                    $navbarCollapse.removeClass('in').removeAttr('style');
                });
            }
        });
    }
}
//==========================================================================================================================

/* Input - Function ========================================================================================================
*  You can manage the inputs(also textareas) with name of class 'form-control'
*  
*/
$.AdminBSB.input = {
    activate: function () {
        //On focus event
        $('.form-control').focus(function () {
            $(this).parent().addClass('focused');
        });

        //On focusout event
        $('.form-control').focusout(function () {
            var $this = $(this);
            if ($this.parents('.form-group').hasClass('form-float')) {
                if ($this.val() == '') { $this.parents('.form-line').removeClass('focused'); }
            }
            else {
                $this.parents('.form-line').removeClass('focused');
            }
        });

        //On label click
        $('body').on('click', '.form-float .form-line .form-label', function () {
            $(this).parent().find('input').focus();
        });

        //Not blank form
        $('.form-control').each(function () {
            if ($(this).val() !== '') {
                $(this).parents('.form-line').addClass('focused');
            }
        });
    }
}
//==========================================================================================================================

/* Form - Select - Function ================================================================================================
*  You can manage the 'select' of form elements
*  
*/
$.AdminBSB.select = {
    activate: function () {
        if ($.fn.selectpicker) { $('select:not(.ms)').selectpicker(); }
    }
}
//==========================================================================================================================

/* DropdownMenu - Function =================================================================================================
*  You can manage the dropdown menu
*  
*/

$.AdminBSB.dropdownMenu = {
    activate: function () {
        var _this = this;

        $('.dropdown, .dropup, .btn-group').on({
            "show.bs.dropdown": function () {
                var dropdown = _this.dropdownEffect(this);
                _this.dropdownEffectStart(dropdown, dropdown.effectIn);
            },
            "shown.bs.dropdown": function () {
                var dropdown = _this.dropdownEffect(this);
                if (dropdown.effectIn && dropdown.effectOut) {
                    _this.dropdownEffectEnd(dropdown, function () { });
                }
            },
            "hide.bs.dropdown": function (e) {
                var dropdown = _this.dropdownEffect(this);
                if (dropdown.effectOut) {
                    e.preventDefault();
                    _this.dropdownEffectStart(dropdown, dropdown.effectOut);
                    _this.dropdownEffectEnd(dropdown, function () {
                        dropdown.dropdown.removeClass('open');
                    });
                }
            }
        });

        //Set Waves
        Waves.attach('.dropdown-menu li a', ['waves-block']);
        Waves.init();
    },
    dropdownEffect: function (target) {
        var effectIn = $.AdminBSB.options.dropdownMenu.effectIn, effectOut = $.AdminBSB.options.dropdownMenu.effectOut;
        var dropdown = $(target), dropdownMenu = $('.dropdown-menu', target);

        if (dropdown.length > 0) {
            var udEffectIn = dropdown.data('effect-in');
            var udEffectOut = dropdown.data('effect-out');
            if (udEffectIn !== undefined) { effectIn = udEffectIn; }
            if (udEffectOut !== undefined) { effectOut = udEffectOut; }
        }

        return {
            target: target,
            dropdown: dropdown,
            dropdownMenu: dropdownMenu,
            effectIn: effectIn,
            effectOut: effectOut
        };
    },
    dropdownEffectStart: function (data, effectToStart) {
        if (effectToStart) {
            data.dropdown.addClass('dropdown-animating');
            data.dropdownMenu.addClass('animated dropdown-animated');
            data.dropdownMenu.addClass(effectToStart);
        }
    },
    dropdownEffectEnd: function (data, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        data.dropdown.one(animationEnd, function () {
            data.dropdown.removeClass('dropdown-animating');
            data.dropdownMenu.removeClass('animated dropdown-animated');
            data.dropdownMenu.removeClass(data.effectIn);
            data.dropdownMenu.removeClass(data.effectOut);

            if (typeof callback == 'function') {
                callback();
            }
        });
    }
}
//==========================================================================================================================

/* Browser - Function ======================================================================================================
*  You can manage browser
*  
*/
var edge = 'Microsoft Edge';
var ie10 = 'Internet Explorer 10';
var ie11 = 'Internet Explorer 11';
var opera = 'Opera';
var firefox = 'Mozilla Firefox';
var chrome = 'Google Chrome';
var safari = 'Safari';

$.AdminBSB.browser = {
    activate: function () {
        var _this = this;
        var className = _this.getClassName();

        if (className !== '') $('html').addClass(_this.getClassName());
    },
    getBrowser: function () {
        var userAgent = navigator.userAgent.toLowerCase();

        if (/edge/i.test(userAgent)) {
            return edge;
        } else if (/rv:11/i.test(userAgent)) {
            return ie11;
        } else if (/msie 10/i.test(userAgent)) {
            return ie10;
        } else if (/opr/i.test(userAgent)) {
            return opera;
        } else if (/chrome/i.test(userAgent)) {
            return chrome;
        } else if (/firefox/i.test(userAgent)) {
            return firefox;
        } else if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
            return safari;
        }

        return undefined;
    },
    getClassName: function () {
        var browser = this.getBrowser();

        if (browser === edge) {
            return 'edge';
        } else if (browser === ie11) {
            return 'ie11';
        } else if (browser === ie10) {
            return 'ie10';
        } else if (browser === opera) {
            return 'opera';
        } else if (browser === chrome) {
            return 'chrome';
        } else if (browser === firefox) {
            return 'firefox';
        } else if (browser === safari) {
            return 'safari';
        } else {
            return '';
        }
    }
}
//==========================================================================================================================

$(function () {
    $.AdminBSB.browser.activate();
    $.AdminBSB.leftSideBar.activate();
    $.AdminBSB.rightSideBar.activate();
    $.AdminBSB.navbar.activate();
    $.AdminBSB.dropdownMenu.activate();
    $.AdminBSB.input.activate();
  //  $.AdminBSB.select.activate();
    $.AdminBSB.search.activate();

    setTimeout(function () { $('.page-loader-wrapper').fadeOut(); }, 50);
});


$(function () {
    skinChanger();
    activateNotificationAndTasksScroll();

    setSkinListHeightAndScroll(true);
    setSettingListHeightAndScroll(true);
    $(window).resize(function () {
        setSkinListHeightAndScroll(false);
        setSettingListHeightAndScroll(false);
    });
});

//Skin changer
function skinChanger() {
    $('.right-sidebar .demo-choose-skin li').on('click', function () {
        var $body = $('body');
        var $this = $(this);

        var existTheme = $('.right-sidebar .demo-choose-skin li.active').data('theme');
        $('.right-sidebar .demo-choose-skin li').removeClass('active');
        $body.removeClass('theme-' + existTheme);
        $this.addClass('active');

        $body.addClass('theme-' + $this.data('theme'));
    });
}

//Skin tab content set height and show scroll
function setSkinListHeightAndScroll(isFirstTime) {
    var height = $(window).height() - ($('.navbar').innerHeight() + $('.right-sidebar .nav-tabs').outerHeight());
    var $el = $('.demo-choose-skin');

    if (!isFirstTime){
      $el.slimScroll({ destroy: true }).height('auto');
      $el.parent().find('.slimScrollBar, .slimScrollRail').remove();
    }

    $el.slimscroll({
        height: height + 'px',
        color: 'rgba(0,0,0,0.5)',
        size: '6px',
        alwaysVisible: false,
        borderRadius: '0',
        railBorderRadius: '0'
    });
}

//Setting tab content set height and show scroll
function setSettingListHeightAndScroll(isFirstTime) {
    var height = $(window).height() - ($('.navbar').innerHeight() + $('.right-sidebar .nav-tabs').outerHeight());
    var $el = $('.right-sidebar .demo-settings');

    if (!isFirstTime){
      $el.slimScroll({ destroy: true }).height('auto');
      $el.parent().find('.slimScrollBar, .slimScrollRail').remove();
    }

    $el.slimscroll({
        height: height + 'px',
        color: 'rgba(0,0,0,0.5)',
        size: '6px',
        alwaysVisible: false,
        borderRadius: '0',
        railBorderRadius: '0'
    });
}

//Activate notification and task dropdown on top right menu
function activateNotificationAndTasksScroll() {
    $('.navbar-right .dropdown-menu .body .menu').slimscroll({
        height: '254px',
        color: 'rgba(0,0,0,0.5)',
        size: '4px',
        alwaysVisible: false,
        borderRadius: '0',
        railBorderRadius: '0'
    });
}

/*
//Google Analiytics ======================================================================================
addLoadEvent(loadTracking);
var trackingId = 'UA-30038099-6';

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

function loadTracking() {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', trackingId, 'auto');
    ga('send', 'pageview');
}
//========================================================================================================
*/

var Util = {
    TFloat : function (valor, digitos){
        return parseFloat(valor).toFixed(!digitos ? 2 : digitos);
    },
    alert: function($placer, opt){
        var html = '';

        if (!opt.tipo){
            opt.tipo = 'e';
        }

        switch(opt.tipo){
            case "s" : 
                strAlert  = "bg-green";
                break;
            case "w":
                strAlert = "alert-warning";
                break;
            case "e":
                strAlert = "bg-red";
                break;
        }

        html += '<div class="alert '+strAlert+' alert-dismissible" role="alert">';
        html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>';
        html += (opt.titulo ? '<strong>'+opt.titulo+'</strong>': '')+' '+(opt.mensaje ? opt.mensaje : '')+' </div>';
        $placer.html(html);     
        $placer.focus();
        setTimeout(function(){
            $placer.empty();
        }, opt.tiempo || 3000)
    },
    notificacion: function(colorName, text, placementFrom, placementAlign, animateEnter, animateExit, delay){
        if (colorName === null || colorName === '') { colorName = 'bg-black'; }
        if (text === null || text === '') { text = 'Turning standard Bootstrap alerts'; }
        if (animateEnter === null || animateEnter === '') { animateEnter = 'animated fadeInDown'; }
        if (animateExit === null || animateExit === '') { animateExit = 'animated fadeOutUp'; }
        if (delay === null || delay === '') { delay = 5000; }
        var allowDismiss = true;

        $.notify({
            message: text
        },
            {
                type: colorName,
                allow_dismiss: allowDismiss,
                newest_on_top: true,
                timer: 1000,
                delay: delay,
                placement: {
                    from: placementFrom,
                    align: placementAlign
                },
                animate: {
                    enter: animateEnter,
                    exit: animateExit
                },
                template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
            });
    },
    cerrarSesion: function(){
        if (!confirm("¿Desea cerrar sesión?")){
            return ;
        }

        var fn = function(xhr){
            var datos = xhr.datos;
            if (xhr.estado == 200){
                if (datos.rpt == true){
                    alert(datos.msj);
                    location.href = '../';
                }
            }
        };

        new Ajxur.Api({metodo: "cerrarSesionWeb", modelo:"Personal"}, fn);
    },
     soloNumeros: function (evento) {
        var tecla = (evento.which) ? evento.which : evento.keyCode;
        if ((tecla >= 48 && tecla <= 57)) {
            return true;
        }
        return false;
    },  
     soloNumerosDecimales: function (evento) {
        var tecla = (evento.which) ? evento.which : evento.keyCode;
        console.log(tecla);
        if (((tecla >= 48 && tecla <= 57) || tecla == 46)) {
            return true;
        }
        return false;
    }, 
    soloDecimal: function(evento, cadena,mostrar){
        var tecla = (evento.which) ? evento.which : evento.keyCode;
        var key = cadena.length;
        var posicion = cadena.indexOf('.');
        var contador = 0;
        var numero = cadena.split(".");
        var resultado1 = numero[0];
        var suma = resultado1.length+mostrar; 

        while (posicion != -1) { 
            contador++;             
            posicion = cadena.indexOf('.', posicion + 1);

        }

        if ( (tecla>=48 && tecla<=57) || (tecla==46) ) {    
            if ( key == 0 &&  tecla == 46 ) { // SOLO PERMITE ENTRE 0 AL 9
                return false;
            }
            
            if (contador != 0 && tecla == 46) { //NO SE REPITA EL PUNTO                
                return false;
            }

            if ( cadena == '0') { // EL SIGUIENTE ES PUNTO   
                if ( tecla>=48 && tecla<=57 ) {
                    return false;
                }
                return true;                
            }      
            
            if (!(key <= suma)) {
                return false;
            }
            return true;            
        }
        return false;
    },
    soloLetras: function (evento, espacio) {
        var tecla = (evento.which) ? evento.which : evento.keyCode;

        console.log(tecla);

        if ( espacio != null ) {
            if ((tecla >= 65 && tecla <= 90) || (tecla >= 97 && tecla <= 122) || (tecla==241) || (tecla==209) ) {
                return true;
            }    
        }else{
            if ((tecla >= 65 && tecla <= 90) || (tecla >= 97 && tecla <= 122) || (tecla==241) || (tecla==209) || (tecla>=32 && tecla <=40) || (tecla==8)  || (tecla==46)  ) {
                return true;
            } 
        }
        return false;
    },
    soloNumeros: function (evento) {
        var tecla = (evento.which) ? evento.which : evento.keyCode;
        if ((tecla >= 48 && tecla <= 57)) {
            return true;
        }
        return false;
    },
    confirm : function (fnAccion, titulo, texto, isHTML){
        swal({
            title: (titulo  || "¿Está seguro de completar esta acción?"),
            html : isHTML || false,
            text : texto || "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#4CAF50 ",
            confirmButtonText: "Sí",
            cancelButtonText: "No",
            closeOnConfirm: true
        }, fnAccion);
    },
    Templater : function(scriptDOM){
        var objTpl8 = {};
        $.each(scriptDOM, function(i,o){
            var id = o.id, idName = id.substr(5);
            if (id.length > 0){
                objTpl8[idName] = Handlebars.compile(o.innerHTML);
            }
        });
        return objTpl8;
    },
    XHR : function(objXHR, fn){
       new Ajxur.Api(objXHR, function(xhr){
            if (xhr.estado = 200){
                fn(xhr.datos);
            }
       });
    },
    getHTML : function ( url, callback ) {

        // Feature detection
        if ( !window.XMLHttpRequest ) return;

        // Create new request
        var xhr = new XMLHttpRequest();

        // Setup callback
        xhr.onload = function() {
            if ( callback && typeof( callback ) === 'function' ) {
                callback( this.responseXML );
            }
        }

        // Get the HTML
        xhr.open( 'GET', url );
        xhr.responseType = 'document';
        xhr.send();
    },
    llenarCombo: function(rotulo_inicial, combo, datos){
        var html = '<option value="" selected>'+rotulo_inicial+'</option>';
            $.each(datos, function (i, item) { 
                html += '<option value="' + item.id + '">'+ item.descripcion + '</option>';
            });

        combo.html(html);
    }
};



var Ajxur = {
   // var self = this;
   URL : "../../controlador/index-web.php" ,
   $Ld : $('.page-loader-wrapper'),
    Loader : {  
        numAPIs: 0,     
        c  : 0, // contador de peticiones activas.        
        timer : 2000,
        esMostrado :function(){
          return !(Ajxur.$Ld[0].style.display == "none")
        },
        quitar : function(){
          Ajxur.$Ld.fadeOut();           
        },
        mostrar : function(){
          Ajxur.$Ld.fadeIn();          
        }
    },
    Api : function (params, callbackFunction, callbackFunctionError){    
            var self = this, data_frm;
            this.tracer = false;
            this.loader = true;
            this.needParseJSON = 0; 
            this.url = Ajxur.URL;

            if (params.data_files){ 
               data_frm  = new FormData();
               data_frm.append("modelo",params.modelo);
               data_frm.append("metodo",params.metodo);
               if (params.formulario){
                 data_frm.append("formulario",params.formulario);
               }
               if (params.data_in){
                 data_frm.append("data_in",params.data_in);
               }
               if (params.data_out){
                 data_frm.append("data_out",params.data_out);
               }

               if (params.data_files && params.data_files != undefined){
                $.each(params.data_files, function(key,value){
                  if (value)
                    data_frm.append(key,value);   
                })
               }
               
               this.ajax = $.ajax({                
                url: self.url,
                cache: false,
                contentType: false,
                processData: false,
                data: data_frm,
                type: "get"
              });
            } else{
              this.ajax = $.ajax({
                url: self.url,
                data: params,
                type: "get"
              });
            }

            Ajxur.Loader.c++;
            this.id =  ++Ajxur.Loader.numAPIs;

            if(self.tracer) console.log("INICIO PETICIÓN. ID:",self.id); 
        
            if (typeof callbackFunction != "function"){
              if (callbackFunction == "deferred"){
                return this.ajax;
              }
            }

            this.ajax
            .done( function(r){
                self.successCallback(r);
            })
            .fail( function(e){
                self.failCallback(e);
            });
               
            setTimeout(function(){
              if(self.tracer) {
                console.log("PETICIONES ACTIVAS ", Ajxur.Loader.c);
                console.log("Verificador de DELAY: Estado de ID:",self.id); 
                }
                if (self.ajax.readyState != 4){
                  if(self.tracer) console.log("DATA aún no ha llegado.:");
                  if (self.loader) Ajxur.Loader.mostrar();
                  return;
                }
              if(self.tracer) console.log("DATA ya había llegado. ");
            },Ajxur.Loader.timer);
            
            this.back = function(){
                if (self.tracer) console.log("DATA llegó. ID: ", self.id);
                Ajxur.Loader.c--;
                if (self.tracer) console.log("PETICIONES ACTIVAS ", Ajxur.Loader.c);
                if (Ajxur.Loader.esMostrado()){
                    if (self.tracer) console.log("CARGANDO... Está en pantalla.");
                    if (Ajxur.Loader.c <= 0){
                        if (self.tracer) console.log("No hay peticiones.");
                        if (self.loader) Ajxur.Loader.quitar();
                        return;
                    }    
                    return;
                }      
                if (self.tracer)  console.log("CARGANDO... Está fuera de pantalla");  
            };


            this.successCallback = function(success){
                self.back();
                if (  self.needParseJSON  == 1){
                  success = JSON.parse(success);    
                }
                callbackFunction(success);    
            }

            this.failCallback = function(error){
                if (self.loader) Ajxur.Loader.quitar();

                if (self.needParseJSON == 1){
                    error = JSON.parse(error);            
                }

                if (typeof callbackFunctionError != "function"){
                    callbackFunctionError(error.responseText);
                } else {                                      
                    var datosJSON = JSON.parse(error.responseText);
                    console.error(datosJSON.mensaje);
                    alert(datosJSON.mensaje);                    
                    //swal("Error", datosJSON.mensaje, "error");    
                }   
            }
        }
};
