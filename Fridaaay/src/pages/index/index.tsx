import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const NOW = new Date()
const DAY = WEEK[NOW.getDay()]
const [MONTH, DATE] = [NOW.getMonth()+1, NOW.getDate()]
const DATE_STRING = `${MONTH}月\n${DATE}日`

const animationData = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 0.3,
  timingFunction: "linear",
  delay: 0
})

/* --- Can Be Customized --- */
const TOPICS = [
  "5618c159add4471100150637", // 浴室沉思
  "557ed045e4b0a573eb66b751", // 无用但有趣的冷知识
  "5a82a88df0eddb00179c1df7", // 今日烂梗
  "572c4e31d9595811007a0b6b", // 弱智金句病友会
  "56d177a27cb3331100465f72", // 今日金句
  "5aa21c7ae54af10017dc93f8", // 一个想法不一定对
]
/* --- EOF --- */

export default class Index extends Component {

  config: Config = {
    navigationBarTitleText: '今儿周五'
  }

  constructor () {
    super(...arguments)
    this.setState({
      todayWeekDay: DAY,
      todayDateString: DATE_STRING,
      topicContent: "",
      topicAuthor: ""
    })
  }

  componentWillMount () {
    this.fetchJikeTopic()
  }

  fetchJikeTopic () {
    let topicIndex = Math.floor(Math.random()*TOPICS.length)

    var that = this
    Taro.request({
        url: "https://app.jike.ruguoapp.com/1.0/squarePosts/list",
        header: {
          'content-type': 'application/json'
        },
        method: "POST",
        data: {
          "topicId": TOPICS[topicIndex],
          "limit": 20
        }
    })
    .then(res => {
      let result = res.data.data

      let contentIndex = Math.floor(Math.random()*result.length)
      let topic = "—— " + result[contentIndex].topic.content
      let content = result[contentIndex].content
      let picture = result[contentIndex].pictures.length > 0 ? result[contentIndex].pictures[0].smallPicUrl : ""
      let user = result[contentIndex].user.screenName

      if (content === "") {
        return
      }
      
      that.setState({
        topicContent: content,
        topicAuthor: topic,
        topicPicture: picture,
        topiocUser: user,
      })

      animationData.opacity(0.6).step()
      that.setState({
        animation: animationData.export()
      })

      setTimeout(function() {
        animationData.opacity(1.0).step()
        that.setState({
          animation: animationData.export()
        })
      }.bind(that), 0.6);
    })
  }

  onShareAppMessage() {
    return {
      title: "今儿周五吗",
      path: "pages/index/index"
    }
  }

  render () {
    return (
      <View className='container'>
        <View className="week">
          <View className="week-box">
            <View className="wd">
              <Text className="week-week">{todayWeekDay}</Text>
              <Text className="week-day">{todayDateString}</Text>
            </View>
            <View className="glass">
              <View className="gogo">
                <Text className="fofo">🔍</Text>
              </View>
            </View>
          </View>
          <View className="week-all">
            <View className="friday">
              <Text className="qustion">今天是不是『周五』？</Text>
            </View>
            <View className="answer-box">
              <Text className="answer">{todayWeekDay == "Friday" ? "是" : "不是"}</Text>
            </View>
          </View>
        </View>
        <View animation="{{animation}}" className="topic" onClick={this.fetchJikeTopic}>
          <Text className="content">{topicContent}</Text>
          <Text className="author">{topicAuthor}</Text>
        </View>
        <View className="powered">
          <Text>Powered by jikeapp</Text>
        </View>
      </View>
    )
  }
}

