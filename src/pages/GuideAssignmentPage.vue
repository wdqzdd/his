<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentChecked, Search, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type AssignmentRecord = {
  patient: string;
  contractStatus: string;
  hospital: string;
  department: string;
  expertTeam: string;
  doctor: string;
  nurse: string;
  nurseGroup: string;
  bedIntent: string;
  shareScope: string;
  status: string;
  owner: string;
  nextAction: string;
};

const assignmentDrawerVisible = ref(false);
const transferDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<AssignmentRecord | null>(null);

const rows: AssignmentRecord[] = [
  { patient: '王建国 / P20260510001', contractStatus: '已签约', hospital: '总院', department: '血液净化中心', expertTeam: '王主任团队', doctor: '张明', nurse: '周敏', nurseGroup: 'A区一组', bedIntent: 'A08', shareScope: '医生站、护士站、居家端', status: '已分配', owner: '导诊王敏', nextAction: '发起治疗申请' },
  { patient: '李秀兰 / P20260510002', contractStatus: '待续约', hospital: '总院', department: '肾内科', expertTeam: '血管通路团队', doctor: '陈宁', nurse: '赵玲', nurseGroup: 'B区二组', bedIntent: 'B12', shareScope: '医生站、护士站', status: '待复核', owner: '医务张洁', nextAction: '复核归属' },
  { patient: '赵明 / P20260510003', contractStatus: '已签约', hospital: '东院', department: '隔离透析区', expertTeam: '隔离透析团队', doctor: '张明', nurse: '孙涛', nurseGroup: '隔离组', bedIntent: 'I03', shareScope: '隔离透析团队', status: '已分配', owner: '导诊陈洁', nextAction: '隔离预约' },
  { patient: '陈志强 / P20260510004', contractStatus: '草稿', hospital: '总院', department: '急诊透析', expertTeam: '急诊透析团队', doctor: '王主任', nurse: '周敏', nurseGroup: '急诊组', bedIntent: 'E02', shareScope: '医务医事、护士站', status: '待分配', owner: '导诊李倩', nextAction: '补齐签约后分配' },
  { patient: '周萍 / P20260510006', contractStatus: '待复核', hospital: '西院', department: '血液净化中心', expertTeam: '腹透转血透团队', doctor: '陈宁', nurse: '孙涛', nurseGroup: 'C区一组', bedIntent: 'C06', shareScope: '医生站、护士站、居家端', status: '待复核', owner: '医务张洁', nextAction: '确认机位' },
  { patient: '郑军 / P20260510007', contractStatus: '待医保核验', hospital: '总院', department: '血液净化中心', expertTeam: '王主任团队', doctor: '张明', nurse: '周敏', nurseGroup: 'A区二组', bedIntent: 'A12', shareScope: '医生站、导诊台', status: '待分配', owner: '导诊王敏', nextAction: '医保通过后启用' },
  { patient: '韩梅 / P20260510008', contractStatus: '已签约', hospital: '东院', department: '血液净化中心', expertTeam: '刘主任团队', doctor: '刘主任', nurse: '赵玲', nurseGroup: 'D区一组', bedIntent: 'D03', shareScope: '医生站、护士站、居家端', status: '已分配', owner: '导诊陈洁', nextAction: '预约申请' },
  { patient: '林建平 / P20260510009', contractStatus: '待复核', hospital: '总院', department: '血液净化中心', expertTeam: '导管护理团队', doctor: '王主任', nurse: '孙涛', nurseGroup: 'B区一组', bedIntent: 'B07', shareScope: '医生站、护士站、感控', status: '协管中', owner: '感控护士', nextAction: '感控复核' },
  { patient: '孙丽 / P20260510010', contractStatus: '草稿', hospital: '总院', department: '急诊透析', expertTeam: '急诊透析团队', doctor: '陈宁', nurse: '周敏', nurseGroup: '急诊组', bedIntent: 'E04', shareScope: '急诊透析团队', status: '待分配', owner: '导诊李倩', nextAction: '身份核验' },
  { patient: '马强 / P20260510011', contractStatus: '已签约', hospital: '总院', department: '血液净化中心', expertTeam: '夜间透析团队', doctor: '张明', nurse: '赵玲', nurseGroup: '夜间组', bedIntent: 'N02', shareScope: '医生站、护士站', status: '转组待复核', owner: '医务张洁', nextAction: '转组复核' },
];

const activeTables = ['patient_assignment', 'medical_team', 'nurse_group', 'bed_resource', 'assignment_change_log'];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === '已分配') return 'success';
  if (status.includes('待') || status.includes('转组')) return 'warning';
  if (status.includes('草稿')) return 'info';
  return 'info';
}

function openAssignment(row?: AssignmentRecord): void {
  selected.value = row ?? rows[0];
  assignmentDrawerVisible.value = true;
}

function openTransfer(row: AssignmentRecord): void {
  selected.value = row;
  transferDialogVisible.value = true;
}

function openTrace(row: AssignmentRecord): void {
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
            <p>将已签约患者分配到随访医院、科室、专家团队、主诊医生、责任护士、护理组和机位意向，并同步医生站与护士站责任患者。</p>
          </div>
          <div class="guide-actions">
            <el-button type="primary" :icon="UserFilled" @click="openAssignment()">分配责任团队</el-button>
            <el-button :icon="CircleCheck" @click="openTransfer(rows[0])">转组/协管</el-button>
            <el-button :icon="DocumentChecked" @click="openTrace(rows[0])">变更追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="guide-filter" inline>
        <el-form-item label="关键词"><el-input placeholder="患者、医生、护士、护理组、机位" clearable /></el-form-item>
        <el-form-item label="团队"><el-select placeholder="全部团队" clearable><el-option label="王主任团队" value="王主任团队" /><el-option label="血管通路团队" value="血管通路团队" /><el-option label="隔离透析团队" value="隔离透析团队" /><el-option label="急诊透析团队" value="急诊透析团队" /></el-select></el-form-item>
        <el-form-item label="院区"><el-select placeholder="全部院区" clearable><el-option label="总院" value="总院" /><el-option label="东院" value="东院" /><el-option label="西院" value="西院" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待分配" value="待分配" /><el-option label="待复核" value="待复核" /><el-option label="已分配" value="已分配" /><el-option label="转组待复核" value="转组待复核" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="patient" label="患者" min-width="165" fixed="left" />
        <el-table-column prop="contractStatus" label="签约" width="110" />
        <el-table-column prop="hospital" label="随访医院" width="95" />
        <el-table-column prop="department" label="随访科室" min-width="130" />
        <el-table-column prop="expertTeam" label="专家团队" min-width="140" />
        <el-table-column prop="doctor" label="主诊医生" width="100" />
        <el-table-column prop="nurse" label="责任护士" width="100" />
        <el-table-column prop="nurseGroup" label="护理组" width="110" />
        <el-table-column prop="bedIntent" label="机位意向" width="100" />
        <el-table-column prop="shareScope" label="共享范围" min-width="165" />
        <el-table-column prop="status" label="状态" width="110"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openAssignment(row)">分配</el-button>
            <el-button link @click="openTransfer(row)">转组/协管</el-button>
            <el-button link @click="openTrace(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="assignmentDrawerVisible" title="责任团队与机位分配" size="700px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="患者">{{ selected?.patient }}</el-descriptions-item>
        <el-descriptions-item label="签约状态">{{ selected?.contractStatus }}</el-descriptions-item>
      </el-descriptions>
      <el-form class="dialog-form" label-width="118px">
        <el-form-item label="随访医院/科室"><el-row :gutter="8"><el-col :span="12"><el-select :model-value="selected?.hospital"><el-option label="总院" value="总院" /><el-option label="东院" value="东院" /><el-option label="西院" value="西院" /></el-select></el-col><el-col :span="12"><el-select :model-value="selected?.department"><el-option label="血液净化中心" value="血液净化中心" /><el-option label="肾内科" value="肾内科" /><el-option label="隔离透析区" value="隔离透析区" /></el-select></el-col></el-row></el-form-item>
        <el-form-item label="专家团队"><el-select :model-value="selected?.expertTeam"><el-option label="王主任团队" value="王主任团队" /><el-option label="血管通路团队" value="血管通路团队" /><el-option label="隔离透析团队" value="隔离透析团队" /><el-option label="急诊透析团队" value="急诊透析团队" /></el-select></el-form-item>
        <el-form-item label="主诊/责任护士"><el-row :gutter="8"><el-col :span="12"><el-select :model-value="selected?.doctor"><el-option label="张明" value="张明" /><el-option label="陈宁" value="陈宁" /><el-option label="刘主任" value="刘主任" /><el-option label="王主任" value="王主任" /></el-select></el-col><el-col :span="12"><el-select :model-value="selected?.nurse"><el-option label="周敏" value="周敏" /><el-option label="赵玲" value="赵玲" /><el-option label="孙涛" value="孙涛" /></el-select></el-col></el-row></el-form-item>
        <el-form-item label="护理组/机位">
          <el-cascader
            placeholder="请选择护理组和机位意向"
            :options="[
              { label: 'A区一组', value: 'A区一组', children: [{ label: 'A08', value: 'A08' }, { label: 'A10', value: 'A10' }] },
              { label: 'B区二组', value: 'B区二组', children: [{ label: 'B12', value: 'B12' }] },
              { label: '隔离组', value: '隔离组', children: [{ label: 'I03', value: 'I03' }] },
              { label: '急诊组', value: '急诊组', children: [{ label: 'E02', value: 'E02' }] },
            ]"
          />
        </el-form-item>
        <el-form-item label="共享协管"><el-checkbox-group model-value="doctor"><el-checkbox-button label="doctor">医生站</el-checkbox-button><el-checkbox-button label="nurse">护士站</el-checkbox-button><el-checkbox-button label="home">居家端</el-checkbox-button><el-checkbox-button label="infection">感控</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="分配依据"><el-input type="textarea" :rows="3" placeholder="记录分配依据、隔离要求、患者偏好、资源限制和复核意见" /></el-form-item>
      </el-form>
      <div class="drawer-actions"><el-button @click="assignmentDrawerVisible = false">取消</el-button><el-button type="primary" @click="assignmentDrawerVisible = false; submitAction('责任归属已保存并同步到医生站、护士站')">保存分配</el-button></div>
    </el-drawer>

    <el-dialog v-model="transferDialogVisible" title="转组/共享协管申请" width="640px">
      <el-form label-width="118px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="变更类型"><el-radio-group model-value="transfer"><el-radio-button label="transfer">转组</el-radio-button><el-radio-button label="share">新增协管</el-radio-button><el-radio-button label="stop">停止协管</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="目标团队"><el-select placeholder="请选择"><el-option label="血管通路团队" value="血管通路团队" /><el-option label="隔离透析团队" value="隔离透析团队" /><el-option label="夜间透析团队" value="夜间透析团队" /></el-select></el-form-item>
        <el-form-item label="生效日期"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item label="变更原因"><el-input type="textarea" :rows="3" placeholder="记录转组、协管或停止协管的业务原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="transferDialogVisible = false">取消</el-button><el-button type="primary" @click="transferDialogVisible = false; submitAction('转组/协管申请已提交，等待复核')">提交申请</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="归属变更追溯" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 09:40" type="primary">签约生效后创建归属：{{ selected?.patient }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 10:05">分配专家团队、主诊医生、责任护士、护理组和机位意向</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 10:20" type="success">归属同步医生站、护士站和申请预约页面</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
