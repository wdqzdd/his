<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CircleCheck, Lock, Monitor, User } from '@element-plus/icons-vue';
import type { LoginMethod } from '../types';

const router = useRouter();
const loginMethod = ref<LoginMethod>('account');
const loginForm = ref({
  account: 'admin',
  password: '********',
  phone: '13800001024',
  code: '628109',
});
const loginTitle = computed(() => {
  if (loginMethod.value === 'phone') return '手机验证码登录';
  if (loginMethod.value === 'face') return '人脸识别登录';
  return '账号密码登录';
});

const platformHighlights = [
  { label: '身份授权', hint: '按医院、院区、科室、角色加载权限' },
  { label: '审计追溯', hint: '登录、切换身份、关键操作留痕' },
  { label: '专科闭环', hint: '覆盖血液净化临床与管理协同' },
];

const stations = ['科室看板', '导诊台', '医生站', '护士站', '技师与设备站', '系统管理'];

function submitLogin(): void {
  router.push('/identity');
}
</script>

<template>
  <el-container class="login-page">
    <section class="login-left">
      <header class="login-brand">
        <div class="brand-mark" aria-label="血液净化专科系统标识">
          <span></span>
        </div>
        <div>
          <h1>血液净化专科系统</h1>
          <p>Hemodialysis Specialty Platform</p>
        </div>
      </header>

      <div class="login-showcase">
        <div class="showcase-copy">
          <h3>面向血透中心的专业医疗工作入口</h3>
        </div>

        <div class="hospital-login-panel">
          <div class="hospital-card-header">
            <div>
              <strong>授权人员专用入口</strong>
              <span>Identity-based secure access</span>
            </div>
            <el-icon><Lock /></el-icon>
          </div>

          <div class="hospital-scene" aria-label="医院专科平台视觉标识">
            <div class="hospital-building">
              <div class="hospital-cross"></div>
              <span v-for="item in 12" :key="item"></span>
            </div>
            <div class="dialysis-line"></div>
            <div class="system-entry-card">
              <strong>血液净化专科</strong>
              <small>工作身份选择后进入</small>
            </div>
          </div>

          <div class="security-feature-grid">
            <div v-for="item in platformHighlights" :key="item.label" class="security-feature-card">
              <span>{{ item.label }}</span>
              <small>{{ item.hint }}</small>
            </div>
          </div>

          <div class="console-workflow">
            <div class="workflow-step active">
              <span>01</span>
              <strong>登录认证</strong>
            </div>
            <div class="workflow-step active">
              <span>02</span>
              <strong>身份选择</strong>
            </div>
            <div class="workflow-step">
              <span>03</span>
              <strong>工作站进入</strong>
            </div>
            <div class="workflow-step">
              <span>04</span>
              <strong>审计留痕</strong>
            </div>
          </div>
        </div>

        <div class="station-strip">
          <span v-for="station in stations" :key="station">{{ station }}</span>
        </div>
      </div>
      <footer>Copyright 血液净化专科系统 All rights reserved.</footer>
    </section>

    <section class="login-right">
      <el-card class="login-card" shadow="never">
        <div class="login-card-header">
          <h2>{{ loginTitle }}</h2>
          <p>登录后选择已授权工作身份，系统自动进入对应工作站。</p>
        </div>

        <el-tabs v-model="loginMethod" stretch>
          <el-tab-pane label="账号密码" name="account">
            <el-form :model="loginForm" class="login-form">
              <el-form-item>
                <el-input v-model="loginForm.account" size="large" :prefix-icon="User" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="loginForm.password" size="large" type="password" show-password :prefix-icon="Lock" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="手机登录" name="phone">
            <el-form :model="loginForm" class="login-form">
              <el-form-item>
                <el-input v-model="loginForm.phone" size="large" :prefix-icon="User" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="loginForm.code" size="large">
                  <template #append>
                    <el-button>发送</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="人脸识别" name="face">
            <div class="face-panel">
              <el-icon :size="64"><Monitor /></el-icon>
              <strong>请面向院内终端摄像头</strong>
              <p>识别成功后仍记录员工账号、终端、时间和工作身份。</p>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="login-tool-row">
          <el-checkbox>记住账号</el-checkbox>
          <el-button class="forgot-link" link type="primary">忘记密码</el-button>
        </div>

        <el-button class="login-submit" type="primary" size="large" @click="submitLogin">登录并选择身份</el-button>

        <el-divider>其他方式登录</el-divider>
        <div class="quick-login">
          <el-button link :icon="User" @click="loginMethod = 'phone'">手机登录</el-button>
          <el-button link :icon="Monitor" @click="loginMethod = 'face'">人脸识别</el-button>
        </div>

        <div class="login-security-note">
          <strong>安全提示</strong>
          <span>请使用本人账号登录，离开院内终端前及时退出系统。</span>
        </div>
      </el-card>
    </section>
  </el-container>
</template>
