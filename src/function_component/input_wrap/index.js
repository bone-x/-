import styles from './index.scss'
import { View, Input } from '@tarojs/components'

export default function component_form_between(placeholder, right_side, type='text', onInput) {
    const leftSide = <Input type={type} placeholder={placeholder}></Input>
    onInput && (leftSide.props.onInput = onInput.bind(this))
    return (
      <View className={styles.input_wrap}>
        <View className='at-row at-row__justify--between at-row__align--center'>
          <View className='at-col at-col-8'>
            {leftSide}
          </View>
          {right_side ? <View className={['at-col at-col-1 at-col--auto', styles.right_side]}>
            {right_side}
          </View> : ''}
        </View>
      </View>
    )
}