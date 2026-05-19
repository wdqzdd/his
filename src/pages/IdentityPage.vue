<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Check, Monitor, OfficeBuilding, Star, User } from '@element-plus/icons-vue';
import { saveSelectedWorkspace } from '../data/session';
import { identity, stationMenus, userWorkstations } from '../data/workstations';
import type { UserWorkspace } from '../types';

interface WorkIdentity {
  id: string;
  title: string;
  hospital: string;
  campus: string;
  department: string;
  domain: string;
  specialty: string;
  workspace: string;
  role: string;
  patientScope: string;
  isDefault?: boolean;
}

const router = useRouter();
const selectedId = ref(userWorkstations[0]?.label ?? '科室看板');

const scopeByWorkspace: Record<string, string> = {
  科室看板: '今日透析、预警危急值、设备水质、库存风险和跨工作站待办',
  员工主页: '本人待办、消息、签名、预警、审核和分工分管任务',
  导诊台: '建档签约、归属分配、预约审核、排班排床和随访服务',
  医生站: '本人分管患者、诊疗记录、医嘱处方、预警处理和CQI任务',
  护士站: '本护理组患者、核对执行、治疗记录、护理审核和归档任务',
  检验科工作站: '检验医嘱、标本、结果录入、危急值和报告归档',
  药房站: '药师审核、调配核对、发药退药、禁忌提示和GCP药物协同',
  药品耗材与费用管理: '药耗库存、自动消耗、批号追溯、费用明细和欠费提醒',
  技师与设备站: '机位设备、水处理、巡检维修、消毒记录和设备放行',
  医务医事站: '值班排班、护理组别、科室资源、专家团队和医护分工',
  行政人事站: '员工资料、培训证书、GCP授权、岗位资质和排班资格',
  居家个人主页: '居家待办、健康档案、报告上传、评估、事件和在线签署',
  基础数据中心: '医疗字典、医嘱、药品、耗材、费用、检验和模板基础资料',
  规则配置与质量改进: '提醒规则、预警方案、CQI方案、数据流转和执行日志',
  统计报表: '患者、透析、机位、检验、质控、感控、费用和院区指标',
  感控管理: '感控检查、整改复核、制度培训、隔离透析和统计追溯',
  接口与设备集成管理: 'HIS/LIS/PACS/EMR接口、设备联机、同步日志和失败重试',
  '药物临床研究 / CRC站': '项目、受试者、SoA访视、AE、研究药物、标本链和审计',
  系统管理: '用户、角色权限、组织机构、工作身份、菜单、日志和参数',
};

function toWorkIdentity(workspace: UserWorkspace, index: number): WorkIdentity {
  return {
    id: workspace.label,
    title: workspace.label,
    hospital: identity.hospital,
    campus: identity.campus,
    department: workspace.department,
    domain: identity.domain,
    specialty: identity.specialty,
    workspace: workspace.label,
    role: workspace.role,
    patientScope: scopeByWorkspace[workspace.label] ?? `${workspace.department} / ${workspace.role}授权范围`,
    isDefault: index === 0,
  };
}

const identities = computed(() => userWorkstations.map(toWorkIdentity));

const selectedIdentity = computed(() => identities.value.find((item) => item.id === selectedId.value) ?? identities.value[0]);
const summary = computed(() =>
  [
    selectedIdentity.value.hospital,
    selectedIdentity.value.campus,
    selectedIdentity.value.department,
    selectedIdentity.value.domain,
    selectedIdentity.value.specialty,
    selectedIdentity.value.workspace,
  ].join(' / '),
);

function enterSystem(): void {
  const workspace = selectedIdentity.value.workspace;
  const firstMenu = stationMenus[workspace]?.[0]?.index ?? 'board-home';
  saveSelectedWorkspace(workspace);
  router.push(`/workspace/${encodeURIComponent(workspace)}/${firstMenu}`);
}
</script>

<template>
  <main class="identity-page">
    <section class="identity-hero">
      <div>
        <span class="identity-kicker">工作身份选择</span>
        <h1>选择本次进入系统的已授权身份</h1>
        <p>身份由系统管理员预先配置。这里只展示并选择，不支持临时编辑机构、科室、专科或岗位。</p>
      </div>
      <el-button size="large" type="primary" :icon="Check" @click="enterSystem">进入系统</el-button>
    </section>

    <section class="identity-content">
      <el-row :gutter="16">
        <el-col :xs="24" :lg="16">
          <el-card class="quick-identity-card" shadow="never">
            <template #header>
              <div class="section-title">
                <strong>我的授权身份</strong>
                <span>选择一个身份进入，对应菜单和数据权限会自动加载</span>
              </div>
            </template>

            <div class="authorized-identity-list">
              <button
                v-for="item in identities"
                :key="item.id"
                type="button"
                :class="['authorized-identity-item', { active: selectedId === item.id }]"
                @click="selectedId = item.id"
              >
                <div class="identity-item-main">
                  <el-icon><Star /></el-icon>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.hospital }} / {{ item.campus }} / {{ item.department }}</p>
                  </div>
                </div>
                <div class="identity-item-meta">
                  <el-tag v-if="item.isDefault" type="primary" effect="dark">默认</el-tag>
                  <el-tag>{{ item.workspace }}</el-tag>
                  <el-tag type="success">{{ item.role }}</el-tag>
                  <el-tag type="info">{{ item.specialty }}</el-tag>
                </div>
                <p class="identity-scope">{{ item.patientScope }}</p>
              </button>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="8">
          <el-card class="identity-preview-card" shadow="never">
            <template #header>
              <div class="section-title">
                <strong>身份详情</strong>
                <span>只读展示</span>
              </div>
            </template>
            <div class="identity-avatar">
              <el-avatar :size="58">医</el-avatar>
              <div>
                <h3>{{ selectedIdentity.workspace }}</h3>
                <p>{{ selectedIdentity.role }}</p>
              </div>
            </div>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="医院">{{ selectedIdentity.hospital }}</el-descriptions-item>
              <el-descriptions-item label="院区">{{ selectedIdentity.campus }}</el-descriptions-item>
              <el-descriptions-item label="科室">{{ selectedIdentity.department }}</el-descriptions-item>
              <el-descriptions-item label="业务域">{{ selectedIdentity.domain }}</el-descriptions-item>
              <el-descriptions-item label="专科">{{ selectedIdentity.specialty }}</el-descriptions-item>
              <el-descriptions-item label="身份">{{ summary }}</el-descriptions-item>
            </el-descriptions>
            <div class="identity-permissions">
              <el-tag :icon="Monitor" effect="plain">菜单已匹配</el-tag>
              <el-tag :icon="User" effect="plain">患者范围已限定</el-tag>
              <el-tag :icon="OfficeBuilding" effect="plain">统计口径已切换</el-tag>
            </div>
            <el-button class="identity-enter" size="large" type="primary" @click="enterSystem">
              进入 {{ selectedIdentity.workspace }}
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </main>
</template>
