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

class Cybage_Swatches_Helper_Product extends Mage_Catalog_Helper_Product
{
    /**
     * Added a condition which will return true if products 
     * is child of configurable product.
     * Check if a product can be shown
     *
     * @param  Mage_Catalog_Model_Product|int $product
     * @return boolean
     */
    public function canShow($product, $where = 'catalog')
    {
        if (is_int($product)) {
            $product = Mage::getModel('catalog/product')->load($product);
        }

        /* @var $product Mage_Catalog_Model_Product */

        if (!$product->getId()) {
            return false;
        }

        if(!$product->isVisibleInCatalog() || !$product->isVisibleInSiteVisibility()){
            $productType = $this->getProductInfo($product->getId());
            if($productType == "configurable"){
                return true;
            }
        }
        return $product->isVisibleInCatalog() && $product->isVisibleInSiteVisibility();
    }

    /* 
        Get Parent id for give child
        returns : product type
    */
    public function getProductInfo($id) {
        $parentIds = Mage::getModel('catalog/product_type_configurable')->getParentIdsByChild($id);
        
        $parentProductInfo = Mage::getModel("catalog/product")->load($parentIds[0]);
        if(!empty($parentIds)){
            return $parentProductInfo->getTypeId();
        }else{
            return "";
        }
        
    }
}
