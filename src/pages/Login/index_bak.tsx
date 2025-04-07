// import React, { useState, useEffect } from 'react'
// import { Avatar } from '@/components/ui/avatar'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Checkbox } from '@/components/ui/checkbox'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Label } from '@/components/ui/label'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle
// } from '@/components/ui/dialog'
// import { useNavigate } from 'react-router-dom'
// import { PATH } from '@/constants/path'

// const Login: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [showProfileSetup, setShowProfileSetup] = useState(false)
//   const [isAgreementChecked, setIsAgreementChecked] = useState(false)
//   const [typingText, setTypingText] = useState('')
//   const [currentTextIndex, setCurrentTextIndex] = useState(0)
//   const [isTyping, setIsTyping] = useState(true)
//   const welcomeTexts = ['你好，我是 Sentio', '你的专属心理伙伴']
//   const typingSpeed = 150
//   const pauseTime = 2000
//   // Profile setup state
//   const [nickname, setNickname] = useState('')
//   const [gender, setGender] = useState('')
//   const [age, setAge] = useState('')
//   const [selectedAvatar, setSelectedAvatar] = useState(0)
//   const avatarOptions = [
//     'https://public.readdy.ai/ai/img_res/7c58f4b84ad03dfbe5b0837324a46233.jpg',
//     'https://public.readdy.ai/ai/img_res/5361b15b6145ccaab89945cec1bd423e.jpg',
//     'https://public.readdy.ai/ai/img_res/efeab7668ab04a2c3c83141bdd49df5c.jpg',
//     'https://public.readdy.ai/ai/img_res/4505ee251917448027c81b2fe0386121.jpg'
//   ]
//   const navigate = useNavigate()

//   // Typing effect
//   useEffect(() => {
//     if (!isTyping) return
//     const currentText = welcomeTexts[currentTextIndex]
//     if (typingText.length < currentText.length) {
//       const timeout = setTimeout(() => {
//         setTypingText(currentText.substring(0, typingText.length + 1))
//       }, typingSpeed)
//       return () => clearTimeout(timeout)
//     } else {
//       const timeout = setTimeout(() => {
//         setTypingText('')
//         setCurrentTextIndex((currentTextIndex + 1) % welcomeTexts.length)
//       }, pauseTime)
//       return () => clearTimeout(timeout)
//     }
//   }, [typingText, currentTextIndex, isTyping])
//   const handleEnterApp = () => {
//     setShowProfileSetup(true)
//   }
//   const handleCompleteProfile = () => {
//     if (!nickname || !gender || !age) return
//     setIsLoggedIn(true)
//     navigate(PATH.doctorList)
//   }
//   if (!isLoggedIn) {
//     return (
//       <div className="flex flex-col h-screen bg-white">
//         <div className="flex flex-col justify-between h-full px-6">
//           <div className="w-full max-w-md flex flex-col items-center mx-auto pt-10">
//             {/* Close button */}
//             <div className="self-end mt-4 mb-2">
//               <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
//                 <i className="fa fa-times text-xl"></i>
//               </button>
//             </div>
//             {/* Animated avatar */}
//             <div className="relative w-48 h-48 mb-8 overflow-hidden rounded-full bg-blue-100">
//               {[
//                 'https://public.readdy.ai/ai/img_res/87e9737cf82ce32d79b888a6305c4bf2.jpg',
//                 'https://public.readdy.ai/ai/img_res/6df508e6f5d920c31ec721cd5f1483a9.jpg',
//                 'https://public.readdy.ai/ai/img_res/f46ad8fac2d7880c86a20372540c2dac.jpg'
//               ].map((src, index) => (
//                 <img
//                   key={index}
//                   src={src}
//                   alt={`Sentio Avatar ${index + 1}`}
//                   className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
//                     index === Math.floor((Date.now() / 5000) % 3)
//                       ? 'opacity-100'
//                       : 'opacity-0'
//                   }`}
//                   style={{ animationDelay: `${index * 5}s` }}
//                 />
//               ))}
//             </div>
//             {/* Typing effect title */}
//             <div className="h-16 flex items-center justify-center mb-10">
//               <h1 className="text-2xl font-bold text-center">
//                 {typingText}
//                 <span className="animate-blink">|</span>
//               </h1>
//             </div>
//             {/* Login options */}
//             <div className="w-full space-y-4 px-4">
//               <Button className="w-full py-6 !rounded-button bg-black text-white flex items-center justify-center rounded-[50px]">
//                 <i className="fa fa-phone mr-2"></i>
//                 手机号登录
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full py-6 !rounded-button border-gray-300 flex items-center justify-center rounded-[50px]"
//                 onClick={() => {
//                   // Simulate Google OAuth authentication flow
//                   console.log('Initiating Google OAuth flow')
//                   // Show loading state
//                   const button = document.activeElement as HTMLButtonElement
//                   if (button) {
//                     const originalText = button.innerHTML
//                     button.innerHTML =
//                       '<i class="fa fa-spinner fa-spin mr-2"></i>授权中...'
//                     button.disabled = true
//                     // Simulate API call delay
//                     setTimeout(() => {
//                       // Always show profile setup
//                       console.log('New user detected, showing profile setup')
//                       setShowProfileSetup(true)
//                       // Reset button state
//                       button.innerHTML = originalText
//                       button.disabled = false
//                     }, 2000)
//                   }
//                 }}
//               >
//                 <i className="fa fa-google mr-2"></i>
//                 谷歌登录
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full py-6 !rounded-button border-gray-300 flex items-center justify-center rounded-[50px]"
//               >
//                 <i className="fa fa-apple mr-2"></i>
//                 Apple ID 登录
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={handleEnterApp}
//                 className="w-full py-6 !rounded-button border-gray-300 flex items-center justify-center rounded-[50px]"
//               >
//                 <i className="fa fa-arrow-right mr-2"></i>
//                 进入应用
//               </Button>
//             </div>
//           </div>
//           {/* Terms agreement positioned at bottom with 30px margin */}
//           <div className="w-full flex items-center justify-center pb-[30px]">
//             <Checkbox
//               id="agreement"
//               checked={isAgreementChecked}
//               onCheckedChange={checked =>
//                 setIsAgreementChecked(checked as boolean)
//               }
//               className="mr-2"
//             />
//             <label htmlFor="agreement" className="text-sm text-gray-600">
//               我已阅读并同意 Sentio 的
//               <a href="#" className="text-blue-500 mx-1">
//                 服务条款
//               </a>
//               和
//               <a href="#" className="text-blue-500 mx-1">
//                 隐私政策
//               </a>
//             </label>
//           </div>
//         </div>
//         {/* Profile setup page */}
//         {showProfileSetup && (
//           <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
//             <div className="flex justify-between items-center px-4 py-3 border-b">
//               <button
//                 onClick={() => setShowProfileSetup(false)}
//                 className="text-gray-500"
//               >
//                 <i className="fa fa-arrow-left text-lg"></i>
//               </button>
//               <h1 className="text-xl font-semibold">完善您的个人资料</h1>
//               <div className="w-8"></div> {/* Spacer for alignment */}
//             </div>
//             <div className="flex-1 overflow-auto px-6 py-8">
//               <div className="max-w-md mx-auto space-y-8">
//                 {/* Avatar selection */}
//                 <div className="space-y-4">
//                   <Label className="text-base font-medium block text-center">
//                     选择您的头像
//                   </Label>
//                   <div className="flex justify-center gap-6 py-4">
//                     {avatarOptions.map((avatar, index) => (
//                       <div
//                         key={index}
//                         onClick={() => setSelectedAvatar(index)}
//                         className={`cursor-pointer transition-all rounded-full ${
//                           selectedAvatar === index
//                             ? 'scale-110 ring-2 ring-primary ring-offset-2'
//                             : 'opacity-70'
//                         }`}
//                       >
//                         <img
//                           src={avatar}
//                           alt={`Avatar option ${index + 1}`}
//                           className="w-20 h-20 rounded-full object-cover"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 {/* Nickname */}
//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="nickname"
//                     className="text-base font-medium block"
//                   >
//                     昵称
//                   </Label>
//                   <Input
//                     id="nickname"
//                     value={nickname}
//                     onChange={e => setNickname(e.target.value)}
//                     placeholder="请输入您的昵称"
//                     className="rounded-lg py-6 px-4 text-base"
//                   />
//                 </div>
//                 {/* Gender */}
//                 <div className="space-y-3">
//                   <Label className="text-base font-medium block">性别</Label>
//                   <RadioGroup
//                     value={gender}
//                     onValueChange={setGender}
//                     className="flex justify-between px-4 py-2"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="male" id="male" />
//                       <Label htmlFor="male" className="text-base">
//                         男
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="female" id="female" />
//                       <Label htmlFor="female" className="text-base">
//                         女
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="other" id="other" />
//                       <Label htmlFor="other" className="text-base">
//                         保密
//                       </Label>
//                     </div>
//                   </RadioGroup>
//                 </div>
//                 {/* Age */}
//                 <div className="space-y-3">
//                   <Label htmlFor="age" className="text-base font-medium block">
//                     年龄
//                   </Label>
//                   <Input
//                     id="age"
//                     type="number"
//                     value={age}
//                     onChange={e => setAge(e.target.value)}
//                     placeholder="请输入您的年龄"
//                     className="rounded-lg py-6 px-4 text-base"
//                     min="1"
//                     max="120"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 border-t bg-white">
//               <Button
//                 onClick={handleCompleteProfile}
//                 disabled={!nickname || !gender || !age}
//                 className={`w-full py-6 !rounded-button text-white rounded-[50px] text-lg font-medium ${
//                   !nickname || !gender || !age
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-primary'
//                 }`}
//               >
//                 开始沟通
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return <></>
//   // This will use the existing code for the logged-in state
//   // which shows the psychologist selection page
//   // return (
//   //   <div className="flex flex-col h-screen bg-gray-50">
//   //     <div className="fixed top-0 w-full bg-white shadow-sm z-10 px-4 py-3">
//   //       <h1 className="text-xl font-semibold text-center">选择您的治疗师</h1>
//   //       <p className="text-sm text-gray-500 text-center mt-1">
//   //         {new Date().toLocaleDateString("en-US", {
//   //           year: "numeric",
//   //           month: "long",
//   //           day: "numeric",
//   //           weekday: "long",
//   //         })}
//   //       </p>
//   //     </div>
//   //     <div className="mt-20 mb-16 px-4">
//   //       <p className="text-center text-gray-600 mb-6">
//   //         我们的专业治疗师随时为您提供帮助。选择一位开始您的心理健康之旅。
//   //       </p>
//   //       {/* This part would use the existing code for displaying doctors */}
//   //       <div className="space-y-4 py-2">
//   //         {/* Doctor cards would be displayed here */}
//   //         <div className="text-center text-gray-500 py-8">
//   //           <i className="fa fa-spinner fa-spin text-2xl mb-2"></i>
//   //           <p>正在加载治疗师...</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //     <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 flex justify-around">
//   //       <div className="flex flex-col items-center text-primary">
//   //         <i className="fa fa-home text-xl"></i>
//   //         <span className="text-xs mt-1">首页</span>
//   //       </div>
//   //       <div className="flex flex-col items-center text-gray-500">
//   //         <i className="fa fa-calendar-alt text-xl"></i>
//   //         <span className="text-xs mt-1">预约</span>
//   //       </div>
//   //       <div className="flex flex-col items-center text-gray-500">
//   //         <i className="fa fa-book text-xl"></i>
//   //         <span className="text-xs mt-1">课程</span>
//   //       </div>
//   //       <div className="flex flex-col items-center text-gray-500">
//   //         <i className="fa fa-user text-xl"></i>
//   //         <span className="text-xs mt-1">我的</span>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
// }
// export default Login
