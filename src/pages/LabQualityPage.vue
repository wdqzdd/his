<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Histogram, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type QualityRow = {
  id: string;
  item: string;
  device: string;
  deviceStatus: string;
  lastCalibration: string;
  qcType: string;
  controlValue: string;
  refRange: string;
  status: string;
  owner: string;
  abnormalReview: string;
  nextAction: string;
};

const selectedId = ref('LQ-001');
const qcDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const abnormalDialogVisible = ref(false);
const deviceDialogVisible = ref(false);
const trendDrawerVisible = ref(false);

const rows: QualityRow[] = [
  { id: 'LQ-001', item: 'K+', device: '生化分析仪01', deviceStatus: '在线', lastCalibration: '2026-05-09', qcType: '日常质控', controlValue: '4.9', refRange: '3.5-5.5', status: '正常', owner: '张技师', abnormalReview: '无需复核', nextAction: '继续放行' },
  { id: 'LQ-002', item: 'Alb', device: '生化分析仪01', deviceStatus: '在线', lastCalibration: '2026-05-09', qcType: '日常质控', controlValue: '34.2', refRange: '35-50', status: '偏低', owner: '王技师', abnormalReview: '待复核', nextAction: '复核质控' },
  { id: 'LQ-003', item: 'Hb', device: '血球分析仪02', deviceStatus: '暂停放行', lastCalibration: '2026-05-07', qcType: '室内质控', controlValue: '91', refRange: '100-120', status: '异常', owner: '李技师', abnormalReview: '待二次复核', nextAction: '暂停放行' },
  { id: 'LQ-004', item: 'P', device: '生化分析仪02', deviceStatus: '校准中', lastCalibration: '2026-05-05', qcType: '日常质控', controlValue: '1.86', refRange: '0.81-1.45', status: '异常', owner: '刘技师', abnormalReview: '待复核', nextAction: '校准设备' },
  { id: 'LQ-005', item: 'Kt/V', device: '质控台', deviceStatus: '在线', lastCalibration: '2026-05-08', qcType: '趋势分析', controlValue: '1.18', refRange: '>=1.20', status: '偏低', owner: '张技师', abnormalReview: '已复核', nextAction: '调整维护' },
  { id: 'LQ-006', item: 'CRP', device: '免疫分析仪', deviceStatus: '试剂复查', lastCalibration: '2026-05-06', qcType: '日常质控', controlValue: '28', refRange: '0-10', status: '异常', owner: '王技师', abnormalReview: '待复核', nextAction: '复查试剂' },
  { id: 'LQ-007', item: 'BNP', device: '免疫分析仪', deviceStatus: '在线', lastCalibration: '2026-05-06', qcType: '趋势分析', controlValue: '980', refRange: '<100', status: '正常', owner: '李技师', abnormalReview: '无需复核', nextAction: '继续监控' },
  { id: 'LQ-008', item: 'PTH', device: '生化分析仪01', deviceStatus: '在线', lastCalibration: '2026-05-09', qcType: '室内质控', controlValue: '780', refRange: '150-600', status: '偏高', owner: '刘技师', abnormalReview: '待复核', nextAction: '修正批次' },
  { id: 'LQ-009', item: 'HBsAg', device: '免疫分析仪', deviceStatus: '在线', lastCalibration: '2026-05-06', qcType: '外部质评', controlValue: '合格', refRange: '合格', status: '正常', owner: '张技师', abnormalReview: '已复核', nextAction: '完成上报' },
  { id: 'LQ-010', item: '尿素清除率', device: '质控台', deviceStatus: '在线', lastCalibration: '2026-05-08', qcType: '趋势分析', controlValue: '1.16', refRange: '>=1.20', status: '偏低', owner: '王技师', abnormalReview: '待复核', nextAction: '复核记录' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['lab_quality_control', 'qc_record', 'quality_review', 'device_release_log'];

const metrics = computed(() => [
  { label: '质控记录', value: rows.length, tone: 'blue' },
  { label: '异常', value: rows.filter((item) => item.status === '异常').length, tone: 'red' },
  { label: '偏低', value: rows.filter((item) => item.status === '偏低').length, tone: 'orange' },
  { label: '正常', value: rows.filter((item) => item.status === '正常').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.nextAction === '复核质控').length, tone: 'orange' },
  { label: '设备异常', value: rows.filter((item) => item.deviceStatus !== '在线').length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '正常') return 'success';
  if (value === '在线' || value === '已复核' || value === '无需复核') return 'success';
  if (value === '偏低' || value === '偏高' || value.includes('待') || value.includes('校准') || value.includes('试剂')) return 'warning';
  if (value === '异常' || value === '暂停放行') return 'danger';
  return 'info';
}

function selectRow(row: QualityRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="lab-workflow-page">
    <el-card class="lab-work-card" shadow="never">
      <template #header>
        <div class="lab-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>记录检验质控、设备放行和趋势分析，确保检验结果进入统一的标准化口径。</p>
          </div>
          <div class="lab-actions">
            <el-button type="primary" :icon="Warning" @click="qcDialogVisible = true">记录质控</el-button>
            <el-button :icon="CircleCheck" @click="reviewDialogVisible = true">复核放行</el-button>
            <el-button :icon="Warning" @click="abnormalDialogVisible = true">异常复核</el-button>
            <el-button :icon="CircleCheck" @click="deviceDialogVisible = true">设备状态</el-button>
            <el-button :icon="Histogram" @click="trendDrawerVisible = true">趋势分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="lab-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="项目、设备、责任人、结果" clearable /></el-form-item>
        <el-form-item label="质控类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="日常质控" value="日常质控" />
            <el-option label="室内质控" value="室内质控" />
            <el-option label="外部质评" value="外部质评" />
            <el-option label="趋势分析" value="趋势分析" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="正常" value="正常" />
            <el-option label="偏低" value="偏低" />
            <el-option label="偏高" value="偏高" />
            <el-option label="异常" value="异常" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="lab-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['lab-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="item" label="项目" width="100" fixed="left" />
        <el-table-column prop="device" label="设备" min-width="140" />
        <el-table-column prop="deviceStatus" label="设备状态" width="105">
          <template #default="{ row }"><el-tag :type="tagType(row.deviceStatus)" effect="plain">{{ row.deviceStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="lastCalibration" label="最近校准" width="110" />
        <el-table-column prop="qcType" label="质控类型" width="100" />
        <el-table-column prop="controlValue" label="控制值" width="100" />
        <el-table-column prop="refRange" label="范围" width="100" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="owner" label="责任人" width="100" />
        <el-table-column prop="abnormalReview" label="异常复核" width="110">
          <template #default="{ row }"><el-tag :type="tagType(row.abnormalReview)" effect="plain">{{ row.abnormalReview }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>

    <el-dialog v-model="qcDialogVisible" title="记录质控" width="620px">
      <el-form label-width="100px">
        <el-form-item label="项目"><el-input :model-value="currentRow.item" disabled /></el-form-item>
        <el-form-item label="质控类型">
          <el-select placeholder="请选择">
            <el-option label="日常质控" value="daily" />
            <el-option label="室内质控" value="internal" />
            <el-option label="外部质评" value="external" />
          </el-select>
        </el-form-item>
        <el-form-item label="记录值"><el-input placeholder="输入质控值" /></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录偏差、处理措施和复核要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="qcDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="qcDialogVisible = false; submitAction('质控记录已保存')">保存质控</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="复核放行" width="560px">
      <el-form label-width="100px">
        <el-form-item label="项目"><el-input :model-value="currentRow.item" disabled /></el-form-item>
        <el-form-item label="放行结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">放行</el-radio-button>
            <el-radio-button label="hold">暂停</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录复核人、异常结论和放行条件" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reviewDialogVisible = false; submitAction('质控复核已完成')">提交复核</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="abnormalDialogVisible" title="异常结果复核" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="异常结果复核需同时确认质控、设备、试剂批号和原始报告，必要时暂停报告发布。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="异常项目"><el-input :model-value="`${currentRow.item} / ${currentRow.status}`" disabled /></el-form-item>
        <el-form-item label="复核结论">
          <el-radio-group model-value="recheck">
            <el-radio-button label="pass">确认有效</el-radio-button>
            <el-radio-button label="recheck">重新检测</el-radio-button>
            <el-radio-button label="hold">暂停发布</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复核说明"><el-input type="textarea" :rows="3" placeholder="记录异常原因、复测结果、设备/试剂核查和放行条件" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="abnormalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="abnormalDialogVisible = false; submitAction('异常结果复核已提交')">提交复核</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="deviceDialogVisible" title="检验设备状态" width="620px">
      <el-form label-width="110px">
        <el-form-item label="设备"><el-input :model-value="currentRow.device" disabled /></el-form-item>
        <el-form-item label="当前状态">
          <el-radio-group :model-value="currentRow.deviceStatus">
            <el-radio-button label="在线">在线</el-radio-button>
            <el-radio-button label="校准中">校准中</el-radio-button>
            <el-radio-button label="暂停放行">暂停放行</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校准/维护"><el-input :model-value="currentRow.lastCalibration" /></el-form-item>
        <el-form-item label="放行条件"><el-input type="textarea" :rows="3" placeholder="记录设备校准、室内质控、外部质评、维护人和放行结论" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="deviceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deviceDialogVisible = false; submitAction('检验设备状态已更新')">保存状态</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="trendDrawerVisible" title="质控趋势" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="2026-04-10">设备校准后恢复正常</el-timeline-item>
        <el-timeline-item timestamp="2026-05-03" type="warning">出现一次偏低</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10" type="success">趋势稳定，已放行</el-timeline-item>
      </el-timeline>
      <el-divider />
      <el-table :data="rows.slice(0, 5)" border size="small">
        <el-table-column prop="item" label="项目" width="90" />
        <el-table-column prop="device" label="设备" min-width="130" />
        <el-table-column prop="status" label="状态" width="90" />
      </el-table>
    </el-drawer>
  </section>
</template>
