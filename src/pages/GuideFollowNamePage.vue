<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentChecked, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type FollowAlias = {
  patient: string;
  alias: string;
  usage: string;
  riskRemark: string;
  source: string;
  status: string;
  reviewer: string;
  updatedAt: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const convertDialogVisible = ref(false);
const exitDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<FollowAlias | null>(null);

const rows: FollowAlias[] = [
  { patient: '王建国 / P20260510001', alias: '王叔', usage: '居家任务、护士宣教、短信提醒', riskRemark: '左前臂内瘘，家属常代办', source: '签约服务', status: '已启用', reviewer: '导诊王敏', updatedAt: '2026-05-10 09:20', nextAction: '随访提醒使用' },
  { patient: '李秀兰 / P20260510002', alias: '李阿姨', usage: '导管护理随访', riskRemark: '青霉素过敏待确认', source: '联系人维护', status: '待复核', reviewer: '责任护士赵玲', updatedAt: '2026-05-10 09:35', nextAction: '护士复核' },
  { patient: '赵明 / P20260510003', alias: '赵先生-隔离', usage: '隔离透析提醒', riskRemark: '乙肝隔离标识', source: '签约服务', status: '已启用', reviewer: '感控护士', updatedAt: '2026-05-10 10:05', nextAction: '隔离预约引用' },
  { patient: '陈志强 / P20260510004', alias: '陈老', usage: '急诊临时透析', riskRemark: '头孢过敏', source: '患者建档', status: '草稿', reviewer: '导诊李倩', updatedAt: '2026-05-10 10:40', nextAction: '签约后复核' },
  { patient: '周萍 / P20260510006', alias: '周姐', usage: '腹透转血透随访', riskRemark: '造影剂过敏', source: '患者建档', status: '待复核', reviewer: '医务张洁', updatedAt: '2026-05-10 11:20', nextAction: '复核启用' },
  { patient: '郑军 / P20260510007', alias: '郑先生', usage: '异地医保提醒', riskRemark: '备案未完成', source: '签约服务', status: '停用', reviewer: '导诊王敏', updatedAt: '2026-05-10 13:05', nextAction: '医保通过后启用' },
  { patient: '韩梅 / P20260510008', alias: '韩女士', usage: '健康档案、报告上传', riskRemark: '无', source: '签约服务', status: '已启用', reviewer: '导诊陈洁', updatedAt: '2026-05-10 13:35', nextAction: '患者端展示' },
  { patient: '林建平 / P20260510009', alias: '林先生-导管', usage: '感控宣教、导管随访', riskRemark: '导管感染风险', source: '感控协管', status: '待复核', reviewer: '感控护士', updatedAt: '2026-05-10 14:10', nextAction: '感控复核' },
  { patient: '孙丽 / P20260510010', alias: '孙女士', usage: '急诊透析联系', riskRemark: '临时透析', source: '患者建档', status: '草稿', reviewer: '导诊李倩', updatedAt: '2026-05-10 15:00', nextAction: '身份核验' },
  { patient: '马强 / P20260510011', alias: '马先生-夜间', usage: '夜间透析提醒', riskRemark: '夜间班优先', source: '转组协管', status: '已启用', reviewer: '医务张洁', updatedAt: '2026-05-10 16:10', nextAction: '夜间排班引用' },
];

const activeTables = ['patient_follow_alias', 'patient_master', 'patient_contract', 'sys_audit_log'];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === '已启用') return 'success';
  if (status === '停用') return 'danger';
  if (status.includes('待') || status === '草稿') return 'warning';
  return 'info';
}

function openEdit(row?: FollowAlias): void {
  selected.value = row ?? rows[0];
  editDialogVisible.value = true;
}

function openReview(row: FollowAlias): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openConvert(row: FollowAlias): void {
  selected.value = row;
  convertDialogVisible.value = true;
}

function openExit(row: FollowAlias): void {
  selected.value = row;
  exitDialogVisible.value = true;
}

function openTrace(row: FollowAlias): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="guide-desk-page">
    <el-card class="guide-work-card" shadow="never">
      <template #header>
        <div class="guide-work-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>维护患者在随访、宣教、短信、居家端和风险提示中的展示名称，避免医护沟通和患者端提醒混乱。</p>
          </div>
          <div class="guide-actions">
            <el-button type="primary" :icon="CircleCheck" @click="openEdit()">新增随访名称</el-button>
            <el-button :icon="DocumentChecked" @click="openConvert(rows[0])">转换名称</el-button>
            <el-button :icon="DocumentChecked" @click="openReview(rows[1])">复核启用</el-button>
          </div>
        </div>
      </template>

      <el-form class="guide-filter" inline>
        <el-form-item label="关键词"><el-input placeholder="患者、随访名称、风险备注" clearable /></el-form-item>
        <el-form-item label="用途"><el-select placeholder="全部用途" clearable><el-option label="居家任务" value="home" /><el-option label="护士宣教" value="education" /><el-option label="隔离提醒" value="isolation" /><el-option label="感控协管" value="infection" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="草稿" value="草稿" /><el-option label="待复核" value="待复核" /><el-option label="已启用" value="已启用" /><el-option label="停用" value="停用" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="patient" label="患者" min-width="170" fixed="left" />
        <el-table-column prop="alias" label="随访名称" min-width="130" />
        <el-table-column prop="usage" label="使用场景" min-width="210" />
        <el-table-column prop="riskRemark" label="风险备注" min-width="165" />
        <el-table-column prop="source" label="来源" width="110" />
        <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reviewer" label="复核人" width="115" />
        <el-table-column prop="updatedAt" label="更新时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">维护</el-button>
            <el-button link @click="openConvert(row)">转换</el-button>
            <el-button link type="danger" @click="openExit(row)">退出</el-button>
            <el-button link @click="openReview(row)">复核</el-button>
            <el-button link @click="openTrace(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="随访名称维护" width="620px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="随访名称"><el-input :model-value="selected?.alias" placeholder="请输入患者端和随访中展示的称呼" /></el-form-item>
        <el-form-item label="使用场景"><el-checkbox-group model-value="home"><el-checkbox-button label="home">居家任务</el-checkbox-button><el-checkbox-button label="education">护士宣教</el-checkbox-button><el-checkbox-button label="sms">短信提醒</el-checkbox-button><el-checkbox-button label="risk">风险提示</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="风险备注"><el-input type="textarea" :rows="3" :model-value="selected?.riskRemark" placeholder="导管、隔离、过敏、家属代办等提醒" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('随访名称已保存，等待复核启用')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="随访名称复核" width="560px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="复核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">启用</el-radio-button><el-radio-button label="return">退回修改</el-radio-button><el-radio-button label="stop">停用</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录名称规范性、风险备注和退回原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('随访名称复核结果已写入审计')">提交复核</el-button></template>
    </el-dialog>

    <el-dialog v-model="convertDialogVisible" title="转换随访名称" width="600px">
      <el-form label-width="112px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="原随访名称"><el-input :model-value="selected?.alias" disabled /></el-form-item>
        <el-form-item label="新随访名称"><el-input placeholder="请输入转换后的随访名称" /></el-form-item>
        <el-form-item label="生效范围"><el-checkbox-group model-value="home"><el-checkbox-button label="home">居家端</el-checkbox-button><el-checkbox-button label="education">宣教</el-checkbox-button><el-checkbox-button label="sms">短信</el-checkbox-button><el-checkbox-button label="report">健康档案</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="转换原因"><el-input type="textarea" :rows="3" placeholder="记录患者要求、风险标识变化、家属代办或院区转入原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="convertDialogVisible = false">取消</el-button><el-button type="primary" @click="convertDialogVisible = false; submitAction('随访名称转换已提交，待复核后生效')">提交转换</el-button></template>
    </el-dialog>

    <el-dialog v-model="exitDialogVisible" title="退出随访名称" width="560px">
      <el-alert type="warning" show-icon :closable="false" title="退出随访名称后，患者端展示、短信提醒和随访任务将停止引用该名称。" />
      <el-form class="dialog-form" label-width="112px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="随访名称"><el-input :model-value="selected?.alias" disabled /></el-form-item>
        <el-form-item label="退出原因"><el-select placeholder="请选择"><el-option label="患者退出服务" value="exit" /><el-option label="名称合并转换" value="merge" /><el-option label="隐私要求" value="privacy" /><el-option label="错误创建" value="wrong" /></el-select></el-form-item>
        <el-form-item label="交接说明"><el-input type="textarea" :rows="3" placeholder="记录后续引用名称、未完成任务和通知范围" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="exitDialogVisible = false">取消</el-button><el-button type="danger" @click="exitDialogVisible = false; submitAction('随访名称退出已提交，待复核后停用')">提交退出</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="随访名称追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 09:20" type="primary">创建随访名称：{{ selected?.alias }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:30">调整使用场景和风险备注</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:40" type="success">复核启用，同步居家端和随访提醒</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
