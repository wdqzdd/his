<script setup lang="ts">
import { ref } from 'vue';
import { Connection, DocumentAdd, Operation, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type CqiRule = {
  id: string;
  name: string;
  problemSource: string;
  trigger: string;
  projectType: string;
  owner: string;
  rectifyTask: string;
  reviewPlan: string;
  closeRule: string;
  status: string;
  hitCount: number;
  nextAction: string;
};

const rules = ref<CqiRule[]>([
  { id: 'CQI-001', name: 'Kt/V 不达标转 CQI', problemSource: '疗效分析', trigger: '连续两月 Kt/V < 1.20', projectType: '疗效改进', owner: '质量管理组', rectifyTask: '复核处方、血流量和治疗时间', reviewPlan: '下月检验复查', closeRule: '连续两次达标', status: '启用', hitCount: 3, nextAction: '生成项目' },
  { id: 'CQI-002', name: '透中低血压高发改进', problemSource: '护理预警', trigger: '班次发生率 > 10%', projectType: '护理质量', owner: '护士长', rectifyTask: '修订透中监测和处置流程', reviewPlan: '每周复盘', closeRule: '连续两周低于阈值', status: '启用', hitCount: 4, nextAction: '安排复盘' },
  { id: 'CQI-003', name: '手卫生依从率改进', problemSource: '感控检查', trigger: '月度依从率 < 95%', projectType: '感控改进', owner: '感控护士', rectifyTask: '现场培训和抽查', reviewPlan: '两周后复查', closeRule: '复查达标并留痕', status: '启用', hitCount: 2, nextAction: '生成培训' },
  { id: 'CQI-004', name: '导管感染事件改进', problemSource: '院感事件', trigger: '导管感染或同类事件复发', projectType: '感染控制', owner: '感控负责人', rectifyTask: '分析连接断开和消毒流程', reviewPlan: '事件关闭后复查', closeRule: '整改复核通过', status: '启用', hitCount: 1, nextAction: '创建 RCA' },
  { id: 'CQI-005', name: '治疗记录缺项率改进', problemSource: '归档审核', trigger: '缺项率 > 5%', projectType: '文书质量', owner: '护士长', rectifyTask: '班后抽审和模板优化', reviewPlan: '每日抽审', closeRule: '连续7日低于阈值', status: '启用', hitCount: 6, nextAction: '抽审缺项' },
  { id: 'CQI-006', name: '设备故障重复发生改进', problemSource: '设备维修', trigger: '同设备30天内维修 >= 2次', projectType: '设备质量', owner: '技师组长', rectifyTask: '保养计划和备件分析', reviewPlan: '维修后7天复测', closeRule: '复测合格且无复发', status: '启用', hitCount: 2, nextAction: '调整保养计划' },
  { id: 'CQI-007', name: '水质异常整改改进', problemSource: '水质记录', trigger: '任一关键指标异常', projectType: '水质安全', owner: '设备负责人', rectifyTask: '复测、消毒、根因分析', reviewPlan: '24小时复测', closeRule: '两次复测合格', status: '启用', hitCount: 2, nextAction: '执行复测' },
  { id: 'CQI-008', name: '药耗批号追溯异常改进', problemSource: '药耗费用', trigger: '消耗记录缺批号或费用不一致', projectType: '药耗质量', owner: '药耗管理员', rectifyTask: '补录批号并核对费用', reviewPlan: '月底抽查', closeRule: '账实一致', status: '待复核', hitCount: 5, nextAction: '复核规则' },
  { id: 'CQI-009', name: '危急值确认超时改进', problemSource: '检验闭环', trigger: '确认超时率 > 2%', projectType: '安全质量', owner: '医务医事', rectifyTask: '调整通知升级和责任医生规则', reviewPlan: '每周统计', closeRule: '超时率达标', status: '启用', hitCount: 3, nextAction: '查看超时清单' },
  { id: 'CQI-010', name: '居家报告审核超时改进', problemSource: '居家主页', trigger: '审核超时 > 12小时', projectType: '随访质量', owner: '随访团队', rectifyTask: '优化分派和消息提醒', reviewPlan: '每周复盘', closeRule: '连续两周达标', status: '草稿', hitCount: 0, nextAction: '发布前测试' },
  { id: 'CQI-011', name: 'CRC 数据质疑超期改进', problemSource: 'CRC数据核查', trigger: '质疑超过7天未关闭', projectType: '研究质量', owner: 'CRC负责人', rectifyTask: '数据核查和源文档补录', reviewPlan: '每周研究例会', closeRule: '质疑关闭', status: '停用', hitCount: 1, nextAction: '按项目启用' },
]);

const logs = ref([
  { time: '2026-05-14 13:00', project: '治疗记录缺项率改进', source: '归档审核', task: '班后抽审和模板优化', owner: '护士长', status: '已生成' },
  { time: '2026-05-14 11:20', project: '透中低血压高发改进', source: '护理预警', task: '每周复盘', owner: '护士长', status: '处理中' },
  { time: '2026-05-14 09:30', project: '水质异常整改改进', source: '水质记录', task: '24小时复测', owner: '设备负责人', status: '待复核' },
  { time: '2026-05-13 18:10', project: '手卫生依从率改进', source: '感控检查', task: '现场培训', owner: '感控护士', status: '已关闭' },
]);

const cqiMethodRows = [
  { item: 'CQI项目配置', content: '项目类型、责任团队、整改模板、复查周期', output: 'CQI项目主档' },
  { item: 'CQI分类法', content: '疗效、护理、感控、设备、水质、药耗、研究质量', output: '统一质量问题分类' },
  { item: 'CQI判读标准', content: '指标阈值、重复发生、趋势恶化、复查不达标', output: '是否自动立项' },
  { item: 'CQI自动识别方案', content: '从预警、报表、治疗归档、感控和设备记录识别', output: '候选CQI项目' },
  { item: 'CQI动态表单', content: '原因分析、整改措施、责任人、完成证据', output: '整改记录和审计' },
];

const cqiEffectRows = [
  { stage: '任务生成', check: '自动创建整改任务并推送责任人', evidence: '任务编号、SLA、责任人' },
  { stage: '整改记录', check: '登记根因、措施、附件和完成时间', evidence: '整改记录、附件、签名' },
  { stage: '效果评估', check: '复查指标是否达标，支持前后对比', evidence: '指标快照、趋势图' },
  { stage: '复查关闭', check: '责任人复查，质控管理员确认关闭', evidence: '复查记录、关闭意见' },
];

const selectedRule = ref(rules.value[0]);
const editVisible = ref(false);
const testVisible = ref(false);
const publishVisible = ref(false);
const logVisible = ref(false);
const form = ref({ name: '', problemSource: '', trigger: '', projectType: '', owner: '', rectifyTask: '', reviewPlan: '', closeRule: '' });

const stats = [
  { label: 'CQI方案', value: rules.value.length, tone: 'blue' },
  { label: '已启用', value: rules.value.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '今日项目', value: rules.value.reduce((sum, item) => sum + item.hitCount, 0), tone: 'orange' },
  { label: '安全质量', value: rules.value.filter((item) => item.projectType.includes('安全') || item.projectType.includes('感控') || item.projectType.includes('感染')).length, tone: 'red' },
  { label: '待发布', value: rules.value.filter((item) => item.status !== '启用').length, tone: 'blue' },
];

function tagType(value: string) {
  if (['启用', '已关闭'].includes(value)) return 'success';
  if (value.includes('感染') || value.includes('安全') || value.includes('水质')) return 'danger';
  if (value.includes('待') || value === '处理中' || value === '草稿') return 'warning';
  return 'info';
}

function selectRule(row: CqiRule): void {
  selectedRule.value = row;
}

function openEdit(row?: CqiRule): void {
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
            <h2>CQI方案</h2>
            <p>把疗效、护理、感控、设备、药耗和研究质量问题转成持续改进项目，明确整改、复查和关闭标准。</p>
          </div>
          <div class="rule-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEdit()">新增CQI方案</el-button>
            <el-button :icon="Operation" @click="testVisible = true">项目仿真</el-button>
            <el-button :icon="SwitchButton" @click="publishVisible = true">发布启用</el-button>
            <el-button :icon="Connection" @click="logVisible = true">项目日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="rule-filter" inline>
        <el-form-item label="问题来源"><el-select placeholder="全部来源" clearable><el-option label="疗效分析" value="effect" /><el-option label="护理预警" value="nurse" /><el-option label="感控设备" value="safety" /><el-option label="药耗研究" value="ops" /></el-select></el-form-item>
        <el-form-item label="项目类型"><el-select placeholder="全部类型" clearable><el-option label="疗效改进" value="effect" /><el-option label="护理质量" value="nurse" /><el-option label="感控改进" value="infection" /><el-option label="设备质量" value="device" /></el-select></el-form-item>
        <el-form-item label="关键字"><el-input placeholder="方案、触发条件、整改任务" clearable /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="rule-stat-grid">
        <el-card v-for="item in stats" :key="item.label" :class="['rule-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="rule-main-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>CQI生成规则</strong><el-tag effect="plain">问题识别 -> 整改任务 -> 复查 -> 关闭</el-tag></div></template>
            <el-table :data="rules" border stripe highlight-current-row row-key="id" @row-click="selectRule">
              <el-table-column prop="name" label="方案名称" min-width="170" fixed="left" />
              <el-table-column prop="problemSource" label="问题来源" min-width="120" />
              <el-table-column prop="trigger" label="触发条件" min-width="220" />
              <el-table-column prop="projectType" label="项目类型" min-width="110"><template #default="{ row }"><el-tag :type="tagType(row.projectType)">{{ row.projectType }}</el-tag></template></el-table-column>
              <el-table-column prop="owner" label="责任人" min-width="110" />
              <el-table-column prop="rectifyTask" label="整改任务" min-width="210" />
              <el-table-column prop="reviewPlan" label="复查计划" min-width="130" />
              <el-table-column prop="closeRule" label="关闭规则" min-width="160" />
              <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
              <el-table-column prop="hitCount" label="生成" width="75" />
              <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }"><el-button link type="primary" @click.stop="openEdit(row)">维护</el-button><el-button link @click.stop="selectRule(row); testVisible = true">仿真</el-button><el-button link @click.stop="selectRule(row); publishVisible = true">发布</el-button><el-button link @click.stop="selectRule(row); logVisible = true">追溯</el-button></template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="rule-side-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>当前CQI闭环</strong><el-tag :type="tagType(selectedRule.status)">{{ selectedRule.status }}</el-tag></div></template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="来源">{{ selectedRule.problemSource }}</el-descriptions-item>
              <el-descriptions-item label="触发">{{ selectedRule.trigger }}</el-descriptions-item>
              <el-descriptions-item label="整改">{{ selectedRule.rectifyTask }}</el-descriptions-item>
              <el-descriptions-item label="复查">{{ selectedRule.reviewPlan }}</el-descriptions-item>
              <el-descriptions-item label="关闭">{{ selectedRule.closeRule }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16" class="rule-extra-grid">
      <el-col :xs="24" :xl="14">
        <el-card class="rule-main-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>CQI方法与判读</strong><el-tag effect="plain">分类法 / 判读标准 / 自动识别 / 动态表单</el-tag></div></template>
          <el-table :data="cqiMethodRows" border stripe>
            <el-table-column prop="item" label="功能项" min-width="150" />
            <el-table-column prop="content" label="配置内容" min-width="260" />
            <el-table-column prop="output" label="输出" min-width="170" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :xl="10">
        <el-card class="rule-side-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>CQI任务与效果评估</strong><el-tag type="success" effect="plain">生成 / 整改 / 评估 / 复查</el-tag></div></template>
          <el-table :data="cqiEffectRows" border stripe>
            <el-table-column prop="stage" label="阶段" width="100" />
            <el-table-column prop="check" label="效果判定" min-width="210" />
            <el-table-column prop="evidence" label="留痕" min-width="160" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editVisible" title="维护CQI方案" width="780px">
      <el-form :model="form" label-width="112px">
        <el-form-item label="方案名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="问题来源"><el-input v-model="form.problemSource" /></el-form-item>
        <el-form-item label="触发条件"><el-input v-model="form.trigger" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="项目类型"><el-input v-model="form.projectType" /></el-form-item>
        <el-form-item label="责任人"><el-input v-model="form.owner" /></el-form-item>
        <el-form-item label="整改任务"><el-input v-model="form.rectifyTask" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="复查计划"><el-input v-model="form.reviewPlan" /></el-form-item>
        <el-form-item label="关闭规则"><el-input v-model="form.closeRule" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editVisible = false">取消</el-button><el-button type="primary" @click="editVisible = false; submit('CQI方案已保存，等待项目仿真')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="testVisible" title="CQI项目仿真" width="680px">
      <el-form label-width="110px"><el-form-item label="问题样本"><el-input placeholder="输入预警、感控或疗效记录编号" /></el-form-item><el-form-item label="整改任务"><el-input type="textarea" :rows="3" :value="selectedRule.rectifyTask" /></el-form-item><el-form-item label="关闭标准"><el-input :value="selectedRule.closeRule" /></el-form-item></el-form>
      <template #footer><el-button @click="testVisible = false">取消</el-button><el-button type="primary" @click="testVisible = false; submit('CQI项目仿真完成，已生成试运行任务')">开始仿真</el-button></template>
    </el-dialog>

    <el-dialog v-model="publishVisible" title="发布CQI方案" width="540px">
      <el-alert type="warning" show-icon :closable="false" title="发布后会自动创建 CQI 项目和整改任务，请确认复查周期和关闭标准。" />
      <el-form label-width="96px" style="margin-top: 16px"><el-form-item label="发布版本"><el-input value="CQI-v2026.05.14" /></el-form-item><el-form-item label="审核意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form>
      <template #footer><el-button @click="publishVisible = false">取消</el-button><el-button type="primary" @click="publishVisible = false; selectedRule.status = '启用'; submit('CQI方案已发布启用')">确认发布</el-button></template>
    </el-dialog>

    <el-drawer v-model="logVisible" title="CQI项目日志" size="760px">
      <el-table :data="logs" border stripe><el-table-column prop="time" label="时间" width="150" /><el-table-column prop="project" label="项目" min-width="170" /><el-table-column prop="source" label="来源" width="120" /><el-table-column prop="task" label="任务" min-width="160" /><el-table-column prop="owner" label="责任人" width="110" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column></el-table>
    </el-drawer>
  </section>
</template>
