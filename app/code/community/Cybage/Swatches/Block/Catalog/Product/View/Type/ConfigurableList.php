<?php
/**
 * Cybage Color Swatches Plugin
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * It is available on the World Wide Web at:
 * http://opensource.org/licenses/osl-3.0.php
 * If you are unable to access it on the World Wide Web, please send an email
 * To: Support_Magento@cybage.com.  We will send you a copy of the source file.
 *
 * @category   Color Swatches Plugin
 * @package    Cybage_Swatches
 * @copyright  Copyright (c) 2014 Cybage Software Pvt. Ltd., India
 *             http://www.cybage.com/pages/centers-of-excellence/ecommerce/ecommerce.aspx
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @author     Cybage Software Pvt. Ltd. <Support_Magento@cybage.com>
 */

class Cybage_Swatches_Block_Catalog_Product_View_Type_ConfigurableList extends Mage_Catalog_Block_Product_View_Type_Configurable
{
    protected $_optionProducts;
    protected $_jsonConfig;
    
    /* return attribute info */
    public function checkConfAttribute()
   {
        $configAttributes = $this->getAllowAttributes();
        $attributeArray = Mage::helper('core')->decorateArray($configAttributes);

        foreach($attributeArray as $attribute)
        {
            $attributeInfoArray[] = array('label'=>$attribute->getLabel(),'attribute_id'=>$attribute->getAttributeId(),'decoratedIsLast'=>$attribute->decoratedIsLast);
        }
        
       return $attributeInfoArray;
    }

    /* return htm data */
    protected function _afterToHtml($html)
    {

        $imageSize = Mage::helper('swatches')->getthumbImageSize();
        $html = parent::_afterToHtml($html);
        if ('product.info.options.configurable' == $this->getNameInLayout())
        {
            $html = str_replace('super-attribute-select', 'no-display super-attribute-select', $html);
           
            $simpleProducts = $this->getProduct()->getTypeInstance(true)->getUsedProducts(null, $this->getProduct());
            if ($this->_optionProducts)
            {
                $this->_optionProducts = array_values($this->_optionProducts);
                 $countOptionProducts = count($this->_optionProducts);
                foreach ($simpleProducts as $simple)
                {
                    $key = array();
                   
                    for ($i = 0; $i < $countOptionProducts ; $i++)
                    {
                        foreach ($this->_optionProducts[$i] as $optionId => $productIds)
                        {
                            if (in_array($simple->getId(), $productIds))
                            {
                                $key[] = $optionId;
                            }
                        }
                    }

                    if ($key)
                    {
                        $strKey = implode(',', $key);
                        $confData[$strKey] = array();
                        
                        $confData[$strKey]['parent_image'] =(string)($this->helper('catalog/image')->init($this->getProduct(), 'small_image')->resize($imageSize)); 
                        $confData[$strKey]['small_image'] = (string)($this->helper('catalog/image')->init($simple, 'small_image')->resize($imageSize));
                    }
                }
                $html .= '<script type="text/javascript"> 
                              confData['.$this->getProduct()->getEntityId().'] = new swatchesListingData(' . Zend_Json::encode($confData) . ');
                </script>';
            }
        }

        return $html;
    }
    /* return json*/

    public function getJsonConfig()
    {
        $jsonConfig = parent::getJsonConfig();
        $config = Zend_Json::decode($jsonConfig);
        
        if (Mage::helper('swatches')->getOptionsImageSize()){
             $config['size'] = Mage::helper('swatches')->getOptionsImageSize();
        }
        foreach ($config['attributes'] as $attributeId => $attribute)
        {
            $attr = Mage::getModel('swatches/attribute')->load($attributeId, 'attribute_id');
            if($attr->getUseSwatches()){
                foreach ($attribute['options'] as $i => $option)
                {
                    $this->_optionProducts[$attributeId][$option['id']] = $option['products'];
                    $config['attributes'][$attributeId]['use_swatches'] = 1;
                    $config['attributes'][$attributeId]['options'][$i]['image'] = Mage::helper('swatches')->getSwatchesBasedOnPriority($option['id'],$this->getProduct()->getEntityId());
                }    
            }
        }
        $this->_jsonConfig = $config;
        return Zend_Json::encode($config);
    }

    /* return json data of product price*/
    public function getPriceForConfig()
    {
        $config = array();
        $product = $this->product; 
        $regularPrice = $product->getPrice();
        $finalPrice = $product->getFinalPrice();
        $tierPrices = array();
        
        foreach ($product->getTierPrice() as $tierPrice) {
            $tierPrices[] = Mage::helper('core')->currency($tierPrice['website_price'], false, false);
        }

        $config = array(
            'productId'           => $product->getId(),
            'priceFormat'         => Mage::app()->getLocale()->getJsPriceFormat(),
            'productPrice'        => Mage::helper('core')->currency($finalPrice, false, false),
            'productOldPrice'     => Mage::helper('core')->currency($regularPrice, false, false),
            'plusDisposition'     => 0,
            'minusDisposition'    => 0,
            'tierPrices'          => $tierPrices,
        );

    
        return Mage::helper('core')->jsonEncode($config);
    }
}
