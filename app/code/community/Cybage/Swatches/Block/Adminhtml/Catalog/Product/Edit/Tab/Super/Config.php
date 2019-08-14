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

class Cybage_Swatches_Block_Adminhtml_Catalog_Product_Edit_Tab_Super_Config extends Mage_Adminhtml_Block_Catalog_Product_Edit_Tab_Super_Config
{
    /**
     * Class constructor
     *
     */
    public function __construct()
    {
        parent::__construct();
        $this->setProductId($this->getRequest()->getParam('id'));
        $this->setTemplate('cybage/catalog/product/edit/super/config.phtml');
        $this->setId('config_super_product');
        $this->setCanEditPrice(true);
        $this->setCanReadPrice(true);
    }

    /**
     * Retrieve attributes data in JSON format
     *
     * @return string
     */
    public function getAttributesJson()
    {
        $attributes = $this->_getProduct()->getTypeInstance(true)
            ->getConfigurableAttributesAsArray($this->_getProduct());

        if(!$attributes) {
            return '[]';
        } else {
            // Hide price if needed
            foreach ($attributes as &$attribute) {
                if (isset($attribute['values']) && is_array($attribute['values'])) {
                    foreach ($attribute['values'] as &$attributeValue) {
                        if (!$this->getCanReadPrice()) {
                            $attributeValue['pricing_value'] = '';
                            $attributeValue['is_percent'] = 0;
                        }
                        $attributeValue['can_edit_price'] = $this->getCanEditPrice();
                        $attributeValue['can_read_price'] = $this->getCanReadPrice();
                        $attributeValue['option_id'] = $this->getAttributeOptionId($attribute['attribute_code'],$attributeValue['label']);
                        $optionImg =  Mage::helper('swatches')->getProductImageUrl($this->getRequest()->getParam('id'),$attributeValue['option_id']);
                        $attributeValue['option_img'] = $optionImg ? $optionImg : Mage::helper('swatches')->getUploadedImageUrl($attributeValue['option_id']);
                    }
                }
            }
        }

        return Mage::helper('core')->jsonEncode($attributes);
    }

    public function getAttributeOptionId($attributeCode,$optionValue){
        $attr = Mage::getModel('catalog/product')->getResource()->getAttribute($attributeCode);
        if ($attr->usesSource()){
            return $attr->getSource()->getOptionId($optionValue);
        }
    }
}
