<template>
  <div class="loginWrapper">
    <div class="loginCenter">
      <div class="logoImage" />

      <el-form class="loginform" ref="listFormRef" size="large" :model="listParams" :rules="formRules">
        <el-form-item prop="username" class="loginRow">
          <el-input :maxlength="50" placeholder="请输入账号" v-model.trim="listParams.username" :prefix-icon="User" class="inputBox" />
        </el-form-item>

        <el-form-item prop="password" class="loginRow">
          <el-input
            @keyup.enter="handleSubmit"
            placeholder="请输入密码"
            v-model.trim="listParams.password"
            :prefix-icon="Lock"
            class="inputBox"
            type="password"
            :maxlength="8"
          />
        </el-form-item>

        <el-checkbox v-model="remenber" label="记住密码" size="large" />

        <el-form-item class="loginRow">
          <el-button :disabled="dataLoading" :loading="dataLoading" class="loginBtn" type="primary" @click="handleSubmit">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { usePiniaStore } from "@/store";
import { login } from "./api";
import md5 from "js-md5";

const router = useRouter();

const { CommonStore, SysRoleStore } = usePiniaStore();

const defaultParams: User.LoginParams = {
  username: "",
  password: ""
};

const dataLoading = ref(false);

const remenber = ref(false);

const listFormRef = ref<FormInstance>();

const formRules = ref<FormRules>({
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码（8位字符，包含数字和小写字母）", trigger: "blur", pattern: /([0-9]|[a-z]){8}/ }]
});

const listParams = ref(defaultParams);

onMounted(() => {
  const loginParams = localStorage.getItem("LoginParams");
  if (loginParams) {
    let params: any = {};
    try {
      params = JSON.parse(loginParams);
    } catch (error) {
      params = {};
    }
    if (params.username && params.password) {
      listParams.value = { ...params };
      remenber.value = true;
    }
  }
});

/**
 * 登录
 */
function handleSubmit() {
  const formRef = listFormRef.value;
  if (!formRef) return;
  formRef.validate(async (valid: boolean) => {
    if (valid) {
      try {
        dataLoading.value = true;
        if (remenber.value) {
          localStorage.setItem("LoginParams", JSON.stringify(listParams.value));
        } else {
          localStorage.setItem("LoginParams", "");
        }
        const params: User.LoginParams = {
          username: listParams.value.username,
          password: md5(listParams.value.password).toUpperCase()
        };
        const response = await login(params);
        const data = response.data || {};
        const info = response.msg || "";
        setLoginData(data, info);
      } catch (error) {
        console.log(error);
      } finally {
        dataLoading.value = false;
      }
    }
  });
}

/**
 * 设置登录后用户数据
 */
function setLoginData(data: User.LoginResult, info: string) {
  // 正常保存数据和跳转
  if (data.token) {
    CommonStore.setToken(data.token);
    SysRoleStore.setRoleData(data);
  }
  router.replace({ name: "home" });
  ElMessage.success(info || "保存成功！");
}
</script>

<style lang="less" scoped>
.loginWrapper {
  // background-image: url("@/assets/images/login_background.jpg");
  background-color: #fff;
  background-image: linear-gradient(-55deg, rgba(21, 74, 142, 0.8), rgba(143, 187, 221, 0.5));
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .loginCenter {
    position: absolute;
    width: 964px;
    height: 532px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;

    .logoImage {
      // background-image: url("@/assets/images/login_logo.png");
      background-color: rgba(255, 255, 255, 0.3);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      width: 482px;
      height: 532px;
    }
    .loginform {
      width: 482px;
      height: 532px;
      padding: 80px 60px;
      box-sizing: border-box;
      background-color: #fff;
      .loginRow {
        margin-top: 30px;
      }
      .inputBox {
        :deep(.el-input__wrapper) {
          padding: 10px 0;
          box-shadow: none;
          border-radius: 0px;
          border-bottom: 1px solid #b3b3b3;
          font-size: 18px;
          color: #333;
          &.is-focus {
            border-bottom-color: #006eff;
          }
        }
      }
      .loginBtn {
        width: 100%;
        height: 48px;
        border-radius: 0px;
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        font-size: 16px;
      }
    }
  }
}
</style>
