<script setup lang="ts">
import { ref } from 'vue';
import { Connection, DocumentAdd, Operation, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type EffectRule = {
  id: string;
  name: string;
  indicator: string;
  population: string;
  threshold: string;
  dataSource: string;
  action: string;
  owner: string;
  status: string;
  hitCount: number;
  reviewCycle: string;
  nextAction: string;
};

const rules = ref<EffectRule[]>([
  { id: 'EFF-001', name: 'Kt/V 达标分析', indicator: 'Kt/V', population: '维持性血透患者', threshold: '< 1.20', dataSource: '治疗归档+检验尿素', action: '生成疗效预警并建议调整处方', owner: '质量管理组', status: '启用', hitCount: 7, reviewCycle: '每次归档', nextAction: '医生复核处方' },
  { id: 'EFF-002', name: 'Hb 贫血达标', indicator: 'Hb', population: '月度检验患者', threshold: '< 100 g/L 或 > 130 g/L', dataSource: 'LIS结果', action: '生成贫血管理任务', owner: '主诊医生', status: '启用', hitCount: 13, reviewCycle: '每月', nextAction: '复核 ESA 用药' },
  { id: 'EFF-003', name: 'Alb 营养风险', indicator: 'Alb', population: '居家与门诊患者', threshold: '< 35 g/L', dataSource: '检验+健康报告', action: '推送营养评估', owner: '随访护士', status: '启用', hitCount: 9, reviewCycle: '每月', nextAction: '安排营养宣教' },
  { id: 'EFF-004', name: 'PTH 骨矿物质管理', indicator: 'PTH', population: '慢性透析患者', threshold: '> 600 pg/mL', dataSource: 'LIS趋势', action: '提示 CKD-MBD 复核', owner: '专科医生', status: '启用', hitCount: 5, reviewCycle: '每季', nextAction: '调整随访频率' },
  { id: 'EFF-005', name: '血磷达标方案', indicator: '血磷', population: '月度检验患者', threshold: '> 1.78 mmol/L', dataSource: 'LIS结果', action: '生成饮食和用药复核任务', owner: '医生站', status: '启用', hitCount: 16, reviewCycle: '每月', nextAction: '查看超标清单' },
  { id: 'EFF-006', name: '干体重偏差分析', indicator: '透后体重', population: '连续治疗患者', threshold: '连续3次超干体重 > 1kg', dataSource: '治疗记录+体重秤', action: '提示容量管理评估', owner: '责任护士', status: '待复核', hitCount: 6, reviewCycle: '每周', nextAction: '确认干体重口径' },
  { id: 'EFF-007', name: '透中低血压发生率', indicator: '低血压事件', population: '当日治疗患者', threshold: '发生率 > 10%', dataSource: '透中监测', action: '进入护理质量改进', owner: '护士长', status: '启用', hitCount: 11, reviewCycle: '每日', nextAction: '生成护理改进' },
  { id: 'EFF-008', name: '通路血流量趋势', indicator: '血流量', population: '内瘘患者', threshold: '下降超过20%', dataSource: '治疗参数+通路评估', action: '提示通路狭窄风险', owner: '通路小组', status: '启用', hitCount: 4, reviewCycle: '每周', nextAction: '预约通路检查' },
  { id: 'EFF-009', name: 'URR 达标分析', indicator: 'URR', population: '月度充分性评估', threshold: '< 65%', dataSource: 'LIS前后尿素', action: '生成疗效复查任务', owner: '质量管理组', status: '草稿', hitCount: 0, reviewCycle: '每月', nextAction: '发布前仿真' },
  { id: 'EFF-010', name: '感染指标联动', indicator: 'CRP/WBC', population: '导管患者', threshold: 'CRP升高且发热事件', dataSource: '检验+临床事件', action: '联动感控登记', owner: '感控管理', status: '启用', hitCount: 3, reviewCycle: '事件触发', nextAction: '感控复核' },
  { id: 'EFF-011', name: '费用负担风险分析', indicator: '欠费金额', population: '签约患者', threshold: '> 1000元 且继续治疗', dataSource: '费用明细', action: '导诊沟通和费用提醒', owner: '费用管理', status: '停用', hitCount: 1, reviewCycle: '签到时', nextAction: '评估启用' },
]);

const logs = ref([
  { time: '2026-05-14 12:10', patient: '李秀兰', indicator: 'Kt/V 1.12', result: '生成疗效预警', status: '成功' },
  { time: '2026-05-14 10:42', patient: '周建国', indicator: 'Hb 92 g/L', result: '生成贫血管理任务', status: '成功' },
  { time: '2026-05-14 09:20', patient: '陈家明', indicator: '低血压事件', result: '进入护理质量改进', status: '待复核' },
  { time: '2026-05-13 16:02', patient: '王敏', indicator: '血磷 2.1 mmol/L', result: '推送医生复核', status: '成功' },
]);

const effectCategoryRows = [
  { category: '常见病情评估疗效方案', object: '生命体征、体重、尿量、症状评分', method: '前后对比 + 达标判定', output: '病情改善/无效/恶化' },
  { category: '专科病情评估疗效方案', object: '透析充分性、容量、通路、抗凝、CKD-MBD', method: '阈值 + 趋势 + 连续次数', output: '专科疗效结论' },
  { category: '标准化检验结果疗效方案', object: 'Hb、Alb、P、PTH、K、URR、Kt/V', method: '标准化项目映射后判读', output: '达标/不达标清单' },
  { category: '期内发生率疗效方案', object: '低血压、凝血、感染、住院、急诊', method: '统计周期内发生率', output: '疗效风险等级' },
  { category: '血液净化中心质控疗效方案', object: '中心质控指标与院区对比', method: '质控阈值 + 同比环比', output: '质控改进建议' },
];

const effectHandleRows = [
  { rule: '疗效达标规则', action: '写入健康报告和统计快照', owner: '质控管理员', next: '进入报表趋势' },
  { rule: '疗效不达标处理规则', action: '生成医生复核、护士随访或 CQI 项目', owner: '责任团队', next: '进入预警/CQI闭环' },
  { rule: '复查确认规则', action: '按复查计划再次采集检验或治疗指标', owner: '主诊医生', next: '关闭或升级' },
];

const selectedRule = ref(rules.value[0]);
const editVisible = ref(false);
const testVisible = ref(false);
const publishVisible = ref(false);
const logVisible = ref(false);
const form = ref({ name: '', indicator: '', population: '', threshold: '', dataSource: '', action: '', owner: '', reviewCycle: '' });

const stats = [
  { label: '疗效方案', value: rules.value.length, tone: 'blue' },
  { label: '已启用', value: rules.value.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '今日命中', value: rules.value.reduce((sum, item) => sum + item.hitCount, 0), tone: 'orange' },
  { label: '高频复核', value: rules.value.filter((item) => ['每次归档', '每日', '事件触发'].includes(item.reviewCycle)).length, tone: 'red' },
  { label: '待发布', value: rules.value.filter((item) => item.status !== '启用').length, tone: 'blue' },
];

function tagType(value: string) {
  if (['启用', '成功'].includes(value)) return 'success';
  if (value.includes('<') || value.includes('>') || value.includes('低血压')) return 'danger';
  if (value.includes('待') || value === '草稿') return 'warning';
  return 'info';
}

function selectRule(row: EffectRule): void {
  selectedRule.value = row;
}

function openEdit(row?: EffectRule): void {
  if (row) selectedRule.value = row;
  form.value = { ...selectedRule.value };
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
            <h2>疗效分析方案</h2>
            <p>围绕充分性、贫血、营养、骨矿物质、容量和通路指标定义阈值，命中后进入医生复核、预警或 CQI。</p>
          </div>
          <div class="rule-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEdit()">新增疗效方案</el-button>
            <el-button :icon="Operation" @click="testVisible = true">阈值仿真</el-button>
            <el-button :icon="SwitchButton" @click="publishVisible = true">发布启用</el-button>
            <el-button :icon="Connection" @click="logVisible = true">分析日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="rule-filter" inline>
        <el-form-item label="指标类别"><el-select placeholder="全部指标" clearable><el-option label="充分性" value="adequacy" /><el-option label="贫血营养" value="nutrition" /><el-option label="容量通路" value="access" /></el-select></el-form-item>
        <el-form-item label="复核周期"><el-select placeholder="全部周期" clearable><el-option label="每次归档" value="archive" /><el-option label="每日" value="day" /><el-option label="每月" value="month" /></el-select></el-form-item>
        <el-form-item label="关键字"><el-input placeholder="方案、指标、阈值、动作" clearable /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="rule-stat-grid">
        <el-card v-for="item in stats" :key="item.label" :class="['rule-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="rule-main-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>疗效阈值规则</strong><el-tag effect="plain">指标数据 -> 阈值判断 -> 预警/CQI -> 复查</el-tag></div></template>
            <el-table :data="rules" border stripe highlight-current-row row-key="id" @row-click="selectRule">
              <el-table-column prop="name" label="方案名称" min-width="160" fixed="left" />
              <el-table-column prop="indicator" label="指标" min-width="110" />
              <el-table-column prop="population" label="适用人群" min-width="145" />
              <el-table-column prop="threshold" label="阈值" min-width="150"><template #default="{ row }"><el-tag :type="tagType(row.threshold)">{{ row.threshold }}</el-tag></template></el-table-column>
              <el-table-column prop="dataSource" label="数据来源" min-width="170" />
              <el-table-column prop="action" label="命中动作" min-width="210" />
              <el-table-column prop="owner" label="责任人" min-width="110" />
              <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
              <el-table-column prop="hitCount" label="命中" width="75" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }"><el-button link type="primary" @click.stop="openEdit(row)">维护</el-button><el-button link @click.stop="selectRule(row); testVisible = true">仿真</el-button><el-button link @click.stop="selectRule(row); publishVisible = true">发布</el-button><el-button link @click.stop="selectRule(row); logVisible = true">追溯</el-button></template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="rule-side-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>当前方案</strong><el-tag :type="tagType(selectedRule.status)">{{ selectedRule.status }}</el-tag></div></template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="指标">{{ selectedRule.indicator }}</el-descriptions-item>
              <el-descriptions-item label="阈值">{{ selectedRule.threshold }}</el-descriptions-item>
              <el-descriptions-item label="来源">{{ selectedRule.dataSource }}</el-descriptions-item>
              <el-descriptions-item label="动作">{{ selectedRule.action }}</el-descriptions-item>
              <el-descriptions-item label="复核周期">{{ selectedRule.reviewCycle }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16" class="rule-extra-grid">
      <el-col :xs="24" :xl="14">
        <el-card class="rule-main-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>疗效方案分类</strong><el-tag effect="plain">评估 / 检验 / 发生率 / 中心质控</el-tag></div></template>
          <el-table :data="effectCategoryRows" border stripe>
            <el-table-column prop="category" label="方案分类" min-width="185" />
            <el-table-column prop="object" label="判读对象" min-width="220" />
            <el-table-column prop="method" label="判读方式" min-width="170" />
            <el-table-column prop="output" label="输出" min-width="150" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :xl="10">
        <el-card class="rule-side-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>达标与不达标处理</strong><el-tag type="success" effect="plain">处理规则</el-tag></div></template>
          <el-table :data="effectHandleRows" border stripe>
            <el-table-column prop="rule" label="规则" min-width="130" />
            <el-table-column prop="action" label="动作" min-width="190" />
            <el-table-column prop="owner" label="责任人" min-width="110" />
            <el-table-column prop="next" label="下一环节" min-width="130" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editVisible" title="维护疗效分析方案" width="760px">
      <el-form :model="form" label-width="112px">
        <el-form-item label="方案名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="指标名称"><el-input v-model="form.indicator" /></el-form-item>
        <el-form-item label="适用人群"><el-input v-model="form.population" /></el-form-item>
        <el-form-item label="阈值条件"><el-input v-model="form.threshold" /></el-form-item>
        <el-form-item label="数据来源"><el-input v-model="form.dataSource" /></el-form-item>
        <el-form-item label="命中动作"><el-input v-model="form.action" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="复核周期"><el-input v-model="form.reviewCycle" /></el-form-item>
        <el-form-item label="责任人"><el-input v-model="form.owner" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editVisible = false">取消</el-button><el-button type="primary" @click="editVisible = false; submit('疗效方案已保存，等待阈值仿真')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="testVisible" title="疗效阈值仿真" width="680px">
      <el-form label-width="110px"><el-form-item label="样本范围"><el-input placeholder="选择日期、患者或归档记录" /></el-form-item><el-form-item label="模拟指标"><el-input :value="`${selectedRule.indicator} ${selectedRule.threshold}`" /></el-form-item><el-form-item label="命中动作"><el-input type="textarea" :rows="3" :value="selectedRule.action" /></el-form-item></el-form>
      <template #footer><el-button @click="testVisible = false">取消</el-button><el-button type="primary" @click="testVisible = false; submit('疗效阈值仿真完成，已生成命中样本')">开始仿真</el-button></template>
    </el-dialog>

    <el-dialog v-model="publishVisible" title="发布疗效分析方案" width="540px">
      <el-alert type="warning" show-icon :closable="false" title="发布后将影响预警、CQI 和统计报表口径，请确认阈值已经审核。" />
      <el-form label-width="96px" style="margin-top: 16px"><el-form-item label="发布版本"><el-input value="v2026.05.14" /></el-form-item><el-form-item label="审核意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form>
      <template #footer><el-button @click="publishVisible = false">取消</el-button><el-button type="primary" @click="publishVisible = false; selectedRule.status = '启用'; submit('疗效方案已发布启用')">确认发布</el-button></template>
    </el-dialog>

    <el-drawer v-model="logVisible" title="疗效分析日志" size="720px">
      <el-table :data="logs" border stripe><el-table-column prop="time" label="时间" width="150" /><el-table-column prop="patient" label="患者" width="100" /><el-table-column prop="indicator" label="指标" min-width="150" /><el-table-column prop="result" label="结果" min-width="190" /><el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column></el-table>
    </el-drawer>
  </section>
</template>
