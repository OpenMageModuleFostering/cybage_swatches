/**************************** CONFIGURABLE PRODUCT **************************/
/**************************** reference from varien/configurable.js **************************/

// Product.Config is initialized in varien/configurable.js

swatchesListingData = Class.create();
swatchesListingData.prototype.initialize = function(optionProducts){
    this.optionProducts = optionProducts;
}

var optionsPrice = [];
var confData = [];
var prevNextProduct = [];

Product.Config.prototype.initialize = function(config){

    this.config = config;
    this.taxConfig  = this.config.taxConfig;
    this.settings   = $$('.super-attribute-select-'+ config.productId);
    this.state      = new Hash();
    this.priceTemplate = new Template(this.config.template);
    this.prices     = config.prices;
    this.hideLabels();

    this.settings.each(function(element){
        var attributeId = this.getAttributeId(element);
        if(attributeId && this.config.attributes[attributeId]) {
            element.config = this.config.attributes[attributeId];
            element.attributeId = attributeId;
            this.state[attributeId] = false;
        }
    }.bind(this))

    this.setPrevnextSetting();
    // Set values to inputs
    this.configureForValues();
    document.observe("dom:loaded", this.configureForValues.bind(this));
}

Product.Config.prototype.fillSelect = function(element){
    
    var attributeId = this.getAttributeId(element);
    var options = this.getAttributeOptions(attributeId);
    this.clearSelect(element);
    element.options[0] = new Option('', '');
    element.options[0].innerHTML = this.config.chooseText;
    var prevConfig = false;

    if(element.prevSetting){
        prevConfig = element.prevSetting.options[element.prevSetting.selectedIndex];
    }

    if(options) {

        if (this.config.attributes[attributeId].use_swatches)
        {
            if ($('swatch-images-' + attributeId + '-' + this.config.productId))
            {
                $('swatch-images-' + attributeId + '-' + this.config.productId).parentNode.removeChild($('swatch-images-' + attributeId + '-' + this.config.productId));
            }
            $('title-' + attributeId + '-' + this.config.productId).show();
            contentDiv = new Element('div', { 
                'class': 'settings-swatch-container', 
                'id': 'swatch-images-' + attributeId + '-' + this.config.productId});
                
            $(element.parentNode).insert({
              top: contentDiv
            });
        }
    }

        var index = 1;
        for(var i=0;i<options.length;i++){
            var allowedProducts = [];
            if(prevConfig) {

                for(var j=0;j<options[i].products.length;j++){
                    if(prevConfig.config && prevConfig.config.allowedProducts
                        && prevConfig.config.allowedProducts.indexOf(options[i].products[j])>-1){
                            
                        allowedProducts.push(options[i].products[j]);
                    }
                }
            } else {
                allowedProducts = options[i].products.clone();
            }

            if(allowedProducts.size()>0)
            {
                if (this.config.attributes[attributeId].use_swatches)
                {
                    var imgContainer = new Element('div', { 
                        'class': 'attr-image-container', 
                        'id': 'attr-image-container-' + options[i].id + '-' + this.config.productId
                    });
                    
                    contentDiv.insert(imgContainer);
                    
                    var swatch = new Element('img', { 
                        'class': 'attr-image', 
                        'id': 'attr-image-' + options[i].id + '-' + this.config.productId,
                        'src': options[i].image,
                        'alt': options[i].label,
                        'title': options[i].label,
                        'height': this.config.size,
                        'width': this.config.size
                    });
                    swatch.observe('click', this.setSwatches.bind(this));
                    
                    imgContainer.insert(swatch);
                    
                }

                if(allowedProducts.size()>0){
                    options[i].allowedProducts = allowedProducts;
                    element.options[index] = new Option(this.getOptionLabel(options[i], options[i].price), options[i].id);
                    element.options[index].config = options[i];
                    index++;
                }
            }
        }

        if(this.config.attributes[attributeId].use_swatches) {
            $(element.parentNode).insert({
              bottom: new Element('div', {'class': 'swatches-separator'})
            });
            
        }

}

Product.Config.prototype.setSwatches = function(event){

    var element = Event.element(event);
    attributeId = element.parentNode.parentNode.id.replace(/[a-z-]*/, '');
    var optionId = element.id.replace(/[a-z-]*/, '');
    var position = optionId.indexOf('-');
    if ('-1' != position)
        optionId = optionId.substring(0, position);

    $$('#attribute' + attributeId).each(function(select){
        select.value = optionId;    
    });
    this.configureElement($('attribute' + attributeId));
}

Product.Config.prototype.configureElement = function(element) 
{
    this.reloadOptionLabels(element);
    
    if(element.value){

        this.state[element.config.id] = element.value;
        var elementId = element.id;

        var position = elementId.indexOf('-');
        if ('-1' != position){
            elementId = elementId.substring(position+1, elementId.lenght);
            elementId = 	parseInt(elementId);
            if(prevNextProduct[elementId] && prevNextProduct[elementId][element.config.id] && prevNextProduct[elementId][element.config.id][1] || element.nextSetting){
                 if(prevNextProduct[elementId] && prevNextProduct[elementId][element.config.id] && prevNextProduct[elementId][element.config.id][1]){
                    element.nextSetting = prevNextProduct[elementId][element.config.id][1]
                }
                element.nextSetting.disabled = false;
                this.fillSelect(element.nextSetting);
                this.resetChildren(element.nextSetting);
            }
        }
    }
    
    if ($('attr-image-' + element.value + '-' + this.config.productId))
    {
        this.selectImage($('attr-image-' + element.value + '-' + this.config.productId));
    } 
    else {
        attributeId = element.id.replace(/[a-z-]*/, '');
        if ($('swatch-images-' + attributeId))
        {
            $('swatch-images-' + attributeId).childElements().each(function(child){
                child.removeClassName('attr-image-selected');
            });
        }
    }
    
}


Product.Config.prototype.selectImage = function(element)
{
    attributeId = element.parentNode.parentNode.id.replace(/[a-z-]*/, '');
    $('swatch-images-' + attributeId).childElements().each(function(child){
        var childr = child.childElements();
        if(childr[0]) {
            $(childr[0]).removeClassName('attr-image-selected');    
        }
    });
    element.addClassName('attr-image-selected');
    
    var position = attributeId.indexOf('-');
    if ('-1' == position) return;
        
    var optionId = attributeId.substring(0, position);
    var parentId = attributeId.substring(position+1, attributeId.length);

    var selectValue = '';
    this.settings.each(function(select){
        if (parseInt(select.value))
        {
           selectValue += select.value + ',';
        }
    });
    selectValue = selectValue.substr(0, selectValue.length - 1);
    if('undefined' != typeof(confData[parentId]['optionProducts'][selectValue]['small_image'])){ 
         var parUrl = confData[parentId]['optionProducts'][selectValue]['parent_image'];
         var possl = parUrl.lastIndexOf('/');
        
        $$('.product-image img').each(function(img){
              var posslImg = img.src.lastIndexOf('/');
              if(img.src.substr(posslImg, img.src.length) == parUrl.substr(possl, parUrl.length) || img.hasClassName('swatches-parent-'+parentId)){
                  img.src = confData[parentId]['optionProducts'][selectValue]['small_image'];
                  img.addClassName('swatches-parent-'+parentId);
                  
              }
         });
                    
      }
    
    /*if ('undefined' != typeof(confData[parentId]))
    {
        this.reloadPriceOfChildProducts(parentId, selectValue);
    }else{*/
        this.reloadPrice();
    //}
}

Product.Config.prototype.reloadPrice = function(){

        var price    = 0;
        var oldPrice = 0;
        for(var i=this.settings.length-1;i>=0;i--){
            var selected = this.settings[i].options[this.settings[i].selectedIndex];
            if(selected.config){
                price    += parseFloat(selected.config.price);
                oldPrice += parseFloat(selected.config.oldPrice);
            }
        }

        optionsPrice[this.config.productId].changePrice('config', {'price': price, 'oldPrice': oldPrice});
        optionsPrice[this.config.productId].reload();
        return price;
        if($('product-price-'+this.config.productId)){
            $('product-price-'+this.config.productId).innerHTML = price;
        }
        this.reloadOldPrice();
}


Product.Config.prototype.reloadPriceOfChildProducts = function(parentId, selectValue)
{
    if ('undefined' == typeof(confData) || 'undefined' == typeof(confData[parentId]['optionProducts'][selectValue]['price_html']))
    {
        return false;
    }
    
    var childConf = confData[parentId]['optionProducts'][selectValue];
    var priceHtml = childConf['price_html'];
    //console.log(priceHtml);

    $$('.price-box').each(function(container)
    {
        if(container.select('#product-price-'+parentId) != 0 || container.select('#parent-product-price-'+parentId) != 0) {

            var priceContainer = new Element('div', {'style': 'display:none'});
            priceContainer.update(priceHtml);
            container.insert(priceContainer);
            
            var pricetmpContainer1 = new Element('div', {'id': 'parent-product-price-'+parentId});
            var pricetmpContainer2 = priceContainer.childElements()[0];
            pricetmpContainer2.appendChild(pricetmpContainer1);
            container.innerHTML = pricetmpContainer2.innerHTML; 
        }
    }.bind(this));

}

Product.Config.prototype.getAttributeId = function(element){
    var attributeId = element.id.replace(/[a-z]*/, '');
    var position = attributeId.indexOf('-');
    if ('-1' != position){
        attributeId = attributeId.substring(0, position);
    }
    return attributeId;

}

Product.Config.prototype.hideLabels = function(element){
    this.settings.each(function(element){
        var attributeId = element.id.replace(/[a-z]*/,'');
        $('title-' + attributeId).hide();
    }.bind(this))
}

Product.Config.prototype.setPrevnextSetting = function(){
    var childSettings = [];
        
    for(var cnt=this.settings.length-1;cnt>=0;cnt--){
        
        if(this.settings[cnt-1]){
            var prevSetting = this.settings[cnt-1];
        }else{
            var prevSetting = false;
        }
            
        if(this.settings[cnt+1]){
            var nextSetting = this.settings[cnt+1];
        }else{
            var nextSetting = false;
        }
            
        if (cnt == 0){
            this.fillSelect(this.settings[cnt])
        } else {
            this.settings[cnt].disabled = true;
        }

        $(this.settings[cnt]).childSettings = childSettings.clone();
        prevNextProduct[this.settings[cnt].config.id] = [prevSetting, nextSetting];
        var optionId = this.settings[cnt].id;
        var position = optionId.indexOf('-');
        if ('-1' != position){
            optionId = optionId.substring(position+1, optionId.lenght);
            id = parseInt(optionId);
            prevNextProduct[id] = [];
            prevNextProduct[id][this.settings[cnt].config.id] = [prevSetting, nextSetting];
        }
        $(this.settings[cnt]).prevSetting   = prevSetting;
        $(this.settings[cnt]).nextSetting   = nextSetting;
        childSettings.push(this.settings[cnt]);
    }
}