<script setup lang="ts">
import { ref } from 'vue';
import { Connection, DocumentAdd, Operation, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type TaskRule = {
  id: string;
  name: string;
  source: string;
  condition: string;
  taskType: string;
  assignee: string;
  sla: string;
  closeRule: string;
  status: string;
  lastRun: string;
  hitCount: number;
  nextAction: string;
};

type LogRow = {
  time: string;
  source: string;
  task: string;
  assignee: string;
  deadline: string;
  status: string;
};

const rules = ref<TaskRule[]>([
  { id: 'TSK-001', name: '新入患者资料补全', source: '导诊建档保存', condition: '医保、联系人、签约资料存在缺项', taskType: '导诊补录', assignee: '导诊护士', sla: '2小时', closeRule: '资料完整并复核', status: '启用', lastRun: '2026-05-14 08:10', hitCount: 9, nextAction: '查看补录任务' },
  { id: 'TSK-002', name: '预约审核待处理', source: '治疗申请提交', condition: '患者已签约且申请未审核', taskType: '预约审核', assignee: '导诊主管', sla: '4小时', closeRule: '审核通过或退回', status: '启用', lastRun: '2026-05-14 09:25', hitCount: 14, nextAction: '分派审核人' },
  { id: 'TSK-003', name: '通路评估到期', source: '每日定时扫描', condition: '距上次评估 >= 30天', taskType: '通路评估', assignee: '主诊医生+责任护士', sla: '3天', closeRule: '医生护士共同提交', status: '启用', lastRun: '2026-05-14 06:30', hitCount: 21, nextAction: '查看到期清单' },
  { id: 'TSK-004', name: '长期医嘱复核', source: '长期医嘱临近到期', condition: '剩余有效期 <= 3天', taskType: '医嘱复核', assignee: '主诊医生', sla: '24小时', closeRule: '续用、停用或调整', status: '启用', lastRun: '2026-05-14 07:00', hitCount: 11, nextAction: '医生复核' },
  { id: 'TSK-005', name: '治疗记录缺项补录', source: '提交归档前检查', condition: '透前、监测、下机、签名存在缺项', taskType: '记录补录', assignee: '责任护士', sla: '当班', closeRule: '完整性检查通过', status: '启用', lastRun: '2026-05-14 12:18', hitCount: 6, nextAction: '提醒责任护士' },
  { id: 'TSK-006', name: '危急值通知闭环', source: '检验危急值复核', condition: '危急值已发布且未确认', taskType: '危急值处置', assignee: '主诊医生', sla: '30分钟', closeRule: '医生确认并记录处置', status: '启用', lastRun: '2026-05-14 10:12', hitCount: 4, nextAction: '催办确认' },
  { id: 'TSK-007', name: '设备维修复测', source: '维修工单完成', condition: '设备状态=待复测', taskType: '设备复测', assignee: '技师组长', sla: '2小时', closeRule: '复测合格并放行', status: '启用', lastRun: '2026-05-14 09:55', hitCount: 3, nextAction: '安排复测' },
  { id: 'TSK-008', name: '低库存补货任务', source: '库存预警生成', condition: '安全库存不足或近效期替换', taskType: '补货处理', assignee: '药耗管理员', sla: '1天', closeRule: '入库或调拨完成', status: '启用', lastRun: '2026-05-14 08:00', hitCount: 8, nextAction: '生成采购单' },
  { id: 'TSK-009', name: '感控整改复查', source: '感控问题登记', condition: '整改到期且未复查', taskType: '整改复查', assignee: '感控护士', sla: '到期日', closeRule: '复查通过并关闭', status: '待复核', lastRun: '2026-05-13 17:30', hitCount: 5, nextAction: '复核整改模板' },
  { id: 'TSK-010', name: '居家报告审核', source: '患者上传报告', condition: '报告类型为检验或异常症状', taskType: '居家审核', assignee: '随访护士', sla: '12小时', closeRule: '审核通过或转医生', status: '草稿', lastRun: '-', hitCount: 0, nextAction: '发布前测试' },
  { id: 'TSK-011', name: 'CRC访视窗口提醒', source: 'SoA访视计划', condition: '访视窗口 T-3 天', taskType: 'CRC访视', assignee: 'CRC研究护士', sla: '访视窗口内', closeRule: '访视完成或偏离记录', status: '停用', lastRun: '2026-05-10 08:00', hitCount: 2, nextAction: '评估研究项目启用' },
]);

const logs = ref<LogRow[]>([
  { time: '2026-05-14 12:18', source: 'ARCH-20260514-022', task: '治疗记录缺项补录', assignee: '刘护士', deadline: '当班完成', status: '已生成' },
  { time: '2026-05-14 10:12', source: 'LAB-20260514-019', task: '危急值通知闭环', assignee: '赵医生', deadline: '30分钟', status: '已确认' },
  { time: '2026-05-14 09:55', source: 'DEV-ROA-003', task: '设备维修复测', assignee: '周技师', deadline: '2小时', status: '处理中' },
  { time: '2026-05-14 08:10', source: 'PAT-20260514-006', task: '新入患者资料补全', assignee: '导诊护士', deadline: '2小时', status: '已生成' },
]);

const taskSchemeRows = [
  { scheme: '按频次推送方案', scope: '所有患者、诊断名称、随访名称、预警事件', trigger: '每日/每周/月度定时扫描', output: '周期任务批量生成' },
  { scheme: '按间隔时间推送方案', scope: '签约、解约、手术、危急值、入院/出院', trigger: '事件发生后 N 小时/天', output: '延迟随访和复核任务' },
  { scheme: '诊断相关任务方案', scope: '高钾、贫血、感染、透析充分性不足', trigger: '智能诊断确认或否认', output: '医生处理、复查医嘱、健康报告' },
  { scheme: '手术/随访名称相关任务方案', scope: '深静脉穿刺、通路手术、随访名称转换', trigger: '申请、预约、完成、退出', output: '预约审核、术后随访、名称更新' },
  { scheme: '签约/解约相关任务方案', scope: '新签、续约、解约、服务包变更', trigger: '合同状态变化', output: '导诊复核、费用结算、责任团队调整' },
];

const autoSplitRows = [
  { source: '危急值事件', split: '医生确认、护士观察、复查检验', ownerRule: '主诊医生 + 责任护士', closeRule: '处置记录和复查计划完成' },
  { source: '治疗记录缺项', split: '补签名、补消毒、补治疗小结', ownerRule: '当班护士 + 护士长', closeRule: '归档完整性检查通过' },
  { source: 'CQI项目', split: '根因分析、整改执行、效果复查', ownerRule: '项目责任人分派', closeRule: '复查达标并关闭项目' },
];

const selectedRule = ref(rules.value[0]);
const editVisible = ref(false);
const testVisible = ref(false);
const publishVisible = ref(false);
const logVisible = ref(false);
const form = ref({ name: '', source: '', condition: '', taskType: '', assignee: '', sla: '', closeRule: '', escalation: '' });

const stats = [
  { label: '任务方案', value: rules.value.length, tone: 'blue' },
  { label: '已启用', value: rules.value.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '今日生成', value: rules.value.reduce((sum, item) => sum + item.hitCount, 0), tone: 'orange' },
  { label: '高时效任务', value: rules.value.filter((item) => item.sla.includes('分钟') || item.sla.includes('当班')).length, tone: 'red' },
  { label: '待复核', value: rules.value.filter((item) => item.status !== '启用').length, tone: 'blue' },
];

function tagType(value: string) {
  if (['启用', '已确认'].includes(value)) return 'success';
  if (value.includes('分钟') || value === '处理中') return 'warning';
  if (value === '停用') return 'info';
  if (value.includes('危急') || value.includes('当班')) return 'danger';
  return value.includes('待') || value === '草稿' ? 'warning' : 'info';
}

function selectRule(row: TaskRule): void {
  selectedRule.value = row;
}

function openEdit(row?: TaskRule): void {
  if (row) selectedRule.value = row;
  form.value = {
    name: selectedRule.value.name,
    source: selectedRule.value.source,
    condition: selectedRule.value.condition,
    taskType: selectedRule.value.taskType,
    assignee: selectedRule.value.assignee,
    sla: selectedRule.value.sla,
    closeRule: selectedRule.value.closeRule,
    escalation: '超时后推送科室看板和员工主页',
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
            <h2>工作任务方案</h2>
            <p>把导诊、医生、护士、检验、设备、感控、居家等业务事件转成可分派、可催办、可关闭的工作任务。</p>
          </div>
          <div class="rule-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEdit()">新增任务方案</el-button>
            <el-button :icon="Operation" @click="testVisible = true">生成测试</el-button>
            <el-button :icon="SwitchButton" @click="publishVisible = true">发布启用</el-button>
            <el-button :icon="Connection" @click="logVisible = true">生成日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="rule-filter" inline>
        <el-form-item label="任务来源">
          <el-select placeholder="全部来源" clearable>
            <el-option label="导诊" value="guide" />
            <el-option label="医生站" value="doctor" />
            <el-option label="护士站" value="nurse" />
            <el-option label="设备/库存/感控" value="support" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理角色">
          <el-select placeholder="全部角色" clearable>
            <el-option label="医生" value="doctor" />
            <el-option label="护士" value="nurse" />
            <el-option label="技师" value="tech" />
            <el-option label="导诊" value="guide" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字"><el-input placeholder="方案、任务类型、关闭规则" clearable /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="rule-stat-grid">
        <el-card v-for="item in stats" :key="item.label" :class="['rule-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="rule-main-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>任务生成规则</strong><el-tag effect="plain">业务事件 -> 责任人 -> SLA -> 关闭回写</el-tag></div></template>
            <el-table :data="rules" border stripe highlight-current-row row-key="id" @row-click="selectRule">
              <el-table-column prop="name" label="方案名称" min-width="160" fixed="left" />
              <el-table-column prop="source" label="来源事件" min-width="150" />
              <el-table-column prop="condition" label="生成条件" min-width="230" />
              <el-table-column prop="taskType" label="任务类型" min-width="110" />
              <el-table-column prop="assignee" label="责任人" min-width="140" />
              <el-table-column prop="sla" label="时限" width="90"><template #default="{ row }"><el-tag :type="tagType(row.sla)">{{ row.sla }}</el-tag></template></el-table-column>
              <el-table-column prop="closeRule" label="关闭规则" min-width="170" />
              <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
              <el-table-column prop="hitCount" label="今日生成" width="95" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="openEdit(row)">维护</el-button>
                  <el-button link @click.stop="selectRule(row); testVisible = true">测试</el-button>
                  <el-button link @click.stop="selectRule(row); publishVisible = true">发布</el-button>
                  <el-button link @click.stop="selectRule(row); logVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="rule-side-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>当前任务闭环</strong><el-tag :type="tagType(selectedRule.status)">{{ selectedRule.status }}</el-tag></div></template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="来源">{{ selectedRule.source }}</el-descriptions-item>
              <el-descriptions-item label="条件">{{ selectedRule.condition }}</el-descriptions-item>
              <el-descriptions-item label="责任">{{ selectedRule.assignee }}</el-descriptions-item>
              <el-descriptions-item label="时限">{{ selectedRule.sla }}</el-descriptions-item>
              <el-descriptions-item label="关闭">{{ selectedRule.closeRule }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16" class="rule-extra-grid">
      <el-col :xs="24" :xl="14">
        <el-card class="rule-main-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>任务方案分类</strong><el-tag effect="plain">频次 / 间隔 / 诊断 / 手术 / 随访 / 签约</el-tag></div></template>
          <el-table :data="taskSchemeRows" border stripe>
            <el-table-column prop="scheme" label="方案" min-width="160" />
            <el-table-column prop="scope" label="适用范围" min-width="220" />
            <el-table-column prop="trigger" label="推送规则" min-width="170" />
            <el-table-column prop="output" label="输出任务" min-width="170" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :xl="10">
        <el-card class="rule-side-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>工作任务自动分解</strong><el-tag type="success" effect="plain">父任务 -> 子任务</el-tag></div></template>
          <el-table :data="autoSplitRows" border stripe>
            <el-table-column prop="source" label="来源" min-width="110" />
            <el-table-column prop="split" label="拆分任务" min-width="180" />
            <el-table-column prop="ownerRule" label="责任规则" min-width="150" />
            <el-table-column prop="closeRule" label="关闭规则" min-width="190" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editVisible" title="维护工作任务方案" width="760px">
      <el-form :model="form" label-width="112px">
        <el-form-item label="方案名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="来源事件"><el-input v-model="form.source" /></el-form-item>
        <el-form-item label="生成条件"><el-input v-model="form.condition" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="任务类型"><el-input v-model="form.taskType" /></el-form-item>
        <el-form-item label="责任规则"><el-input v-model="form.assignee" placeholder="按主诊医生、责任护士、岗位或值班表派发" /></el-form-item>
        <el-form-item label="SLA时限"><el-input v-model="form.sla" /></el-form-item>
        <el-form-item label="关闭规则"><el-input v-model="form.closeRule" /></el-form-item>
        <el-form-item label="超时升级"><el-input v-model="form.escalation" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editVisible = false">取消</el-button><el-button type="primary" @click="editVisible = false; submit('任务方案已保存，下一步进行生成测试')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="testVisible" title="任务生成测试" width="680px">
      <el-form label-width="112px">
        <el-form-item label="业务来源编号"><el-input placeholder="如 PAT、LAB、ARCH、DEV 编号" /></el-form-item>
        <el-form-item label="模拟条件"><el-input type="textarea" :rows="3" :value="selectedRule.condition" /></el-form-item>
        <el-form-item label="派发结果"><el-input :value="`${selectedRule.taskType} / ${selectedRule.assignee} / ${selectedRule.sla}`" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="testVisible = false">取消</el-button><el-button type="primary" @click="testVisible = false; submit('任务生成测试通过，已写入仿真日志')">开始测试</el-button></template>
    </el-dialog>

    <el-dialog v-model="publishVisible" title="发布工作任务方案" width="560px">
      <el-alert type="warning" show-icon :closable="false" title="发布后会在员工主页和科室看板自动生成待办，请确认责任规则和超时升级策略。" />
      <el-form label-width="96px" style="margin-top: 16px">
        <el-form-item label="发布范围"><el-checkbox-group><el-checkbox label="员工主页" /><el-checkbox label="科室看板" /><el-checkbox label="原业务页面" /></el-checkbox-group></el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="publishVisible = false">取消</el-button><el-button type="primary" @click="publishVisible = false; selectedRule.status = '启用'; submit('任务方案已发布启用')">确认发布</el-button></template>
    </el-dialog>

    <el-drawer v-model="logVisible" title="任务生成日志" size="720px">
      <el-table :data="logs" border stripe>
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="source" label="来源" width="150" />
        <el-table-column prop="task" label="任务" min-width="150" />
        <el-table-column prop="assignee" label="责任人" width="110" />
        <el-table-column prop="deadline" label="期限" width="110" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
      </el-table>
    </el-drawer>
  </section>
</template>
