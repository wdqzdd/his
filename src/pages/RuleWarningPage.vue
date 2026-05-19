<script setup lang="ts">
import { ref } from 'vue';
import { Connection, DocumentAdd, Operation, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type WarningRule = {
  id: string;
  name: string;
  grade: string;
  source: string;
  trigger: string;
  owner: string;
  handlePath: string;
  reviewRole: string;
  closeRule: string;
  status: string;
  hitCount: number;
  nextAction: string;
};

const rules = ref<WarningRule[]>([
  { id: 'WAR-001', name: '检验危急值预警', grade: '一级', source: 'LIS结果复核', trigger: '血钾、血红蛋白、感染指标达到危急值', owner: '主诊医生', handlePath: '医生确认并记录处置', reviewRole: '值班医生复核', closeRule: '处置记录+复查计划', status: '启用', hitCount: 4, nextAction: '跟进未确认' },
  { id: 'WAR-002', name: '透中低血压预警', grade: '一级', source: '透中监测', trigger: '收缩压 < 90 或下降 > 30', owner: '责任护士', handlePath: '护理处置并通知医生', reviewRole: '护士长复核', closeRule: '症状缓解+记录完整', status: '启用', hitCount: 11, nextAction: '优化处置模板' },
  { id: 'WAR-003', name: '水质异常禁上机', grade: '一级', source: '水处理记录', trigger: '电导率、余氯、菌落异常', owner: '技师组长', handlePath: '设备停用、复测、通知护士站', reviewRole: '设备负责人', closeRule: '复测合格并放行', status: '启用', hitCount: 2, nextAction: '复测水质' },
  { id: 'WAR-004', name: '设备故障影响排班', grade: '二级', source: '设备巡检/维修', trigger: '设备状态=故障或待维修', owner: '设备技师', handlePath: '维修派工并同步排班', reviewRole: '护士长', closeRule: '维修完成+机位可用', status: '启用', hitCount: 5, nextAction: '调整机位' },
  { id: 'WAR-005', name: '院感隔离风险', grade: '一级', source: '感控登记', trigger: '感染筛查阳性或隔离标记缺失', owner: '感控护士', handlePath: '隔离分区复核并通知排班', reviewRole: '感控负责人', closeRule: '隔离措施确认', status: '启用', hitCount: 3, nextAction: '复核隔离区' },
  { id: 'WAR-006', name: '通路事件预警', grade: '二级', source: '通路事件登记', trigger: '渗血、堵管、震颤减弱', owner: '通路小组', handlePath: '医生评估并预约检查', reviewRole: '主诊医生', closeRule: '评估完成或转诊', status: '启用', hitCount: 6, nextAction: '预约评估' },
  { id: 'WAR-007', name: '治疗记录缺项预警', grade: '三级', source: '归档完整性检查', trigger: '签名、消毒、监测或小结缺项', owner: '责任护士', handlePath: '补录并重新提交', reviewRole: '护士长', closeRule: '完整性通过', status: '启用', hitCount: 13, nextAction: '催办补录' },
  { id: 'WAR-008', name: '欠费治疗风险', grade: '三级', source: '签到/费用明细', trigger: '欠费 > 1000 且继续治疗', owner: '导诊台', handlePath: '费用沟通并标记风险', reviewRole: '费用管理员', closeRule: '沟通记录或费用处理', status: '待复核', hitCount: 7, nextAction: '确认启用范围' },
  { id: 'WAR-009', name: '库存断供预警', grade: '二级', source: '库存流水', trigger: '关键耗材低于安全库存', owner: '药耗管理员', handlePath: '调拨或采购', reviewRole: '库房主管', closeRule: '库存恢复安全线', status: '启用', hitCount: 8, nextAction: '补货处理' },
  { id: 'WAR-010', name: '居家症状上报预警', grade: '二级', source: '患者端上报', trigger: '胸闷、发热、血压异常', owner: '随访护士', handlePath: '远程随访或转医生', reviewRole: '主诊医生', closeRule: '随访记录完成', status: '草稿', hitCount: 0, nextAction: '仿真发布' },
  { id: 'WAR-011', name: '研究药物偏离预警', grade: '二级', source: 'CRC访视', trigger: '研究药物漏发、漏回收或超窗', owner: 'CRC', handlePath: '记录偏离并通知研究者', reviewRole: 'PI', closeRule: '偏离关闭', status: '停用', hitCount: 1, nextAction: '项目启用后发布' },
]);

const logs = ref([
  { time: '2026-05-14 11:20', warning: '透中低血压预警', patient: '陈家明', owner: '刘护士', result: '已处置待复核', status: '待复核' },
  { time: '2026-05-14 10:16', warning: '检验危急值预警', patient: '王敏', owner: '赵医生', result: '已确认处置', status: '关闭' },
  { time: '2026-05-14 09:12', warning: '水质异常禁上机', patient: 'A区', owner: '周技师', result: '设备停用复测', status: '处理中' },
  { time: '2026-05-14 08:50', warning: '治疗记录缺项预警', patient: '李秀兰', owner: '责任护士', result: '已催办', status: '处理中' },
]);

const warningCategoryRows = [
  { category: '常见病情评估预警方案', source: '生命体征、体重、症状', judgement: '阈值或异常趋势', level: '二级/三级' },
  { category: '专科病情评估预警方案', source: '透析充分性、通路、抗凝、容量', judgement: '专科风险规则', level: '一级/二级' },
  { category: '标准化检验结果预警方案', source: 'LIS标准项目、危急值', judgement: '参考范围、危急值、连续异常', level: '一级' },
  { category: '期内发生率预警方案', source: '并发症、感染、跌倒、设备故障', judgement: '统计期内次数/发生率', level: '二级' },
  { category: '质控项目预警方案', source: '质控指标、报表、CQI复查', judgement: '达标率低于阈值', level: '二级/三级' },
];

const warningJudgementRows = [
  { item: '预警判读标准', content: '阈值、趋势、连续次数、发生率、组合条件', output: '是否生成预警事件' },
  { item: '预警分级规则', content: '一级、二级、三级；绑定颜色、升级和阻断动作', output: '看板风险等级和处理优先级' },
  { item: '预警处理时限', content: '30分钟、2小时、当班、到期日', output: '员工主页 SLA 和逾期催办' },
];

const selectedRule = ref(rules.value[0]);
const editVisible = ref(false);
const testVisible = ref(false);
const publishVisible = ref(false);
const logVisible = ref(false);
const form = ref({ name: '', grade: '', source: '', trigger: '', owner: '', handlePath: '', reviewRole: '', closeRule: '' });

const stats = [
  { label: '预警方案', value: rules.value.length, tone: 'blue' },
  { label: '一级预警', value: rules.value.filter((item) => item.grade === '一级').length, tone: 'red' },
  { label: '今日触发', value: rules.value.reduce((sum, item) => sum + item.hitCount, 0), tone: 'orange' },
  { label: '已启用', value: rules.value.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核', value: rules.value.filter((item) => item.status !== '启用').length, tone: 'blue' },
];

function tagType(value: string) {
  if (['启用', '关闭'].includes(value)) return 'success';
  if (value === '一级' || value.includes('危急') || value.includes('禁上机')) return 'danger';
  if (value.includes('待') || value === '处理中' || value === '草稿') return 'warning';
  return 'info';
}

function selectRule(row: WarningRule): void {
  selectedRule.value = row;
}

function openEdit(row?: WarningRule): void {
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
            <h2>预警事件方案</h2>
            <p>定义危急值、透中风险、水质设备、感控和费用等预警的分级、责任人、处理路径、复核和关闭规则。</p>
          </div>
          <div class="rule-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEdit()">新增预警方案</el-button>
            <el-button :icon="Operation" @click="testVisible = true">触发仿真</el-button>
            <el-button :icon="SwitchButton" @click="publishVisible = true">发布启用</el-button>
            <el-button :icon="Connection" @click="logVisible = true">事件日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="rule-filter" inline>
        <el-form-item label="预警级别"><el-select placeholder="全部级别" clearable><el-option label="一级" value="1" /><el-option label="二级" value="2" /><el-option label="三级" value="3" /></el-select></el-form-item>
        <el-form-item label="来源"><el-select placeholder="全部来源" clearable><el-option label="检验" value="lab" /><el-option label="治疗" value="tx" /><el-option label="设备水质" value="device" /><el-option label="感控费用" value="ops" /></el-select></el-form-item>
        <el-form-item label="关键字"><el-input placeholder="预警、触发条件、责任人" clearable /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="rule-stat-grid">
        <el-card v-for="item in stats" :key="item.label" :class="['rule-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="rule-main-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>预警分级规则</strong><el-tag effect="plain">触发 -> 处理 -> 复核 -> 关闭</el-tag></div></template>
            <el-table :data="rules" border stripe highlight-current-row row-key="id" @row-click="selectRule">
              <el-table-column prop="name" label="预警名称" min-width="165" fixed="left" />
              <el-table-column prop="grade" label="级别" width="85"><template #default="{ row }"><el-tag :type="tagType(row.grade)">{{ row.grade }}</el-tag></template></el-table-column>
              <el-table-column prop="source" label="来源" min-width="130" />
              <el-table-column prop="trigger" label="触发条件" min-width="230" />
              <el-table-column prop="owner" label="责任人" min-width="110" />
              <el-table-column prop="handlePath" label="处理路径" min-width="200" />
              <el-table-column prop="reviewRole" label="复核角色" min-width="110" />
              <el-table-column prop="closeRule" label="关闭规则" min-width="160" />
              <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
              <el-table-column prop="hitCount" label="触发" width="75" />
              <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }"><el-button link type="primary" @click.stop="openEdit(row)">维护</el-button><el-button link @click.stop="selectRule(row); testVisible = true">仿真</el-button><el-button link @click.stop="selectRule(row); publishVisible = true">发布</el-button><el-button link @click.stop="selectRule(row); logVisible = true">追溯</el-button></template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="rule-side-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>当前预警闭环</strong><el-tag :type="tagType(selectedRule.grade)">{{ selectedRule.grade }}</el-tag></div></template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="触发">{{ selectedRule.trigger }}</el-descriptions-item>
              <el-descriptions-item label="责任">{{ selectedRule.owner }}</el-descriptions-item>
              <el-descriptions-item label="处理">{{ selectedRule.handlePath }}</el-descriptions-item>
              <el-descriptions-item label="复核">{{ selectedRule.reviewRole }}</el-descriptions-item>
              <el-descriptions-item label="关闭">{{ selectedRule.closeRule }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16" class="rule-extra-grid">
      <el-col :xs="24" :xl="14">
        <el-card class="rule-main-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>预警方案分类</strong><el-tag effect="plain">评估 / 检验 / 发生率 / 质控</el-tag></div></template>
          <el-table :data="warningCategoryRows" border stripe>
            <el-table-column prop="category" label="方案分类" min-width="190" />
            <el-table-column prop="source" label="来源" min-width="180" />
            <el-table-column prop="judgement" label="判读口径" min-width="180" />
            <el-table-column prop="level" label="默认级别" width="110" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :xl="10">
        <el-card class="rule-side-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>判读与时限配置</strong><el-tag type="success" effect="plain">标准 / 分级 / 时限</el-tag></div></template>
          <el-table :data="warningJudgementRows" border stripe>
            <el-table-column prop="item" label="配置项" min-width="130" />
            <el-table-column prop="content" label="配置内容" min-width="210" />
            <el-table-column prop="output" label="输出" min-width="170" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editVisible" title="维护预警事件方案" width="780px">
      <el-form :model="form" label-width="112px">
        <el-form-item label="预警名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="预警级别"><el-radio-group v-model="form.grade"><el-radio-button label="一级" /><el-radio-button label="二级" /><el-radio-button label="三级" /></el-radio-group></el-form-item>
        <el-form-item label="来源事件"><el-input v-model="form.source" /></el-form-item>
        <el-form-item label="触发条件"><el-input v-model="form.trigger" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="责任人"><el-input v-model="form.owner" /></el-form-item>
        <el-form-item label="处理路径"><el-input v-model="form.handlePath" /></el-form-item>
        <el-form-item label="复核角色"><el-input v-model="form.reviewRole" /></el-form-item>
        <el-form-item label="关闭规则"><el-input v-model="form.closeRule" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editVisible = false">取消</el-button><el-button type="primary" @click="editVisible = false; submit('预警方案已保存，等待触发仿真')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="testVisible" title="预警触发仿真" width="680px">
      <el-form label-width="110px"><el-form-item label="模拟来源"><el-input placeholder="输入检验、治疗、设备或感控记录编号" /></el-form-item><el-form-item label="触发条件"><el-input type="textarea" :rows="3" :value="selectedRule.trigger" /></el-form-item><el-form-item label="处理路径"><el-input :value="selectedRule.handlePath" /></el-form-item></el-form>
      <template #footer><el-button @click="testVisible = false">取消</el-button><el-button type="primary" @click="testVisible = false; submit('预警触发仿真通过，已生成测试事件')">开始仿真</el-button></template>
    </el-dialog>

    <el-dialog v-model="publishVisible" title="发布预警方案" width="540px">
      <el-alert type="warning" show-icon :closable="false" title="一级预警发布后会进入看板和员工主页，请确认责任人、升级和关闭规则。" />
      <el-form label-width="96px" style="margin-top: 16px"><el-form-item label="发布范围"><el-checkbox-group><el-checkbox label="科室看板" /><el-checkbox label="员工主页" /><el-checkbox label="业务页面拦截" /></el-checkbox-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form>
      <template #footer><el-button @click="publishVisible = false">取消</el-button><el-button type="primary" @click="publishVisible = false; selectedRule.status = '启用'; submit('预警方案已发布启用')">确认发布</el-button></template>
    </el-dialog>

    <el-drawer v-model="logVisible" title="预警事件日志" size="760px">
      <el-table :data="logs" border stripe><el-table-column prop="time" label="时间" width="150" /><el-table-column prop="warning" label="预警" min-width="150" /><el-table-column prop="patient" label="对象" width="100" /><el-table-column prop="owner" label="责任人" width="110" /><el-table-column prop="result" label="处理结果" min-width="170" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column></el-table>
    </el-drawer>
  </section>
</template>
