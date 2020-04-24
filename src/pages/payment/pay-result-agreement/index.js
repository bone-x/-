import Taro, {Component} from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import HeadBar from 'components/head-bar'
import styles from './index.module.scss'

export default class PayResultAgreement extends Component {

  agree () {
    // let {orderId} = this.$router.params
    // Taro.navigateTo({url: 'pages/payment/pay-result-agreement/index?agree=' + 1 + '&orderId=' + orderId})
    Taro.navigateBack()
  }
  render () {
    let title = this.$router.params.title

    // const scrollStyle = {
    //   height: this.props.screenHeight - 88 - 98 + 'px'
    // }
    // console.log(this.props.screenHeight)
    // console.log(Taro.pxTransform(this.props.screenHeight - 88 - 98))

    return (
      <View className={styles.wrap}>
        <HeadBar title={title ? title : "支付结果"} />
        <ScrollView className={styles.scrollView} scrollY={true}>
          <View className={styles.cell}>
            <Text className={styles.item}>
              欢迎使用行家，为了保障您的权益，请在使用行家服务之前，详细阅读此服务协议（以下简称“本协议”）所有内容，特别是加粗部分。<br/>
              本协议内容包括协议正文、本协议下述协议明确援引的其他协议、上海恒企教育培训有限公司（以下简称“恒企”）已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。除另行明确声明外，您使用行家服务均受本协议约束。
            </Text>
          </View>
          <View className={styles.cell}>
            <Text className={styles.item}>一、定义</Text>
            <Text className={styles.item}>
              行家指恒企所有和经营的有关教育、学习等数字内容聚合、管理和分发的平台产品，旨在为用户提供教学内容的生成、传播和消费服务。
            </Text>
          </View>
          <View className={styles.cell}>
            <Text className={styles.item}>二、行家服务协议的修订</Text>
            <Text className={styles.item}>
            本协议及相关服务条款如由于业务发展需要进行修订的，将在行家公布。您可前往行家官网查阅最新版协议条款。在恒企修改上述条款后，如果您不接受修改后的条款，您可以选择终止使用行家服务。您继续使用恒企平台产品的行为将被视为接受修改后的协议。
            </Text>
          </View>
          <View className={styles.cell}>
            <Text className={styles.item}>三、帐号使用规则</Text>
            <Text className={styles.item}>
              1、您可浏览行家上的课程信息，如您希望学习该课程，您需先登录您的帐号，或注册行家帐号并登录。如您选用其他第三方帐号登录行家的，您应保证第三方帐号的稳定性、真实性以及可用性，如因第三方帐号原因（如第三方帐号被封号）致使您无法登录行家的，您应与第三方帐号的所属公司联系。您在学习课程时登录的帐号是行家确认您身份的唯一依据。
            </Text>
            <Text className={styles.item}>
              2、您确认：您是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织，有能力对您使用使用行家服务的一切行为独立承担责任。若您不具备前述主体资格，恒企依据法律规定或本协议约定要求您承担责任时，有权向您的监护人追偿。
            </Text>
            <Text className={styles.item}>
              3、您在使用行家服务时填写、登录、使用的帐号名称、头像等帐号信息资料应遵守法律法规、社会主义制度、国家利益、公民合法权益、公共秩序、社会道德风尚和信息真实性等七条底线，不得在帐号信息资料中出现违法和不良信息，且您保证在填写、登录、使用帐号信息资料时，不得有以下情形:
            </Text>

            <Text className={styles.itemLi}>
              （1）违反宪法或法律法规规定的；
            </Text>
            <Text className={styles.itemLi}>
              （2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
            </Text>
            <Text className={styles.itemLi}>
              （3）损害国家荣誉和利益的，损害公共利益的；
            </Text>
            <Text className={styles.itemLi}>
              （4）煽动民族仇恨、民族歧视，破坏民族团结的；
            </Text>
            <Text className={styles.itemLi}>
              （5）破坏国家宗教政策，宣扬邪教和封建迷信的；
            </Text>
            <Text className={styles.itemLi}>
              （6）散布谣言，扰乱社会秩序，破坏社会稳定的；
            </Text>
            <Text className={styles.itemLi}>
              （7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯
            </Text>
          </View>
        </ScrollView>
        <View className={styles.footer}>
          <AtButton onClick={this.agree.bind(this)} className={styles.button} type='primary'>已阅读，并且同意协议内容</AtButton>
        </View>
      </View>
    )
  }
}