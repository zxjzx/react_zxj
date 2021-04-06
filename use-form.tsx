import { Form, Input } from "antd";
import React from "react";
import { AmountRules, RequiredRules } from "@/utils/utils";
import InputNumberBox from "@/pages/presale/add/components/FormItem/InputNumberBox";
import styles from "@/pages/presale/add/components/FormItem/style.less";
import InputNumberDev from "@/pages/presale/add/components/FormItem/InputNumberDev";
import ListTableForm from "@/components/ListTableForm";

const { TextArea } = Input;

export default ( props ) => {
  const formName = "unitPriceDefinitions";
  const [ form ] = Form.useForm();

  return <div>
    <Form name="basic" form={ form } onFinish={ ( values ) => console.log( values ) }>

      <Form.Item
        label="名称"
        name="description"
        rules={ RequiredRules }
      >
        <TextArea rows={ 4 } showCount maxLength={ 200 } placeholder="200字为限"/>
      </Form.Item>

      <Form.Item label="剩余有效期" name="leftMonths" rules={ AmountRules( { min: 0 } ) }>
        <InputNumberBox className={ styles.inputNumberWidth } suffix="个月"/>
      </Form.Item>


      <Form.Item label="量及单价" required>
        <ListTableForm
          formName={ formName }
          cls={ [
            {
              title: '最小值',
              name: 'quantityStart',
              dataIndex: 'quantityStart',
              render: ( text, record, index ) => {
                return <Form.Item
                  shouldUpdate={ ( prevValues, curValues ) => {
                    return prevValues[formName]?.[index]?.quantityEnd !== curValues[formName]?.[index]?.quantityEnd
                  } }
                >
                  { ( { getFieldValue } ) => {
                    const max = getFieldValue( formName )?.[index]?.quantityEnd;
                    return <Form.Item name={ [ record.name, "quantityStart" ] }
                                      fieldKey={ [ record.fieldKey, "quantityStart" ] }
                                      dependencies={ [ [ formName, index, 'quantityEnd' ] ] }
                                      rules={ AmountRules( { min: 0, max } ) }>
                      <InputNumberBox className={ styles.priceNumber } min={ 0 }/>
                    </Form.Item>
                  } }
                </Form.Item>
              }

            },
            {
              title: '最大值',
              dataIndex: 'quantityEnd',
              name: 'quantityEnd',
              render: ( text, record, index ) => {
                return <Form.Item
                  shouldUpdate={ ( prevValues, curValues ) => {
                    return prevValues[formName]?.[index]?.quantityStart !== curValues[formName]?.[index]?.quantityStart
                  } }
                >
                  { ( { getFieldValue } ) => {
                    const min = getFieldValue( formName )?.[record.fieldKey]?.quantityStart;
                    return <Form.Item name={ [ record.name, "quantityEnd" ] }
                                      fieldKey={ [ record.fieldKey, "quantityEnd" ] }
                                      dependencies={ [ [ formName, index, 'quantityStart' ] ] }
                                      rules={ AmountRules( { min } ) }>
                      <InputNumberBox className={ styles.priceNumber }/>
                    </Form.Item>
                  } }
                </Form.Item>
              }

            },
            {
              title: '单位',
              dataIndex: 'unit',
              name: 'unit',
              width: 80,
              render: ( text, record, index, other ) => {
                return <Form.Item
                  shouldUpdate={ ( prevValues, curValues ) => {
                    if ( !curValues.productObj?.productUnit ) {
                      return false
                    }
                    return prevValues.productObj?.productUnit !== curValues.productObj?.productUnit
                  } }
                >
                  { ( { getFieldValue } ) => {
                    let productUnit = ( getFieldValue( 'productObj' ) || {} ).productUnit || '-';
                    return <>{ productUnit }</>
                  } }
                </Form.Item>

              }

            },
            {
              title: '单价',
              dataIndex: 'unitPrice',
              name: 'unitPrice',
              renderType: 'input-amount',
              point: 4,
              min: 0,
              prefix: '￥'
            },
            {
              title: '销售单价',
              dataIndex: 'platformUnitPrice',
              name: 'platformUnitPrice',
              render: ( text, record, index ) => {
                return <Form.Item
                  shouldUpdate={ ( prevValues, curValues ) => {
                    if ( !curValues[formName]?.[index]?.unitPrice ) {
                      return false
                    }
                    return prevValues[formName]?.[index]?.unitPrice !== curValues[formName]?.[index]?.unitPrice || prevValues.plusPoint !== curValues.plusPoint
                  } }
                >
                  { ( { getFieldValue } ) => {
                    let _list = getFieldValue( formName );
                    let _plusPoint = getFieldValue( 'plusPoint' ) || 0;
                    const _record = _list[index];
                    const _newVal = _record?.unitPrice ? Number( _record.unitPrice ) * ( 1 + ( _plusPoint / 100 ) ) : 0;
                    const _result: number = _newVal ? Number.parseFloat( Number( _newVal ).toFixed( 4 ) ) : 0;
                    return <><span className={ styles.sign }>￥</span><InputNumberDev className={ styles.priceNumber }
                                                                                     disabled defaultValue={ text }
                                                                                     value={ _result } point={ 4 }/></>
                  } }
                </Form.Item>
              }
            },
          ] }/>
      </Form.Item>
    </Form>
  </div>
}
