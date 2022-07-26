<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profileObj.photo"
            @click="imageClickFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="profileObj.name"
        @click="nameClickFn"
      />
      <van-cell
        title="生日"
        is-link
        :value="profileObj.birthday"
        @click="birthClickFn"
      />
    </van-cell-group>
    <!-- 姓名修改弹窗 -->
    <van-dialog
      v-model="show"
      title="标题"
      show-cancel-button
      :before-close="beforeCloseFn"
    >
      <input type="text" v-fofo v-model="inputUserName" />
    </van-dialog>
    <!-- 时间选择器 -->
    <van-popup
      v-model="dateTimePickerShow"
      position="bottom"
      :style="{ height: '50%' }"
      round
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateTimePickerCancelFn"
        @confirm="confirmFn"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  userProfileAPI,
  updateUserPhotoAPI,
  updateUserProfileAPI
} from '@/api'
import Notify from '@/ui/Notify.js'
import { formatDate } from '@/utils/date.js'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      profileObj: {}, // 用户基本资料
      show: false, // 控制姓名修改输出框
      inputUserName: '', // 修改名字弹出框输入框绑定值
      minDate: new Date(1922, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(2021, 0, 17),
      dateTimePickerShow: false // 日期选择器弹出层显示/隐藏
    }
  },
  name: 'UserEdit',
  async created () {
    const res = await userProfileAPI()
    this.profileObj = res.data.data
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),
    // 文件选择事件
    async onFileChange (e) {
      if (e.target.files.length === 0) return
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0])
      const res = await updateUserPhotoAPI(theFd)
      this.profileObj.photo = res.data.data.photo
      this.SET_USERPHOTO(res.data.data.photo)
    },
    // 图片点击事件
    imageClickFn () {
      this.$refs.iptFile.click()
    },
    // 姓名点击事件
    nameClickFn () {
      this.show = true
      this.inputUserName = this.profileObj.name
    },
    // 姓名确认框关闭前回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          await updateUserProfileAPI({
            name: this.inputUserName
          })
          this.profileObj.name = this.inputUserName
          this.SET_USERNAME(this.inputUserName)
          done()
        } else {
          Notify({
            type: 'warning',
            message: '用户名只能是1~7位中英文数字组合'
          })
          done(false)
        }
      } else {
        done()
      }
    },
    // 生日点击事件
    birthClickFn () {
      this.dateTimePickerShow = true
      this.currentDate = new Date(this.profileObj.birthday)
    },
    // 日期选择器取消事件
    dateTimePickerCancelFn () {
      this.dateTimePickerShow = false
    },
    // 日期选择器完成事件
    async confirmFn () {
      await updateUserProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.profileObj.birthday = formatDate(this.currentDate)
      this.dateTimePickerShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/.van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
