
const timeUrgency = (listOfSkus) => {
    listOfSkus.filter(info => {
        $.get(`https://api.saraiva.com.br/produto/urgencycards/${info.sku}=${info.rule_urgency}`, function (data) {
            var skus = Object.keys(data)
            const urgencyRule = data[info.sku]
            if (urgencyRule) {
                urgencyOptions = {
                    remainingTime: urgencyRule.missing_time,
                    remainingItems: urgencyRule.remaining_quantity,
                    description: urgencyRule.description,
                    showTimer: urgencyRule.show_timer,
                    showItems: urgencyRule.show_counter,
                    toggle: false
                }
                function urgencyCounter(options) {
                    // options details
                    const remainingTime = options.remainingTime;
                    const remainingItems = options.remainingItems;
                    const description = options.description;
                    const showTimer = options.showTimer;
                    const showItems = 1;
                    const toggle = options.toggle;

                    // svg defaults 
                    const svgns = "http://www.w3.org/2000/svg";
                    const xlinkns = "http://www.w3.org/1999/xlink";

                    // create html
                    const urgency = document.createElement('div');
                    const urgencyContent = document.createElement('div');
                    const urgencyLead = document.createElement('span');
                    const urgencyIcon = document.createElement('i');
                    const urgencyRemainingTime = document.createElement('span');
                    const urgencyRemainingItems = document.createElement('span');
                    const urgencyDescription = document.createElement('p');

                    // add classes
                    urgency.classList.add('urgency');
                    urgencyContent.classList.add('urgency__content');

                    // create icon clock
                    urgencyIcon.classList.add('icon', 'icon-clock');
                    urgencyIcon.setAttributeNS(xlinkns, 'href', '#icon-clock');


                    // add classes
                    urgencyLead.classList.add('urgency__oferta')
                    urgencyRemainingTime.classList.add('urgency__remaining-time', 'active');
                    urgencyRemainingItems.classList.add('urgency__remaining-items');

                    // toggle remain and timer
                    if (toggle) {
                        urgency.classList.add('small');

                        if (showTimer && showItems) {
                            urgencyRemainingItems.classList.add('hide');

                            const toggleContent = setInterval(function () {
                                urgencyLead.classList.toggle('hide');
                                urgencyIcon.classList.toggle('hide');
                                urgencyRemainingTime.classList.toggle('hide');
                                urgencyRemainingItems.classList.toggle('hide');
                            }, 3000);
                        }
                    }

                    // create counter
                    if (showTimer) {
                        urgencyLead.textContent = 'Oferta';
                        urgencyRemainingTime.textContent = '00:00:00';

                        let changeTime = remainingTime;
                        const createCounter = setInterval(function () {
                            let seconds = changeTime;

                            if (seconds > 59) {
                                seconds = seconds % 60;
                            }
                            if (seconds < 10) {
                                seconds = `0${seconds}`
                            }

                            let minutes = changeTime / 60;
                            minutes = minutes % 60;
                            minutes = Math.floor(minutes);

                            if (minutes < 10) {
                                minutes = `0${minutes}`
                            }

                            let hours = (changeTime / 60) / 60;
                            hours = Math.floor(hours);

                            if (hours < 10) {
                                hours = `0${hours}`
                            }

                            urgencyRemainingTime.textContent = `${hours}:${minutes}:${seconds}`;

                            changeTime--;
                            if (changeTime < 0) {
                                clearInterval(createCounter);
                                urgency.classList.add('urgency-timeout');
                                urgencyRemainingItems.textContent = 'Restam 0';
                                if (toggle) {
                                    clearInterval(toggleContent);
                                    urgencyLead.classList.remove('hide');
                                    urgencyIcon.classList.remove('hide');
                                    urgencyRemainingTime.classList.remove('hide');
                                    urgencyRemainingItems.classList.add('hide');
                                }
                            }
                        }, 1000);
                    }
                    else {
                        urgency.classList.add('urgency--center');

                        urgencyLead.classList.add('hide');
                        urgencyIcon.classList.add('hide');
                        urgencyRemainingTime.classList.add('hide');
                    }
                    if (showItems) {
                        let remainText;
                        if (remainingItems > 1) {
                            remainText = 'Restam '
                        } else if (remainingItems < 1) {
                            remainText = 'Resta '
                            urgency.classList.add('esgotado')
                        }

                        urgencyRemainingItems.textContent = remainText + remainingItems;
                    }
                    else {
                        urgency.classList.add('urgency--center');
                        urgencyRemainingItems.classList.add('hide');
                    }

                    // join html
                    urgency.appendChild(urgencyLead);
                    urgency.appendChild(urgencyContent);
                    urgencyContent.appendChild(urgencyIcon);
                    urgencyContent.appendChild(urgencyRemainingTime);
                    urgencyContent.appendChild(urgencyRemainingItems);

                    const urgencyWrap = document.createElement('div');
                    ["col-12", "d-flex", "flex-column", "urgency__wrap", "align-items-start", "justify-content-center"].map(classUrgency => {
                        urgencyWrap.classList.add(classUrgency)
                    })

                    if (description && !toggle) {
                        urgencyDescription.classList.add('urgency__helper');
                        urgencyDescription.textContent = description;

                        urgencyWrap.appendChild(urgencyDescription);
                    }
                    urgencyWrap.appendChild(urgency)
                    return urgencyWrap
                }

                skus.map((sku,index) => {
                    var retorno = urgencyCounter(urgencyOptions)
                    $(`[data-sku="${sku}"][data-urgency-card="true"]`).each(function (index, div) {
                        $(div).find('.product__image').prepend(retorno)
                    })
                })
            }
        });
    })
}

const loadProducts = (url) => {
    var dateAtual = new Date().getTime();
    $.getJSON(`${url}?${dateAtual}`, function (data) {
        combineInfo(data)
        mountApiData(data.skus)
    })
    const combineInfo = (data) => {
        $('.black_friday .product').each((index, element) => {
            $(element).data('info').filter((info, indexFilter) => {
                var tipoDiv = {
                    "slick": data.products[info] ? $(`<div data-tipo-produto="${data.products[info].tipo}" data-saraiva-plus="${data.products[info].tipo == "produto" ? data.products[info].produtoInfo.saraiva_plus : data.products[info].colecaoInfo.saraiva_plus}" data-urgency-card="${data.products[info].produtoInfo.urgency_card}" data-selo-parceiro="${data.products[info].colecaoInfo.selo_parceiro}" data-sku="${data.products[info].produtoInfo.SKU}" data-index="${info}"></div>`) : "",
                    "simples": data.products[info] ? $(`<div data-tipo-produto="${data.products[info].tipo}" data-saraiva-plus="${data.products[info].tipo == "produto" ? data.products[info].produtoInfo.saraiva_plus : data.products[info].colecaoInfo.saraiva_plus}" data-urgency-card="${data.products[info].produtoInfo.urgency_card}" data-selo-parceiro="${data.products[info].colecaoInfo.selo_parceiro}" data-sku="${data.products[info].produtoInfo.SKU}" data-index="${info}"></div>`) : "",
                }
                var tipoElement = $(element).data('tipo')
                $(element).append(tipoDiv[tipoElement]).addClass(tipoElement)
                var target = $(element).find(`[data-index=${info}]`)[0]
                mountEstrutura(target, data.products)
            })
        })
        $('.black_friday .banner').each((index, element) => {
            $(element).data('info').filter((info) => {
                var tipoDiv = data.banners[info] && data.banners[info].visible ? $(`<a href="${data.banners[info].link}"><img class="img-fluid d-none d-md-block" src="${data.banners[info].url_desktop}"
                alt="${data.banners[info].nome}"><img class="img-fluid d-block d-md-none" src="${data.banners[info].url_mobile}" alt="${data.banners[info].nome}"></a>`) : ''
                $(element).append(tipoDiv)
            })
        })

    }

}
const loadSlicks = (div) => {
    $(div).hasClass('slick') ? $(div).slick({
        mobileFirst: true, infinite: false, arrows: false, adaptiveHeight: true, dots: true
    }) : ''
}
const mountEstrutura = (element, data) => {
    element.dataset.tipoProduto == "produto" ? "" : mountProductCollection(data[element.dataset.index], element)
}
const truncateText = (limit,text,active) => {
    return typeof text != "undefined" ? active && text.length > limit ? text.substr(0,limit).concat('...') : text : ""
}
const mountProductCollection = (data, element) => {
    data.colecaoInfo.selo_parceiro == true ? $(element).parent().addClass('has_selo_parceiro') : ""
    var thisInfo = data.colecaoInfo
    var estrutura = `
                <div class="row align-items-center">
                <div class="${$(element).parent().hasClass('black') ? `col-12 align-self-center` : `col-lg-6`} d-flex flex-column align-items-center justify-content-center product__image">
                        <a href="${thisInfo.link}"><img class="img-fluid" src="${thisInfo.img}"></a>
                    </div>
                    <div class="${$(element).parent().hasClass('black') ? `col-12 align-self-end` : `col-lg-6`} d-flex flex-column align-items-center justify-content-center product__content">
                        <h2 class="product__title">${truncateText(65,data.nome,$(element).parent().hasClass('black'))}</h2>
                        <div class="product__price">
                            <div class="price">${thisInfo.before_value} <span>${thisInfo.after_value}</span></div>
                            <div class="price__installments">${thisInfo.installments_value}</div>
                        </div>
                        <div class="product__seller">Vendido por <b>${thisInfo.vendido_por}</b></div>
                        <div class="product__cta"><a href="${thisInfo.link}">EU QUERO</a></div>
                    </div>
                </div>`
    $(element).append(estrutura)
}

const getPrice = (sku) => {
    
    $.ajax({
        url: `https://preco.saraiva.com.br/v3/buyBox/produto/${sku.join(',')}`,
        dataType: 'json',
        success: function (info) {
            const getPriceHtml = (index, element) => {
                
                var skuInfo = info[index] ? info[index] : ""
                var estrutura = `
                        <div class="product__price">
                            <div class="price">${skuInfo[0].price.nominal <= skuInfo[0].price.final ? `Por <span>R$ ${skuInfo[0].price.final}</span>` : `De R$ ${skuInfo[0].price.nominal} por <span>R$ ${skuInfo[0].price.final}</span>`}</div>
                            <!--div class="price__installments">em até <b>${skuInfo[0].price.qty_installments_with_fee}x sem juros de ${skuInfo[0].price.value_installments_without_fee}</b> ${skuInfo[0].price.discount_percent > 0 ? `<span>(${skuInfo[0].price.discount_percent}%)</span>` : ""}</div-->
                            <div class="price__installments">em até <b>${skuInfo[0].price.qty_installments_with_fee}x sem juros de R$ ${skuInfo[0].price.value_installments_without_fee}</b></div>
                        </div>`
                var vendidoPor = `<b>${skuInfo[0].store_name}</b>`
                $(element).find('.product__price').replaceWith(estrutura)
                $(element).find('.product__seller b').replaceWith(vendidoPor)
                skuInfo[0].fil_id == 16 || skuInfo[0].fil_id == 1 ? $(element).find('.product__image .spinner').replaceWith(`<img class="img-fluid" src="https://images.livrariasaraiva.com.br/imagemnet/imagem.aspx/?pro_id=${skuInfo[0].sku}&qld=90&l=250&a=-1">`) : $(element).find('.product__image .spinner').replaceWith(`<img class="img-fluid" src="https://images.livrariasaraiva.com.br/imagemnet/imagem.aspx/?pro_id=${skuInfo[0].sku}&qld=90&l=250&a=-1&MktpIn=true&Lojista=${skuInfo[0].fil_id}">`)
            }
            $('.product [data-sku]').filter((index, element) => {
                $(element).data('tipoProduto') == "produto" ? getPriceHtml(index, element) : ""
            })
        }
    })
}
const mountApiData = (data) => {
    $.ajax({
        url: `https://api.saraiva.com.br/sc/produto/list/${data.join('|')}/0/0/1/`,
        dataType: 'json',
        success: function (info) {
            //console.log(info)
            var skus = []
            $('.product [data-sku]').each(function (index, element) {
                info[index].sku != undefined ? skus[index] = info[index].sku : skus[index] = ""
                //skus.push(info[index].sku)
                var thisInfo = info[index]
                var estrutura = `
                    <div class="row align-items-center">
                    <div class="${$(this).parent().hasClass('black') ? `col-12` : `col-lg-6`} d-flex flex-column align-items-center justify-content-center product__image">
                        <a href="https://www.saraiva.com.br/${thisInfo.url}">
                            <div class="spinner">
                                <div class="bounce1"></div>
                                <div class="bounce2"></div>
                                <div class="bounce3"></div>
                            </div>
                        </a>
                    </div>
                    <div class="${$(this).parent().hasClass('black') ? `col-12 align-self-end` : "col-lg-6"} d-flex flex-column align-items-center justify-content-center product__content">
                        <h2 class="product__title">${truncateText(65,thisInfo.name,$(element).parent().hasClass('black'))}</h2>
                        <div class="product__price">
                        </div>
                        <div class="product__seller">Vendido por <b>Saraiva</b></div>
                        <div class="product__cta"><a href="https://www.saraiva.com.br/${thisInfo.url}">EU QUERO</a></div>
                    </div>
                </div>`
                $(this).data('sku') == info[index].sku ? $(this).append(estrutura) : ''
            })
            loadSlicks($('.slick'))
            getPrice(skus)
            var urgencyCards = info.filter(info => {
                return info.rule_urgency != null ? info : ''
            })
            timeUrgency(urgencyCards)
        }
    });
}



$(document).ready(() => {
    var arquivoLoaded = window.location.href;
    var urlLoaded = arquivoLoaded.indexOf('teste') !== -1 ? "https://images.livrariasaraiva.com.br/estatico/2018/promo/11-novembro/black-friday/admin_bf/teste.json" : "https://images.livrariasaraiva.com.br/estatico/2018/promo/11-novembro/black-friday/admin_bf/data.json"
    loadProducts(urlLoaded)
})