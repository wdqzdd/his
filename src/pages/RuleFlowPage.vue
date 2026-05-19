<script setup lang="ts">
import { ref } from 'vue';
import { Connection, DocumentAdd, Operation, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type FlowRule = {
  id: string;
  name: string;
  source: string;
  target: string;
  trigger: string;
  mapping: string;
  retry: string;
  audit: string;
  owner: string;
  status: string;
  syncCount: number;
  nextAction: string;
};

const rules = ref<FlowRule[]>([
  { id: 'FLW-001', name: 'HIS患者资料同步', source: 'HIS', target: '患者主档', trigger: '患者建档或资料更新', mapping: '姓名、证件、医保、联系人', retry: '失败3次转人工', audit: 'before_json/after_json', owner: '接口管理员', status: '启用', syncCount: 42, nextAction: '查看失败记录' },
  { id: 'FLW-002', name: 'LIS检验结果入库', source: 'LIS', target: '检验科工作站/医生站', trigger: '结果复核发布', mapping: '项目、结果、单位、参考范围、危急值', retry: '每10分钟重试', audit: '原始报告归档', owner: '检验接口员', status: '启用', syncCount: 86, nextAction: '复核危急值' },
  { id: 'FLW-003', name: 'PACS检查报告同步', source: 'PACS', target: '医生站检查查看', trigger: '报告审核完成', mapping: '检查项目、影像链接、报告结论', retry: '失败转人工补录', audit: '同步日志+报告快照', owner: '接口管理员', status: '启用', syncCount: 18, nextAction: '核对链接' },
  { id: 'FLW-004', name: 'EMR病历摘要回读', source: 'EMR', target: '医生诊疗基础', trigger: '责任患者打开', mapping: '诊断、过敏、既往史、出院小结', retry: '实时失败提示', audit: '访问审计', owner: '病历接口员', status: '启用', syncCount: 31, nextAction: '查看异常' },
  { id: 'FLW-005', name: '药房发药结果回写', source: '药房系统', target: '医嘱执行/费用', trigger: '发药或退药确认', mapping: '药品、批号、数量、发退状态', retry: '队列重试5次', audit: '药师签名日志', owner: '药房接口员', status: '启用', syncCount: 27, nextAction: '核对退药' },
  { id: 'FLW-006', name: '物资耗材库存同步', source: '物资系统', target: '药耗库存', trigger: '入库、出库、盘点', mapping: '耗材编码、批号、效期、库存', retry: '失败锁定批号', audit: '库存流水审计', owner: '物资接口员', status: '启用', syncCount: 54, nextAction: '处理低库存' },
  { id: 'FLW-007', name: '收费明细回写', source: '收费系统', target: '费用明细/欠费提醒', trigger: '费用确认或退费', mapping: '费用项目、金额、医保类别、余额', retry: '失败转费用管理员', audit: '费用对账日志', owner: '费用接口员', status: '待复核', syncCount: 19, nextAction: '复核口径' },
  { id: 'FLW-008', name: '透析机参数采集', source: '透析机联机', target: '治疗记录', trigger: '上机后定时采集', mapping: '血流量、跨膜压、超滤量、报警', retry: '断线缓存补传', audit: '设备采集日志', owner: '设备技师', status: '启用', syncCount: 128, nextAction: '查看断线' },
  { id: 'FLW-009', name: '体重血压采集', source: '接诊设备', target: '透前评估/签到', trigger: '刷卡或人脸识别', mapping: '体重、血压、心率、采集时间', retry: '手工确认补录', audit: '采集原始值留痕', owner: '导诊台', status: '启用', syncCount: 63, nextAction: '核对异常值' },
  { id: 'FLW-010', name: '归档记录写入报表', source: '治疗归档', target: '统计报表', trigger: '审核归档完成', mapping: '治疗日期、班次、机位、处方、并发症', retry: '报表队列重算', audit: '指标快照', owner: '统计分析员', status: '启用', syncCount: 74, nextAction: '核对指标' },
  { id: 'FLW-011', name: 'CRC授权患者共享', source: 'CRC站', target: '临床业务只读授权', trigger: '知情同意和授权完成', mapping: '受试者编号、授权范围、脱敏字段', retry: '人工复核', audit: '授权审计轨迹', owner: 'CRC负责人', status: '草稿', syncCount: 0, nextAction: '发布前测试' },
]);

const logs = ref([
  { time: '2026-05-14 13:10', flow: '透析机参数采集', source: 'DIA-A12', target: 'TX-20260514-036', result: '采集成功', status: '成功' },
  { time: '2026-05-14 12:20', flow: 'LIS检验结果入库', source: 'LAB-20260514-019', target: '医生站', result: '危急值同步', status: '成功' },
  { time: '2026-05-14 10:30', flow: '收费明细回写', source: 'FEE-20260514-008', target: '费用明细', result: '待人工复核', status: '待复核' },
  { time: '2026-05-14 09:18', flow: '体重血压采集', source: 'BP-03', target: '透前评估', result: '异常值已标记', status: '成功' },
]);

const flowCategoryRows = [
  { category: '评估数据流转', source: '医生/护士/患者端评估', target: '诊疗、预警、疗效分析', audit: '评估版本和提交人' },
  { category: '检验数据流转', source: 'LIS、手工录入、Excel导入', target: '检验结果、医生站、危急值', audit: '原始报告和复核人' },
  { category: '诊断数据流转', source: '智能诊断、医生确认', target: '患者诊断、医嘱、健康报告', audit: '确认/否认原因' },
  { category: '医嘱数据流转', source: '医生医嘱、药房审核', target: '护士执行、药耗费用、治疗记录', audit: '审核和执行日志' },
  { category: '任务数据流转', source: '规则命中、预警、CQI', target: '员工主页、看板、原业务页面', audit: '生成、催办、关闭日志' },
  { category: '附件数据流转', source: '报告、知情同意、证件、照片', target: '患者档案和业务单据', audit: '文件版本和访问日志' },
];

const endpointFlowRows = [
  { category: '患者端数据流转', path: '上传报告/评估/事件 -> 医护审核 -> 档案/预警/随访任务', fallback: '异常转人工审核' },
  { category: '工作站数据流转', path: '导诊、医生、护士、检验、设备、药耗、报表之间状态回写', fallback: '失败进入重试队列' },
];

const selectedRule = ref(rules.value[0]);
const editVisible = ref(false);
const testVisible = ref(false);
const publishVisible = ref(false);
const logVisible = ref(false);
const form = ref({ name: '', source: '', target: '', trigger: '', mapping: '', retry: '', audit: '', owner: '' });

const stats = [
  { label: '流转规则', value: rules.value.length, tone: 'blue' },
  { label: '已启用', value: rules.value.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '今日同步', value: rules.value.reduce((sum, item) => sum + item.syncCount, 0), tone: 'orange' },
  { label: '设备采集', value: rules.value.filter((item) => item.source.includes('设备') || item.source.includes('透析机')).length, tone: 'red' },
  { label: '待复核', value: rules.value.filter((item) => item.status !== '启用').length, tone: 'blue' },
];

function tagType(value: string) {
  if (['启用', '成功'].includes(value)) return 'success';
  if (value.includes('失败') || value.includes('断线') || value.includes('锁定')) return 'danger';
  if (value.includes('待') || value === '草稿') return 'warning';
  return 'info';
}

function selectRule(row: FlowRule): void {
  selectedRule.value = row;
}

function openEdit(row?: FlowRule): void {
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
            <h2>数据流转规则</h2>
            <p>维护院内接口、接诊设备、透析机、报表和研究授权的数据来源、目标、字段映射、重试和审计策略。</p>
          </div>
          <div class="rule-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEdit()">新增流转规则</el-button>
            <el-button :icon="Operation" @click="testVisible = true">映射测试</el-button>
            <el-button :icon="SwitchButton" @click="publishVisible = true">发布启用</el-button>
            <el-button :icon="Connection" @click="logVisible = true">同步日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="rule-filter" inline>
        <el-form-item label="来源系统"><el-select placeholder="全部来源" clearable><el-option label="HIS/LIS/PACS/EMR" value="hospital" /><el-option label="药房物资收费" value="ops" /><el-option label="接诊设备/透析机" value="device" /><el-option label="报表/CRC" value="report" /></el-select></el-form-item>
        <el-form-item label="同步状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="enabled" /><el-option label="待复核" value="review" /><el-option label="草稿" value="draft" /></el-select></el-form-item>
        <el-form-item label="关键字"><el-input placeholder="规则、来源、目标、字段" clearable /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="rule-stat-grid">
        <el-card v-for="item in stats" :key="item.label" :class="['rule-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="rule-main-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>数据流转配置</strong><el-tag effect="plain">来源 -> 映射 -> 目标 -> 重试 -> 审计</el-tag></div></template>
            <el-table :data="rules" border stripe highlight-current-row row-key="id" @row-click="selectRule">
              <el-table-column prop="name" label="规则名称" min-width="165" fixed="left" />
              <el-table-column prop="source" label="来源" min-width="115" />
              <el-table-column prop="target" label="目标" min-width="150" />
              <el-table-column prop="trigger" label="触发时机" min-width="160" />
              <el-table-column prop="mapping" label="字段映射" min-width="220" />
              <el-table-column prop="retry" label="失败重试" min-width="140"><template #default="{ row }"><el-tag :type="tagType(row.retry)">{{ row.retry }}</el-tag></template></el-table-column>
              <el-table-column prop="audit" label="审计留痕" min-width="150" />
              <el-table-column prop="owner" label="责任人" min-width="110" />
              <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
              <el-table-column prop="syncCount" label="同步" width="75" />
              <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }"><el-button link type="primary" @click.stop="openEdit(row)">维护</el-button><el-button link @click.stop="selectRule(row); testVisible = true">测试</el-button><el-button link @click.stop="selectRule(row); publishVisible = true">发布</el-button><el-button link @click.stop="selectRule(row); logVisible = true">日志</el-button></template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="rule-side-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>当前流转闭环</strong><el-tag :type="tagType(selectedRule.status)">{{ selectedRule.status }}</el-tag></div></template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="来源">{{ selectedRule.source }}</el-descriptions-item>
              <el-descriptions-item label="目标">{{ selectedRule.target }}</el-descriptions-item>
              <el-descriptions-item label="映射">{{ selectedRule.mapping }}</el-descriptions-item>
              <el-descriptions-item label="重试">{{ selectedRule.retry }}</el-descriptions-item>
              <el-descriptions-item label="审计">{{ selectedRule.audit }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16" class="rule-extra-grid">
      <el-col :xs="24" :xl="14">
        <el-card class="rule-main-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>数据流转分类</strong><el-tag effect="plain">评估 / 检验 / 诊断 / 医嘱 / 任务 / 附件</el-tag></div></template>
          <el-table :data="flowCategoryRows" border stripe>
            <el-table-column prop="category" label="流转分类" min-width="150" />
            <el-table-column prop="source" label="来源" min-width="200" />
            <el-table-column prop="target" label="目标" min-width="220" />
            <el-table-column prop="audit" label="审计留痕" min-width="150" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :xl="10">
        <el-card class="rule-side-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>患者端与工作站流转</strong><el-tag type="success" effect="plain">端到端</el-tag></div></template>
          <el-table :data="endpointFlowRows" border stripe>
            <el-table-column prop="category" label="分类" min-width="140" />
            <el-table-column prop="path" label="流转路径" min-width="260" />
            <el-table-column prop="fallback" label="失败处理" min-width="130" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editVisible" title="维护数据流转规则" width="780px">
      <el-form :model="form" label-width="112px">
        <el-form-item label="规则名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="来源系统"><el-input v-model="form.source" /></el-form-item>
        <el-form-item label="目标模块"><el-input v-model="form.target" /></el-form-item>
        <el-form-item label="触发时机"><el-input v-model="form.trigger" /></el-form-item>
        <el-form-item label="字段映射"><el-input v-model="form.mapping" type="textarea" :rows="3" placeholder="源字段 -> 目标字段、单位转换、字典映射" /></el-form-item>
        <el-form-item label="失败重试"><el-input v-model="form.retry" /></el-form-item>
        <el-form-item label="审计留痕"><el-input v-model="form.audit" /></el-form-item>
        <el-form-item label="责任人"><el-input v-model="form.owner" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editVisible = false">取消</el-button><el-button type="primary" @click="editVisible = false; submit('数据流转规则已保存，建议先做映射测试')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="testVisible" title="字段映射测试" width="700px">
      <el-form label-width="112px"><el-form-item label="源系统样本"><el-input placeholder="输入接口报文、设备采集或归档记录编号" /></el-form-item><el-form-item label="字段映射"><el-input type="textarea" :rows="3" :value="selectedRule.mapping" /></el-form-item><el-form-item label="目标模块"><el-input :value="selectedRule.target" /></el-form-item></el-form>
      <template #footer><el-button @click="testVisible = false">取消</el-button><el-button type="primary" @click="testVisible = false; submit('字段映射测试通过，已生成同步样本')">开始测试</el-button></template>
    </el-dialog>

    <el-dialog v-model="publishVisible" title="发布数据流转规则" width="540px">
      <el-alert type="warning" show-icon :closable="false" title="发布后会影响接口入库、设备采集、费用和报表口径，请确认映射、重试和审计策略。" />
      <el-form label-width="96px" style="margin-top: 16px"><el-form-item label="灰度范围"><el-checkbox-group><el-checkbox label="今日数据" /><el-checkbox label="指定院区" /><el-checkbox label="失败队列监控" /></el-checkbox-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form>
      <template #footer><el-button @click="publishVisible = false">取消</el-button><el-button type="primary" @click="publishVisible = false; selectedRule.status = '启用'; submit('数据流转规则已发布启用')">确认发布</el-button></template>
    </el-dialog>

    <el-drawer v-model="logVisible" title="数据同步日志" size="780px">
      <el-table :data="logs" border stripe><el-table-column prop="time" label="时间" width="150" /><el-table-column prop="flow" label="规则" min-width="160" /><el-table-column prop="source" label="来源" width="140" /><el-table-column prop="target" label="目标" min-width="150" /><el-table-column prop="result" label="结果" min-width="150" /><el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column></el-table>
    </el-drawer>
  </section>
</template>
