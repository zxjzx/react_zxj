import React, { useEffect, useState } from "react";
import { Form, Table } from 'antd'
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import styles from './style.less'
import InputNumberDev from "@/pages/presale/add/components/FormItem/InputNumberDev";
import { AmountRules, RequiredRules } from "@/utils/utils";
import InputNumberBox from "@/pages/presale/add/components/FormItem/InputNumberBox";

interface PropsType {
  formName?: string; // formItem的name
  title?: string; // table的标题
  hideAction?: boolean; //是否隐藏添加删除
  cls: {
    name: string;
    dataIndex?: string;
    title: string;
    fixed?: string;
    width?: number;
    renderType?: string,
    min?: number;//最小值
    max?: number;//最大值
    point?: number;//小数点位数
    // text, record, index, item
    render?: ( text: string, record: any, index: number, item: any ) => React.ReactElement;
    prefix?: string;
  }[]; //列属性设置，最重要的
  minItems?: number; //最小行数
  maxItems?: number; //最大行数
}

const action = ( { remove, add, len, minItems, maxItems } ) => {
  return {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    key: 'action',
    render: ( text, record, index ) => {
      return <>
        { ((minItems && ( index + 1 > minItems )) || (!minItems && index !== 0) )&& <MinusCircleOutlined
          className={ styles.iconButton }
          onClick={ () => {
            //移除
            remove( record.name );
          } }
        />}
        { ((maxItems && index === 0 && len < maxItems) || (!maxItems && index === 0)) && <PlusCircleOutlined
          className={ styles.iconButton }
          onClick={ () => {
            //添加
            add();
          } }
        />}
      </>
    }
  }
}


const ListTableForm: React.FC<PropsType> = ( props: PropsType ) => {
  const { formName = '', minItems, maxItems} = props;

  const [ cls, setCls ] = useState<any[]>( [] );

  function renderType( text, record, index, other ) {
    const { renderType, point, min, max, prefix } = other;
    switch ( renderType ) {
      case 'input-number' :
        return <Form.Item
          rules={ RequiredRules }
          name={ [ record.name, other.name ] }
          fieldKey={ [ record.fieldKey, other.name ] }
        >
          <InputNumberDev point={ point } min={ min }/>
        </Form.Item>
      case 'input-amount' :
        return <Form.Item
          className={ styles.priceInput }
          rules={ AmountRules( { min, max } ) }
          name={ [ record.name, other.name ] }
          fieldKey={ [ record.fieldKey, other.name ] }
        >
          <InputNumberBox prefix={prefix} min={ min } max={ max } point={ point } />
        </Form.Item>;
      case 'text' :
      default:
        return <Form.Item
          shouldUpdate={ true }
        >
          { ( { getFieldValue } ) => {
            if ( !formName ) {
              return ''
            }
            return `${ prefix || '' }${ ( getFieldValue( formName ) || [] )?.[index]?.[other?.name] }`
          } }
        </Form.Item>
    }

  }

  useEffect( () => {
    const _newProps = props.cls.map( ( item, index ) => {
      const { render, ...resetProps } = item;
      return {
        ...resetProps,
        render: render ? ( text, record, index ) => render( text, record, index, item ) : ( text, record, index ) => renderType( text, record, index, item )
      }
    } );
    setCls( _newProps )
  }, [ props.cls ] )


  return <>
    <Form.List name={ props.formName || 'tableForm' }>
      { ( fields, { add, remove } ) => {
        const len = fields.length;
        return (
          <div>
            <Table bordered pagination={ false }
                   title={ props.title ? () => props.title : undefined }
                   className={ styles.listTableEdit }
                   size={ "small" }
                   rowKey={ "name" }
                   dataSource={ fields }
                   columns={ cls.concat( props.hideAction ? [] : action( {
                     add,
                     remove,
                     len,
                     minItems,
                     maxItems
                   } ) ) }/>
          </div>
        );
      } }
    </Form.List>
  </>;

};


export default ListTableForm;
