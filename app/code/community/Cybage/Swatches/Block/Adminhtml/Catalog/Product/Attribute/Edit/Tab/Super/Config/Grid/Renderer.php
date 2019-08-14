<?php
class Cybage_Swatches_Block_Adminhtml_Catalog_Product_Attribute_Edit_Tab_Super_Config_Grid_Renderer extends Mage_Adminhtml_Block_Widget_Grid_Column_Renderer_Checkbox {
    /**
     * Renders grid column
     *
     * @param   Varien_Object $row
     * @return  string
     */
    public function render(Varien_Object $row)
    {
        $result = parent::render($row);
        return $result.'<input type="hidden" class="value-json" value="'.htmlspecialchars($this->getAttributesJson($row)).'" />';
    } 
    public function getAttributesJson(Varien_Object $row)
    {
        if(!$this->getColumn()->getAttributes()) {
            return '[]';
        }

        $result = array();
        foreach($this->getColumn()->getAttributes() as $attribute) {
            $productAttribute = $attribute->getProductAttribute();
            if($productAttribute->getSourceModel()) {
                $label = $productAttribute->getSource()->getOptionText($row->getData($productAttribute->getAttributeCode()));
            } else {
                $label = $row->getData($productAttribute->getAttributeCode());
            }
            $item = array();
            $item['label']        = $label;
            $item['attribute_id'] = $productAttribute->getId();
            $item['value_index']  = $row->getData($productAttribute->getAttributeCode());
            $item['option_img'] = Mage::helper('swatches')->getUploadedImageUrl($item['value_index']);
            $result[] = $item;
        }

        return Mage::helper('core')->jsonEncode($result);
    }
}