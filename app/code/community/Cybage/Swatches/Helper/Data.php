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

class Cybage_Swatches_Helper_Data extends Mage_Core_Helper_Abstract
{    
    /*  @return path of swatch image */
    public function getSwatchImageDir()
    {
        return Mage::getBaseDir('media') . DIRECTORY_SEPARATOR . 'swatches' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR;
    }
    /*  @return URl of images */
    public function getUploadedImageUrl($attrValue)
    {
        $uploadDir = $this->getSwatchImageDir();

        if (file_exists($uploadDir . $attrValue . '.jpg'))
        {
            return Mage::getBaseUrl('media') . 'swatches' . '/' . 'images' . '/' . $attrValue . '.jpg';
        }
        return '';
    }

    /* returns the swatch block html */
    
    public function getSwatchesBlock($_product, $html)
    {
        $block = Mage::app()->getLayout()->createBlock('swatches/catalog_product_view_type_configurableList');
        $block->setTemplate('cybage/swatches/configurable.phtml');
        $block->setProduct($_product);
        $block->setNameInLayout('product.info.options.configurable');
        
        $html .= '<div id="swatches-block">' . $block->toHtml() . '</div>';
        
        return $html;
    }
    /* return the Thumbimage size */
      public function getthumbImageSize()
    {
        return Mage::getStoreConfig('swatches/list/thumb_img_size_list');
    } 
    
    /* return the size of options */
    public function getOptionsImageSize()
    {
        return Mage::getStoreConfig('swatches/list/img_size_list');
    } 

    /* return the size of swatch on view page */
    
    public function getOptionsImageSizePDP()
    {
        return Mage::getStoreConfig('swatches/pdp/img_size_pdp');
    } 

    /* return array */
    public function getUseSwatches($attributeId)
    {
        $confAttr = Mage::getModel('swatches/attribute')->load($attributeId, 'attribute_id');
        return array($confAttr->getUseSwatches());
    }
    /* return the imageUrl of product */
    public function getProductImageUrl($productId,$optionId)
    {
        $attrValue = $productId."-".$optionId;
        
        $uploadDir = $this->getSwatchImageDir();

        if (file_exists($uploadDir . $attrValue . '.jpg'))
        {
            return Mage::getBaseUrl('media') . 'swatches' . '/' . 'products' . '/' . $attrValue . '.jpg';
        }
        return '';
    }
   /* return the swatches based on priority */
    public function getSwatchesBasedOnPriority($attrValue,$productId)
    {
        $productLevelSwatches = $this->getProductImageUrl($productId,$attrValue);
        
        if(!empty($productLevelSwatches)){
            return $productLevelSwatches;
        }else{
            return $this->getUploadedImageUrl($attrValue);
        }
    }
}
