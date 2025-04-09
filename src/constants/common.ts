import { DoctorItem } from '@/pages/DoctorList'
import Avatar1 from '@/assets/img/user/user1.jpg'
import Avatar2 from '@/assets/img/user/user2.jpg'
import Avatar3 from '@/assets/img/user/user3.jpg'
import Avatar4 from '@/assets/img/user/user4.jpg'
import Avatar5 from '@/assets/img/user/user5.jpg'
import Doctor1 from '@/assets/img/doctor/doctor1.jpg'
import Doctor2 from '@/assets/img/doctor/doctor2.jpg'
import Doctor3 from '@/assets/img/doctor/doctor3.jpg'
import Doctor4 from '@/assets/img/doctor/doctor4.jpg'
import Doctor5 from '@/assets/img/doctor/doctor5.jpg'

export const HEADER_HEIGHT = 50

export const USER_AVATAR_URL = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5]

export const DOCTOR_LIST: DoctorItem[] = [
  {
    id: 1,
    name: '林澜',
    avatar: Doctor1,
    color: '#e9c2fe',
    style: '温柔倾听型',
    expertise: ['焦虑', '情绪调节', '自我认同'],
    description:
      '人本主义疗法，擅长倾听、焦点、情绪调节、自我认同，你不需要立刻变得更好，你现在的样子已经很得被理解'
  },
  {
    id: 2,
    name: '江行',
    avatar: Doctor2,
    color: ' #95d8fb',
    style: '理性分析型',
    expertise: ['职场压力', '思维困扰', '拖延'],
    description:
      '认知行为疗法（CBT），擅长倾听、积极应对、思维困扰，我们可以一起分析这种痛苦的想法，看看它是如何影响你的行为的。'
  },
  {
    id: 3,
    name: '洛尘',
    avatar: Doctor3,
    color: '#badd85',
    style: '灵性启发型',
    expertise: ['自我探索', '情绪创伤', '存在困扰'],
    description:
      '正念疗法 + ACT，思考你的不满意之处的原因，简单先学会与痛苦的自己和平相处。'
  },
  {
    id: 4,
    name: '苏桐',
    avatar: Doctor4,
    color: '#ff7676',
    style: '温和教练型',
    expertise: ['亲密关系', '情绪表达', '人际沟通'],
    description: '叙事疗法，如果我们把一个问题看做是段关系，会不会有新的理解？'
  },
  {
    id: 5,
    name: '黎晗',
    avatar: Doctor5,
    color: '#3d3d3d',
    style: '洞察深刻型',
    expertise: ['童年创伤', '反思情绪模式', '自我释放'],
    description:
      '精神分析，有时，你不是在回应现在的情境，而是在回应过去的伤口。'
  }
]
