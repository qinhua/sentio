export const PATH = {
  root: '/',
  comps: '/comps',
  login: '/login',
  welcome: '/welcome',
  completeInfo: '/complete-info',
  doctorList: '/doctor-list',
  chatList: '/chat-list',
  chatDetail: (doctorId?: number) =>
    `/chat-detail${doctorId ? '/' + doctorId : ''}`,
  courseList: '/course-list',
  profile: '/profile',
  editProfile: '/edit-profile'
}
