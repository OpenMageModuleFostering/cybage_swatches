/**************************** CONFIGURABLE PRODUCT **************************/
/**************************** reference from varien/configurable.js **************************/

// Product.Config is initialized in varien/configurable.js

Product.Config.prototype.configureElement = function(element) 
{
    this.reloadOptionLabels(element);
    if(element.value){
        this.state[element.config.id] = element.value;
        if(element.nextSetting){
            element.nextSetting.disabled = false;
            this.fillSelect(element.nextSetting);
            this.resetChildren(element.nextSetting);
        }
    }

    var selectValue = '';
    this.settings.each(function(element){
        if (parseInt(element.value))
        {
            selectValue += element.value + ',';   
        }
    });
    
    selectValue = selectValue.substr(0, selectValue.length - 1);
    this.updateSwatchInfo(selectValue);
    
    /*if(typeof additionalData != 'undefined')
    {
        this.reloadAssociatedPrice(selectValue);
    }
    else
    {*/
        this.reloadPrice();
    //}
}

Product.Config.prototype.fillSelect = function(element){

    var attributeId = element.id.replace(/[a-z]*/, '');
    var options = this.getAttributeOptions(attributeId);
    this.clearSelect(element);
    element.options[0] = new Option('', '');
    element.options[0].innerHTML = this.config.chooseText;
    
    var prevConfig = false;
    if(element.prevSetting){
        prevConfig = element.prevSetting.options[element.prevSetting.selectedIndex];
    }

    if(options) {
        if ($('swatch-images-' + attributeId))
        {
            $('swatch-images-' + attributeId).parentNode.removeChild($('swatch-images-' + attributeId));
        }
            
       if (this.config.attributes[attributeId].use_swatches)
        {
            contentDiv = new Element('div', { 
                'class': 'main-swatch-container', 
                'id': 'swatch-images-' + attributeId});
                
            $(element.parentNode).insert({
              top: contentDiv
            });
            
        }
        
        var index = 1;
        for(var i=0;i<options.length;i++){
            var allowedProducts = [];
            if(prevConfig) {
                for(var j=0;j<options[i].products.length;j++){
                    if(prevConfig.config.allowedProducts
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
                        'id': 'attr-image-container-' + attributeId
                    });
                    
                    contentDiv.insert(imgContainer);
                    
                    var swatch = new Element('img', { 
                        'class': 'attr-image', 
                        'id': 'attr-image-' + options[i].id,
                        'src': options[i].image,
                        'alt': options[i].label,
                        'title': options[i].label,
                        'width':this.config.attributes[attributeId].swatches_size,
                        'height':this.config.attributes[attributeId].swatches_size
                    });
                    swatch.observe('click', this.setSwatches.bind(this));
                    
                    imgContainer.insert(swatch);
                }
                
                options[i].allowedProducts = allowedProducts;
                element.options[index] = new Option(this.getOptionLabel(options[i], options[i].price), options[i].id);    
                element.options[index].config = options[i];
                index++;
            }
        }
        if(this.config.attributes[attributeId].use_swatches) {
            $(element.parentNode).insert({
              bottom: new Element('div', {'class': 'swatches-separator'})
            });
        }
    }
}

Product.Config.prototype.setSwatches = function(event){

    var element = Event.element(event);
    attributeId = element.parentNode.id.replace(/[a-z-]*/, '');
    optionId = element.id.replace(/[a-z-]*/, '');
    
    $('swatch-images-' + attributeId).childElements().each(function(childElement){
        if(childElement.childElements()[0]){
            childElement.childElements()[0].removeClassName('attr-image-selected');
        }
    });
    element.addClassName('attr-image-selected');
    
    $('attribute' + attributeId).value = optionId;
    this.configureElement($('attribute' + attributeId));
}

Product.Config.prototype.updateSwatchInfo = function(selectValue)
{
    if ('undefined' == typeof(additionalData))
    {
        return false;
    }

    if (additionalData.hasselectValue(selectValue))
    {
        if(additionalData.getData(selectValue, 'media_url'))
        {
            if($$('.product-img-box .more-views') == undefined || $$('.product-img-box .more-views') == '') {
                $$('.product-img-box').last().insert('<div class="more-views"><h2>More Views</h2><ul></ul></div>');
            }
            
            var cnt = 0;
            
            additionalData.getData(selectValue, 'media_url').each(function (image,cnt){
                
                if(cnt == 0){
                    $$('.product-img-box .product-image img').each( function(img){ img.src=image['url'] } );
                } else if(cnt == 1){
                    if(image['url'] == '') {
                        $$('.product-img-box .more-views ul ').each( function(ul){ 
                        ul.innerHTML = null;
                            });
                    }else{
                    $$('.product-img-box .more-views ul ').each( function(ul){ 
                        ul.innerHTML = additionalData.getGalleryInfo(image['label'],image['url'],image['galleryUrl']);
                            }); }
                } else {
                    $$('.product-img-box .more-views ul ').each( function(ul){ 
                        ul.innerHTML += additionalData.getGalleryInfo(image['label'],image['url'],image['galleryUrl']);
                    });
                }
                cnt++;
            });
        } 
    } 
}

Product.Config.prototype.reloadAssociatedPrice = function(selectValue)
{
     if ('undefined' == typeof(additionalData))
    {
        return false;
    }
    
    var container;
    if (additionalData.hasselectValue(selectValue))
    {
        if (additionalData.getData(selectValue, 'price_html'))
        {
            $$('.product-shop .price-box').each(function(container)
            {
                container.innerHTML = additionalData.getData(selectValue, 'price_html');
            }.bind(this));

        }
        
        if (additionalData.getData(selectValue, 'price_clone_html'))
        {
            $$('.product-options-bottom .price-box').each(function(container)
            {
                container.innerHTML = additionalData.getData(selectValue, 'price_clone_html');
            }.bind(this));
            
        }
        
        
    } 
    
}

PDPSwatchesData = Class.create();
PDPSwatchesData.prototype = 
{
    initialize : function(additionalData)
    {
        this.additionalData = additionalData;
    },
    
    getGalleryInfo : function(label,url,galleryUrl){
        var liContent = "<li><a href='#' onclick=\"popWin('"+galleryUrl+"', 'gallery', 'width=300,height=300,left=0,top=0,location=no,status=yes,scrollbars=yes,resizable=yes'); return false;\" title='"+label+"'><img src="+url+" width='56' height='56' alt='"+label+"' /></a></li>";

        return liContent;
    },

    hasselectValue : function(selectValue)
    {
        return ('undefined' != typeof(this.additionalData[selectValue]));
    },
    
    getData : function(selectValue, param)
    {
        if (this.hasselectValue(selectValue) && 'undefined' != typeof(this.additionalData[selectValue][param]))
        {
            return this.additionalData[selectValue][param];
        }
        return false;
    }
}
