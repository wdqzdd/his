<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentChecked, EditPen, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type RecordRow = {
  id: string;
  patient: string;
  recordType: string;
  treatmentDate: string;
  content: string;
  linkedExecution: string;
  status: string;
  signer: string;
  nextAction: string;
};

const editDrawerVisible = ref(false);
const signDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<RecordRow | null>(null);

const rows: RecordRow[] = [
  { id: 'NRD-001', patient: '王建国 / HD-00038', recordType: '护理执行记录', treatmentDate: '2026-05-10', content: '身份核对、处方核对、低分子肝素已执行', linkedExecution: 'EX-001/EX-002', status: '待签名', signer: '赵护士', nextAction: '签名后进治疗记录' },
  { id: 'NRD-002', patient: '李秀兰 / HD-00072', recordType: '导管护理记录', treatmentDate: '2026-05-10', content: '导管口红肿，已换药并通知医生', linkedExecution: 'EX-003', status: '草稿', signer: '钱护士', nextAction: '补感控意见' },
  { id: 'NRD-003', patient: '赵明 / HD-00116', recordType: '异常暂停记录', treatmentDate: '2026-05-10', content: '高钾医嘱暂停，等待医生修正', linkedExecution: 'EX-004', status: '待复核', signer: '孙护士', nextAction: '医生补正后更新' },
  { id: 'NRD-004', patient: '陈志强 / HD-00128', recordType: '通路观察记录', treatmentDate: '2026-05-10', content: '人工血管震颤弱，已记录通路复查', linkedExecution: 'EX-005', status: '已签名', signer: '周护士', nextAction: '治疗记录引用' },
  { id: 'NRD-005', patient: '刘梅英 / HD-00151', recordType: '内科护理记录', treatmentDate: '2026-05-10', content: 'HD+HP专项同意待核，暂不执行灌流', linkedExecution: 'EX-006', status: '草稿', signer: '吴护士', nextAction: '补同意书' },
  { id: 'NRD-006', patient: '孙海 / HD-00177', recordType: '用药执行记录', treatmentDate: '2026-05-11', content: '左卡尼汀透后静推，患者无不适', linkedExecution: 'EX-007', status: '已签名', signer: '郑护士', nextAction: '归档' },
  { id: 'NRD-007', patient: '马丽 / HD-00203', recordType: '隔离护理记录', treatmentDate: '2026-05-11', content: '隔离物品核对，专机专区执行', linkedExecution: 'EX-008', status: '待签名', signer: '冯护士', nextAction: '治疗记录引用' },
  { id: 'NRD-008', patient: '周庆 / HD-00218', recordType: '风险护理记录', treatmentDate: '2026-05-11', content: '限制超滤，透中严密观察低血压', linkedExecution: 'EX-009', status: '待签名', signer: '蒋护士', nextAction: '透中监测' },
  { id: 'NRD-009', patient: '何雪 / HD-00246', recordType: '宣教记录', treatmentDate: '2026-05-11', content: '降磷药和低磷饮食宣教', linkedExecution: 'EX-010', status: '已签名', signer: '谢护士', nextAction: '居家任务' },
  { id: 'NRD-010', patient: '潘德胜 / HD-00305', recordType: '跌倒风险宣教', treatmentDate: '2026-05-12', content: '透后家属陪同离室', linkedExecution: 'EX-012', status: '待签名', signer: '唐护士', nextAction: '归档审核' },
  { id: 'NRD-011', patient: '曹敏 / HD-00291', recordType: '皮试结果记录', treatmentDate: '2026-05-12', content: '头孢皮试阴性，已通知医生可继续抗感染医嘱', linkedExecution: 'EX-011', status: '待签名', signer: '赵护士', nextAction: '输液执行' },
  { id: 'NRD-012', patient: '韩梅 / HD-00318', recordType: '护理巡视记录', treatmentDate: '2026-05-12', content: '透中巡视三次，血压平稳，穿刺点无渗血', linkedExecution: 'TS-012', status: '已签名', signer: '钱护士', nextAction: '治疗归档' },
  { id: 'NRD-013', patient: '郑军 / HD-00326', recordType: '外科护理记录', treatmentDate: '2026-05-12', content: '深静脉置管术后敷料干燥，疼痛评分2分', linkedExecution: 'ACCESS-009', status: '待复核', signer: '周护士', nextAction: '通路复评' },
  { id: 'NRD-014', patient: '全部患者', recordType: '交班看板', treatmentDate: '2026-05-12', content: 'A区待下机2人，B区高风险1人，隔离区消毒待确认', linkedExecution: 'SHIFT-PM', status: '草稿', signer: '护士长', nextAction: '班末签名' },
];

const recordTemplates = ['内科护理记录', '外科护理记录', '皮试结果记录', '护理巡视记录', '护理异常记录', '交班看板'];

const activeTables = ['nursing_record', 'nursing_record_template', 'order_execution', 'record_signature', 'treatment_record'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已签名') return 'success';
  if (value.includes('待') || value === '草稿') return 'warning';
  if (value.includes('退回')) return 'danger';
  return 'info';
}

function openEdit(row?: RecordRow): void {
  selected.value = row ?? rows[0];
  editDrawerVisible.value = true;
}

function openSign(row: RecordRow): void {
  selected.value = row;
  signDialogVisible.value = true;
}

function openTrace(row: RecordRow): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>记录护理审核、核对执行、通路观察、导管护理、宣教和异常暂停，签名后写入治疗记录闭环。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="EditPen" @click="openEdit()">新增护理记录</el-button>
            <el-button :icon="DocumentChecked" @click="openSign(rows[0])">签名提交</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、记录类型、执行号、内容" clearable /></el-form-item>
        <el-form-item label="记录类型"><el-select placeholder="全部类型" clearable><el-option label="内科护理记录" value="内科护理记录" /><el-option label="外科护理记录" value="外科护理记录" /><el-option label="皮试结果记录" value="皮试结果记录" /><el-option label="护理巡视记录" value="护理巡视记录" /><el-option label="护理异常记录" value="护理异常记录" /><el-option label="交班看板" value="交班看板" /><el-option label="导管护理记录" value="导管护理记录" /><el-option label="宣教记录" value="宣教记录" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="草稿" value="草稿" /><el-option label="待签名" value="待签名" /><el-option label="已签名" value="已签名" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="nurse-stat-grid">
        <el-card v-for="item in recordTemplates" :key="item" class="nurse-stat-card green" shadow="never">
          <span>{{ item }}</span>
          <strong>{{ rows.filter((row) => row.recordType === item).length }}</strong>
        </el-card>
      </div>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="记录号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="155" />
        <el-table-column prop="recordType" label="记录类型" min-width="135" />
        <el-table-column prop="treatmentDate" label="治疗日期" width="110" />
        <el-table-column prop="content" label="记录内容" min-width="260" />
        <el-table-column prop="linkedExecution" label="关联执行" width="120" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="signer" label="签名护士" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link @click="openSign(row)">签名</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="editDrawerVisible" title="护理记录编辑" size="700px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item>
        <el-form-item label="记录类型"><el-select :model-value="selected?.recordType"><el-option label="内科护理记录" value="内科护理记录" /><el-option label="外科护理记录" value="外科护理记录" /><el-option label="皮试结果记录" value="皮试结果记录" /><el-option label="护理巡视记录" value="护理巡视记录" /><el-option label="护理异常记录" value="护理异常记录" /><el-option label="交班看板" value="交班看板" /><el-option label="导管护理记录" value="导管护理记录" /><el-option label="通路观察记录" value="通路观察记录" /><el-option label="宣教记录" value="宣教记录" /></el-select></el-form-item>
        <el-form-item label="关联执行"><el-input :model-value="selected?.linkedExecution" /></el-form-item>
        <el-form-item label="记录内容"><el-input type="textarea" :rows="5" :model-value="selected?.content" /></el-form-item>
      </el-form>
      <div class="drawer-actions"><el-button @click="editDrawerVisible = false">取消</el-button><el-button @click="submitAction('护理记录已暂存')">暂存</el-button><el-button type="primary" @click="editDrawerVisible = false; submitAction('护理记录已提交签名')">提交签名</el-button></div>
    </el-drawer>

    <el-dialog v-model="signDialogVisible" title="护理记录签名" width="560px">
      <el-form label-width="100px">
        <el-form-item label="记录"><el-input :model-value="selected?.id" disabled /></el-form-item>
        <el-form-item label="签名结果"><el-radio-group model-value="sign"><el-radio-button label="sign">签名生效</el-radio-button><el-radio-button label="return">退回修改</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="签名意见"><el-input type="textarea" :rows="3" placeholder="记录签名意见、退回原因或补充要求" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="signDialogVisible = false">取消</el-button><el-button type="primary" @click="signDialogVisible = false; submitAction('护理记录签名已保存')">提交签名</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="护理记录追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 09:00" type="primary">执行结果生成护理记录草稿</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:10">护士补充观察、宣教和异常说明</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:20" type="success">签名后写入治疗记录和归档审核</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
