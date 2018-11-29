const loadProducts = (url) => {
    var dateAtual = new Date().getTime();
    $.getJSON(`${url}?${dateAtual}`, function (data) {
        combineInfo(data)
    })
    const combineInfo = (data) => {
        $('.product').each((index, element) => {
            $(element).data('info').filter((info, indexFilter) => {
                var tipoDiv = {
                    "slick": data.products[info] ? $(`<div data-tipo="${data.products[info].tipo}" data-sku="${data.products[info].produtoInfo.SKU}" data-index="${info}"></div>`) : "",
                    "simples": data.products[info] ? $(`<div data-tipo="${data.products[info].tipo}" data-sku="${data.products[info].produtoInfo.SKU}" data-index="${info}"></div>`) : "",
                }
                var tipoElement = $(element).data('tipo')
                $(element).append(tipoDiv[tipoElement]).addClass(tipoElement)
                var target = $(element).find(`[data-index=${info}]`)[0]
                //mountEstrutura(target, data.products)
                //$(element).data('info').length - 1 == indexFilter ? loadSlicks($(element)) : ''
            })
        })
        $('.banner').each((index, element) => {
            $(element).data('info').filter((info) => {

                var tipoDiv = data.products[info] ? $(`<div>${data.banners[info].nome}</div>`) : ''
                $(element).append(tipoDiv)
            })
        })

    }
    
}
const loadSlicks = (div) => {
    $(div).hasClass('slick') ? $(div).slick() : ''
}
const mountProductCollection = (data, element) => {
    $(element).text('colecao')
}

const getApiData = (data) => {
    $.ajax({
        url: `https://api.saraiva.com.br/sc/produto/list/${data.join('|')}/0/0/1/`,
        dataType: 'json',
        success: function (info) {
            info.map((product,index)=>{
                console.log($(`[data-index="${index}"]`))
                //console.log(product.sku)
            })
            //console.log($(`[data-sku]`))
        }, error: function (data) {
            //$(element).find('.product__info > span').html(`<b>Produto não existente ou não cadastrado</b>`)
        }
    });
}



$(document).ready(() => {
    loadProducts('https://images.livrariasaraiva.com.br/estatico/2018/promo/11-novembro/black-friday/admin_bf/data.json')
})