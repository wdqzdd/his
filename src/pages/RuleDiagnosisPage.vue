<script setup lang="ts">
import { ref } from 'vue';
import { Connection, DocumentAdd, Operation, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type DiagnosisRule = {
  id: string;
  name: string;
  trigger: string;
  evidence: string;
  diagnosis: string;
  riskLevel: string;
  target: string;
  owner: string;
  status: string;
  lastRun: string;
  hitCount: number;
  nextAction: string;
};

type LogRow = {
  time: string;
  source: string;
  patient: string;
  evidence: string;
  result: string;
  status: string;
};

const rules = ref<DiagnosisRule[]>([
  { id: 'DXR-001', name: '高钾血症诊断提示', trigger: '检验结果复核', evidence: '血钾 > 5.5 mmol/L 或危急值标记', diagnosis: '疑似高钾血症', riskLevel: '高', target: '医生站/员工主页', owner: '肾内医生组', status: '启用', lastRun: '2026-05-14 08:31', hitCount: 18, nextAction: '医生确认诊断' },
  { id: 'DXR-002', name: '透析充分性不足提示', trigger: '治疗记录归档', evidence: 'Kt/V < 1.20 且尿素下降率不足', diagnosis: '透析充分性不足', riskLevel: '高', target: '医生站/CQI', owner: '质量管理组', status: '启用', lastRun: '2026-05-14 10:20', hitCount: 7, nextAction: '生成疗效评估' },
  { id: 'DXR-003', name: '容量负荷过高提示', trigger: '透前评估保存', evidence: '体重增长率 > 5% 且血压升高', diagnosis: '容量负荷过高', riskLevel: '中', target: '医生站/护士站', owner: '责任医生', status: '启用', lastRun: '2026-05-14 07:45', hitCount: 12, nextAction: '复核干体重' },
  { id: 'DXR-004', name: '贫血风险诊断提示', trigger: '月度检验归档', evidence: 'Hb < 100 g/L 或铁蛋白不足', diagnosis: '肾性贫血控制不佳', riskLevel: '中', target: '医生站/药房站', owner: '医生站', status: '待复核', lastRun: '2026-05-13 16:40', hitCount: 5, nextAction: '复核用药方案' },
  { id: 'DXR-005', name: '矿物质骨病提示', trigger: '检验趋势更新', evidence: 'PTH、血磷连续两次超目标', diagnosis: 'CKD-MBD 风险', riskLevel: '中', target: '医生站', owner: '专科医生', status: '启用', lastRun: '2026-05-13 15:12', hitCount: 9, nextAction: '调整随访计划' },
  { id: 'DXR-006', name: '导管感染线索提示', trigger: '临床事件登记', evidence: '发热 + 导管红肿 + 白细胞升高', diagnosis: '导管相关感染疑似', riskLevel: '高', target: '医生站/感控管理', owner: '感控负责人', status: '启用', lastRun: '2026-05-14 09:16', hitCount: 3, nextAction: '感染事件复核' },
  { id: 'DXR-007', name: '低血压易发患者提示', trigger: '透中监测保存', evidence: '三次治疗中出现收缩压 < 90', diagnosis: '透中低血压倾向', riskLevel: '高', target: '护士站/医生站', owner: '护理组长', status: '启用', lastRun: '2026-05-14 11:05', hitCount: 11, nextAction: '制定处置预案' },
  { id: 'DXR-008', name: '通路狭窄风险提示', trigger: '通路评估提交', evidence: '震颤减弱或血流量下降', diagnosis: '内瘘狭窄风险', riskLevel: '中', target: '医生站/护士站', owner: '通路小组', status: '启用', lastRun: '2026-05-13 17:28', hitCount: 6, nextAction: '预约彩超评估' },
  { id: 'DXR-009', name: '营养不良诊断提示', trigger: '健康报告生成', evidence: 'Alb < 35 g/L 且体重下降', diagnosis: '营养风险', riskLevel: '中', target: '医生站/居家主页', owner: '随访团队', status: '草稿', lastRun: '-', hitCount: 0, nextAction: '发布前仿真' },
  { id: 'DXR-010', name: '抗凝不足提示', trigger: '透析记录审核', evidence: '凝血事件 + 抗凝剂量低于模板', diagnosis: '抗凝不足风险', riskLevel: '中', target: '医生站/护士站', owner: '医生站', status: '停用', lastRun: '2026-05-10 14:08', hitCount: 2, nextAction: '评估是否启用' },
  { id: 'DXR-011', name: '居家上传异常识别', trigger: '患者端报告上传', evidence: '血压、体重或症状超过随访阈值', diagnosis: '居家风险待确认', riskLevel: '中', target: '员工主页/医生站', owner: '随访护士', status: '启用', lastRun: '2026-05-14 06:50', hitCount: 14, nextAction: '发起远程随访' },
]);

const logs = ref<LogRow[]>([
  { time: '2026-05-14 11:05', source: 'MON-20260514-083', patient: '陈家明', evidence: '收缩压 86 mmHg', result: '生成透中低血压倾向提示', status: '成功' },
  { time: '2026-05-14 10:20', source: 'TX-20260514-032', patient: '李秀兰', evidence: 'Kt/V 1.12', result: '生成疗效预警和医生待办', status: '成功' },
  { time: '2026-05-14 09:16', source: 'EVT-20260514-006', patient: '周建国', evidence: '导管口红肿伴发热', result: '推送感控复核', status: '待复核' },
  { time: '2026-05-14 08:31', source: 'LAB-20260514-019', patient: '王敏', evidence: '血钾 6.1 mmol/L', result: '危急值诊断提示', status: '成功' },
]);

const schemeGroups = [
  { group: '智能诊断自动识别方案', source: '检验、治疗、通路、患者端、临床事件', form: '规则表达式 + 证据权重', output: '诊断线索、风险等级、确认任务', status: '已配置' },
  { group: '常见病情评估智能诊断方案', source: '生命体征、体重、尿量、症状问卷', form: '常见评估动态表单', output: '容量负荷、低血压倾向、营养风险', status: '补齐' },
  { group: '专科病情评估智能诊断方案', source: '血透充分性、抗凝、通路、CKD-MBD', form: '专科评估动态表单', output: '透析充分性不足、通路狭窄、抗凝不足', status: '补齐' },
  { group: '标准化检验结果智能诊断方案', source: 'LIS标准化项目、参考范围、危急值标记', form: '检验判读动态表单', output: '高钾、贫血、感染、矿物质骨病线索', status: '已配置' },
];

const dynamicFormRows = [
  { field: '证据来源', component: '来源选择 + 记录编号', required: '是', use: '绑定检验、评估、治疗或通路原始记录' },
  { field: '判读条件', component: '表达式编辑器', required: '是', use: '维护阈值、趋势、连续次数和组合条件' },
  { field: '确认角色', component: '角色/工作站选择', required: '是', use: '生成医生确认、护士复核或感控复核任务' },
  { field: '处理结论', component: '单选 + 补充说明', required: '是', use: '确认诊断、否认线索、转预警或转工作任务' },
];

const selectedRule = ref(rules.value[0]);
const editVisible = ref(false);
const testVisible = ref(false);
const publishVisible = ref(false);
const logVisible = ref(false);
const ruleForm = ref({ name: '', trigger: '', evidence: '', diagnosis: '', riskLevel: '中', target: '', owner: '', reviewRole: '' });

const stats = [
  { label: '诊断方案', value: rules.value.length, tone: 'blue' },
  { label: '已启用', value: rules.value.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '高风险', value: rules.value.filter((item) => item.riskLevel === '高').length, tone: 'red' },
  { label: '今日命中', value: rules.value.reduce((sum, item) => sum + item.hitCount, 0), tone: 'orange' },
  { label: '待复核', value: rules.value.filter((item) => item.status === '待复核' || item.status === '草稿').length, tone: 'blue' },
];

function tagType(value: string) {
  if (value === '启用' || value === '成功') return 'success';
  if (value === '高') return 'danger';
  if (value.includes('待') || value === '中' || value === '草稿') return 'warning';
  return 'info';
}

function selectRule(row: DiagnosisRule): void {
  selectedRule.value = row;
}

function openEdit(row?: DiagnosisRule): void {
  if (row) selectedRule.value = row;
  ruleForm.value = {
    name: selectedRule.value.name,
    trigger: selectedRule.value.trigger,
    evidence: selectedRule.value.evidence,
    diagnosis: selectedRule.value.diagnosis,
    riskLevel: selectedRule.value.riskLevel,
    target: selectedRule.value.target,
    owner: selectedRule.value.owner,
    reviewRole: '主诊医生二次确认',
  };
  editVisible.value = true;
}

function submit(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="rule-config-page">
    <el-card class="rule-work-card" shadow="never">
      <template #header>
        <div class="rule-header">
          <div>
            <h2>智能诊断方案</h2>
            <p>按检验、治疗、通路和居家上传数据触发诊断线索，先生成医生确认任务，再回写诊断和预警闭环。</p>
          </div>
          <div class="rule-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEdit()">新增诊断方案</el-button>
            <el-button :icon="Operation" @click="testVisible = true">证据仿真</el-button>
            <el-button :icon="SwitchButton" @click="publishVisible = true">发布启用</el-button>
            <el-button :icon="Connection" @click="logVisible = true">命中日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="rule-filter" inline>
        <el-form-item label="触发来源">
          <el-select placeholder="全部来源" clearable>
            <el-option label="检验结果" value="lab" />
            <el-option label="治疗记录" value="treatment" />
            <el-option label="通路评估" value="access" />
            <el-option label="居家上传" value="home" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险级别">
          <el-select placeholder="全部级别" clearable>
            <el-option label="高" value="high" />
            <el-option label="中" value="middle" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input placeholder="方案名称、证据、诊断结论" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="rule-stat-grid">
        <el-card v-for="item in stats" :key="item.label" :class="['rule-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="rule-main-card" shadow="never">
            <template #header>
              <div class="rule-card-header">
                <strong>诊断规则列表</strong>
                <el-tag effect="plain">证据采集 -> 医生确认 -> 诊断回写 -> 风险追踪</el-tag>
              </div>
            </template>
            <el-table :data="rules" border stripe highlight-current-row row-key="id" @row-click="selectRule">
              <el-table-column prop="name" label="方案名称" min-width="170" fixed="left" />
              <el-table-column prop="trigger" label="触发时机" min-width="130" />
              <el-table-column prop="evidence" label="诊断证据" min-width="230" />
              <el-table-column prop="diagnosis" label="生成诊断线索" min-width="150" />
              <el-table-column prop="riskLevel" label="风险" width="80">
                <template #default="{ row }"><el-tag :type="tagType(row.riskLevel)">{{ row.riskLevel }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="target" label="推送目标" min-width="150" />
              <el-table-column prop="owner" label="责任人" min-width="110" />
              <el-table-column prop="status" label="状态" width="90">
                <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="hitCount" label="命中" width="80" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="openEdit(row)">维护</el-button>
                  <el-button link @click.stop="selectRule(row); testVisible = true">仿真</el-button>
                  <el-button link @click.stop="selectRule(row); publishVisible = true">发布</el-button>
                  <el-button link @click.stop="selectRule(row); logVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="rule-side-card" shadow="never">
            <template #header>
              <div class="rule-card-header">
                <strong>当前方案闭环</strong>
                <el-tag :type="tagType(selectedRule.status)">{{ selectedRule.status }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="方案">{{ selectedRule.name }}</el-descriptions-item>
              <el-descriptions-item label="证据">{{ selectedRule.evidence }}</el-descriptions-item>
              <el-descriptions-item label="结论">{{ selectedRule.diagnosis }}</el-descriptions-item>
              <el-descriptions-item label="目标">{{ selectedRule.target }}</el-descriptions-item>
              <el-descriptions-item label="下一步">{{ selectedRule.nextAction }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16" class="rule-extra-grid">
      <el-col :xs="24" :xl="14">
        <el-card class="rule-main-card" shadow="never">
          <template #header>
            <div class="rule-card-header">
              <strong>需求分类覆盖</strong>
              <el-tag effect="plain">自动识别 / 常见评估 / 专科评估 / 标准化检验</el-tag>
            </div>
          </template>
          <el-table :data="schemeGroups" border stripe>
            <el-table-column prop="group" label="方案分类" min-width="180" />
            <el-table-column prop="source" label="输入来源" min-width="210" />
            <el-table-column prop="form" label="动态表单" min-width="160" />
            <el-table-column prop="output" label="输出" min-width="210" />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :xl="10">
        <el-card class="rule-side-card" shadow="never">
          <template #header>
            <div class="rule-card-header">
              <strong>智能诊断动态表单</strong>
              <el-tag type="success" effect="plain">评估处理任务</el-tag>
            </div>
          </template>
          <el-table :data="dynamicFormRows" border stripe>
            <el-table-column prop="field" label="字段" width="100" />
            <el-table-column prop="component" label="控件" min-width="145" />
            <el-table-column prop="required" label="必填" width="70" />
            <el-table-column prop="use" label="闭环作用" min-width="190" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editVisible" title="维护智能诊断方案" width="760px">
      <el-form :model="ruleForm" label-width="112px">
        <el-form-item label="方案名称"><el-input v-model="ruleForm.name" /></el-form-item>
        <el-form-item label="触发时机"><el-input v-model="ruleForm.trigger" placeholder="如检验复核、治疗归档、通路评估提交" /></el-form-item>
        <el-form-item label="诊断证据"><el-input v-model="ruleForm.evidence" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="诊断线索"><el-input v-model="ruleForm.diagnosis" /></el-form-item>
        <el-form-item label="风险级别">
          <el-radio-group v-model="ruleForm.riskLevel">
            <el-radio-button label="高" />
            <el-radio-button label="中" />
            <el-radio-button label="低" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="确认角色"><el-input v-model="ruleForm.reviewRole" /></el-form-item>
        <el-form-item label="推送目标"><el-input v-model="ruleForm.target" /></el-form-item>
        <el-form-item label="责任人"><el-input v-model="ruleForm.owner" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editVisible = false; submit('诊断方案已保存，发布前将进入证据仿真')">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="testVisible" title="诊断证据仿真" width="680px">
      <el-form label-width="110px">
        <el-form-item label="样本患者"><el-input placeholder="输入患者、治疗记录或检验报告编号" /></el-form-item>
        <el-form-item label="模拟证据"><el-input type="textarea" :rows="3" :value="selectedRule.evidence" /></el-form-item>
        <el-form-item label="期望结果"><el-input :value="selectedRule.diagnosis" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="testVisible = false">取消</el-button>
        <el-button type="primary" @click="testVisible = false; submit('仿真通过，已生成诊断规则测试日志')">开始仿真</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="publishVisible" title="发布智能诊断方案" width="560px">
      <el-alert type="warning" show-icon :closable="false" title="发布后会影响医生待办、诊断提示和预警线索，请确认已完成证据仿真和临床复核。" />
      <el-form label-width="96px" style="margin-top: 16px">
        <el-form-item label="发布版本"><el-input value="v2026.05.14" /></el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="填写医学复核意见" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishVisible = false">取消</el-button>
        <el-button type="primary" @click="publishVisible = false; selectedRule.status = '启用'; submit('诊断方案已发布启用')">确认发布</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="logVisible" title="诊断规则命中日志" size="720px">
      <el-table :data="logs" border stripe>
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="source" label="来源编号" width="150" />
        <el-table-column prop="patient" label="患者" width="90" />
        <el-table-column prop="evidence" label="命中证据" min-width="170" />
        <el-table-column prop="result" label="处理结果" min-width="170" />
        <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
      </el-table>
    </el-drawer>
  </section>
</template>
