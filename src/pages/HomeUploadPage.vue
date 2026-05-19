<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Upload, View, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type UploadRecord = {
  id: string;
  patient: string;
  fileType: string;
  reportName: string;
  checkDate: string;
  sourceOrg: string;
  abnormalItem: string;
  status: string;
  reviewer: string;
  nextAction: string;
};

const uploadDialogVisible = ref(false);
const manualDialogVisible = ref(false);
const ocrDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<UploadRecord | null>(null);

const rows: UploadRecord[] = [
  { id: 'UP-001', patient: '王建国', fileType: '检验报告', reportName: '血常规+生化', checkDate: '2026-05-09', sourceOrg: '市一医院检验科', abnormalItem: 'Hb 92g/L', status: '待审核', reviewer: '刘主任', nextAction: '医生审核' },
  { id: 'UP-002', patient: '李秀兰', fileType: '照片资料', reportName: '导管口照片', checkDate: '2026-05-10', sourceOrg: '患者上传', abnormalItem: '导管口发红', status: '预警待处理', reviewer: '赵玲', nextAction: '感控筛查' },
  { id: 'UP-003', patient: '赵明', fileType: '检验报告', reportName: '乙肝两对半', checkDate: '2026-05-08', sourceOrg: '东院检验科', abnormalItem: 'HBsAg 阳性', status: '已采纳', reviewer: '感控护士', nextAction: '隔离标识' },
  { id: 'UP-004', patient: '陈志强', fileType: '检查报告', reportName: '胸片报告', checkDate: '2026-05-10', sourceOrg: '急诊影像', abnormalItem: '轻度肺淤血', status: '待审核', reviewer: '王主任', nextAction: '医生评估' },
  { id: 'UP-005', patient: '周萍', fileType: '检验报告', reportName: '肾功电解质', checkDate: '2026-05-09', sourceOrg: '西院检验科', abnormalItem: 'K 5.7mmol/L', status: '危急值待确认', reviewer: '陈宁', nextAction: '危急值通知' },
  { id: 'UP-006', patient: '郑军', fileType: '医保资料', reportName: '异地备案截图', checkDate: '2026-05-10', sourceOrg: '医保平台', abnormalItem: '备案待审核', status: '退回补正', reviewer: '导诊王敏', nextAction: '重新上传' },
  { id: 'UP-007', patient: '韩梅', fileType: '检验报告', reportName: '血磷复查', checkDate: '2026-05-10', sourceOrg: '社区医院', abnormalItem: 'P 1.92mmol/L', status: '已采纳', reviewer: '刘主任', nextAction: '饮食任务' },
  { id: 'UP-008', patient: '林建平', fileType: '照片资料', reportName: '导管敷料照片', checkDate: '2026-05-10', sourceOrg: '患者上传', abnormalItem: '渗液', status: '预警待处理', reviewer: '感控护士', nextAction: '临床事件' },
  { id: 'UP-009', patient: '孙丽', fileType: '检查报告', reportName: '心电图', checkDate: '2026-05-10', sourceOrg: '急诊', abnormalItem: '窦速', status: '待审核', reviewer: '陈宁', nextAction: '医生评估' },
  { id: 'UP-010', patient: '马强', fileType: '饮食记录', reportName: '三日饮食记录', checkDate: '2026-05-10', sourceOrg: '患者上传', abnormalItem: '高磷摄入', status: '待审核', reviewer: '营养师', nextAction: '营养随访' },
];

const activeTables = ['home_lab_upload', 'lab_report', 'lab_result_item', 'ocr_recognition_task', 'warning_event', 'patient_health_profile'];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === '已采纳') return 'success';
  if (status.includes('预警') || status.includes('危急') || status.includes('退回')) return 'danger';
  if (status.includes('待')) return 'warning';
  return 'info';
}

function openUpload(row?: UploadRecord): void {
  selected.value = row ?? rows[0];
  uploadDialogVisible.value = true;
}

function openReview(row: UploadRecord): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: UploadRecord): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="home-patient-page">
    <el-card class="home-work-card" shadow="never">
      <template #header>
        <div class="home-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>患者上传院外检验检查、手工录入检验结果、上传原始报告，支持 OCR 识别并查看处理状态。</p>
          </div>
          <div class="home-actions">
            <el-button type="primary" :icon="Upload" @click="openUpload()">上传资料</el-button>
            <el-button :icon="DocumentAdd" @click="manualDialogVisible = true">手工录入检验结果</el-button>
            <el-button :icon="View" @click="ocrDialogVisible = true">OCR识别</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[0])">审核采纳</el-button>
          </div>
        </div>
      </template>

      <el-form class="home-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、报告名、异常项、机构" clearable /></el-form-item>
        <el-form-item label="资料类型"><el-select placeholder="全部类型" clearable><el-option label="手工录入检验结果" value="manual" /><el-option label="上传原始报告" value="origin" /><el-option label="检查报告" value="exam" /><el-option label="OCR识别" value="ocr" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待审核" value="待审核" /><el-option label="已采纳" value="已采纳" /><el-option label="退回补正" value="退回补正" /><el-option label="预警待处理" value="预警待处理" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="上传号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="fileType" label="类型" width="110" />
        <el-table-column prop="reportName" label="报告/资料" min-width="160" />
        <el-table-column prop="checkDate" label="检查日期" width="110" />
        <el-table-column prop="sourceOrg" label="来源机构" min-width="150" />
        <el-table-column prop="abnormalItem" label="异常项" min-width="140" />
        <el-table-column prop="status" label="状态" width="120"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reviewer" label="审核人" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openUpload(row)">补充</el-button><el-button link @click="openReview(row)">审核</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="uploadDialogVisible" title="上传/补充资料" width="660px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item>
        <el-form-item label="资料类型"><el-select :model-value="selected?.fileType"><el-option label="检验报告" value="检验报告" /><el-option label="检查报告" value="检查报告" /><el-option label="照片资料" value="照片资料" /><el-option label="饮食记录" value="饮食记录" /><el-option label="医保资料" value="医保资料" /></el-select></el-form-item>
        <el-form-item label="检查日期"><el-date-picker type="date" /></el-form-item>
        <el-form-item label="来源机构"><el-input :model-value="selected?.sourceOrg" placeholder="医院、社区、患者自测或医保平台" /></el-form-item>
        <el-form-item label="文件"><el-upload drag action="#"><el-icon><Upload /></el-icon><div class="el-upload__text">拖拽或点击上传</div></el-upload></el-form-item>
        <el-form-item label="异常说明"><el-input type="textarea" :rows="3" :model-value="selected?.abnormalItem" placeholder="异常项、症状、检查背景和需要医护关注的问题" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="uploadDialogVisible = false">取消</el-button><el-button type="primary" @click="uploadDialogVisible = false; submitAction('资料已提交，等待审核采纳')">提交资料</el-button></template>
    </el-dialog>

    <el-dialog v-model="manualDialogVisible" title="手工录入检验结果" width="680px">
      <el-form label-width="110px">
        <el-form-item label="检验项目"><el-input placeholder="如血钾、血磷、Hb、PTH" /></el-form-item>
        <el-form-item label="结果/单位"><el-row :gutter="8"><el-col :span="12"><el-input placeholder="结果值" /></el-col><el-col :span="12"><el-input placeholder="单位" /></el-col></el-row></el-form-item>
        <el-form-item label="检查日期"><el-date-picker type="date" /></el-form-item>
        <el-form-item label="参考范围"><el-input placeholder="填写报告参考范围或异常标记" /></el-form-item>
        <el-form-item label="原始报告"><el-upload drag action="#"><div class="el-upload__text">上传原始报告佐证</div></el-upload></el-form-item>
      </el-form>
      <template #footer><el-button @click="manualDialogVisible = false">取消</el-button><el-button type="primary" @click="manualDialogVisible = false; submitAction('手工检验结果已提交，等待审核')">提交录入</el-button></template>
    </el-dialog>

    <el-dialog v-model="ocrDialogVisible" title="OCR识别检验检查报告" width="640px">
      <el-form label-width="110px">
        <el-form-item label="识别文件"><el-upload drag action="#"><div class="el-upload__text">上传检验/检查报告图片或 PDF</div></el-upload></el-form-item>
        <el-form-item label="识别结果"><el-input type="textarea" :rows="4" placeholder="OCR识别后展示项目、结果、单位、参考范围和异常标记" /></el-form-item>
        <el-form-item label="处理状态"><el-radio-group model-value="draft"><el-radio-button label="draft">待确认</el-radio-button><el-radio-button label="submit">提交审核</el-radio-button><el-radio-button label="return">退回重传</el-radio-button></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="ocrDialogVisible = false">取消</el-button><el-button type="primary" @click="ocrDialogVisible = false; submitAction('OCR识别任务已提交')">保存识别结果</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="上传资料审核" width="640px">
      <el-alert v-if="selected?.status.includes('危急') || selected?.status.includes('预警')" type="warning" :closable="false" show-icon title="异常或危急值资料需确认是否生成预警/临床事件。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="资料"><el-input :model-value="selected ? `${selected.id} / ${selected.reportName}` : ''" disabled /></el-form-item>
        <el-form-item label="审核结果"><el-radio-group model-value="adopt"><el-radio-button label="adopt">采纳归档</el-radio-button><el-radio-button label="return">退回补正</el-radio-button><el-radio-button label="warning">生成预警</el-radio-button><el-radio-button label="event">转临床事件</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="记录异常值、退回原因、归档口径和随访建议" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('资料审核结果已回写')">提交审核</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="上传资料追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:00" type="primary">患者上传资料：{{ selected?.reportName }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:05">系统识别异常项：{{ selected?.abnormalItem }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30" type="success">审核后采纳到健康档案或生成预警</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
